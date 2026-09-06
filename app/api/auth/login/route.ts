import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const rateLimit = checkRateLimit(`login:${ip}`, 10, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Authoritative Supabase Auth Authentication (Single Source of Truth)
    const supabase = await createServerSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (authError || !authData?.user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 2. Server-side role resolution from PostgreSQL database
    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { supabaseAuthId: authData.user.id },
          { email: cleanEmail },
        ],
      },
    });

    if (!dbUser) {
      // First login after Supabase signup: create initial customer record
      dbUser = await prisma.user.create({
        data: {
          supabaseAuthId: authData.user.id,
          email: cleanEmail,
          name: authData.user.user_metadata?.name || cleanEmail.split('@')[0],
          phone: authData.user.user_metadata?.phone || '',
          role: 'CUSTOMER',
          customerProfile: {
            create: {},
          },
        },
      });
    } else if (!dbUser.supabaseAuthId) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { supabaseAuthId: authData.user.id },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        role: dbUser.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
