import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'All fields (Name, Email, Mobile, Password) are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // 1. Supabase Auth Signup
    const supabase = await createServerSupabaseClient();
    const { data: authData } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: name.trim(),
          phone: phone.trim(),
        },
      },
    });

    // Password hashed for database record
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        password: hashedPassword,
        supabaseAuthId: authData?.user?.id || null,
        role: 'CUSTOMER',
        customerProfile: {
          create: {},
        },
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed.' }, { status: 500 });
  }
}
