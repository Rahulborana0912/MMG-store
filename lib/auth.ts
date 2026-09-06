import { createServerSupabaseClient } from '@/lib/supabase-server';
import prisma from '@/lib/prisma';

export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  supabaseAuthId?: string;
}

/**
 * Authoritative Server-Side User Retrieval via Supabase Auth
 * 
 * Production: Supabase Auth is the single source of truth for authentication.
 * Authorization is strictly resolved from the PostgreSQL database User.role.
 */
export async function getCurrentUser(): Promise<AuthSession | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser }, error } = await supabase.auth.getUser();

    if (authUser && authUser.email) {
      // Map Supabase Auth UUID / Email to Application Database User
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { supabaseAuthId: authUser.id },
            { email: authUser.email.toLowerCase().trim() },
          ],
        },
      });

      if (dbUser) {
        // Link supabaseAuthId if not yet persisted
        if (!dbUser.supabaseAuthId) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { supabaseAuthId: authUser.id },
          });
        }

        return {
          userId: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role as UserRole,
          supabaseAuthId: authUser.id,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error resolving current user session:', error);
    return null;
  }
}

/**
 * Server-Side RBAC Guard
 * Enforces role permissions. Never trusts client-supplied headers or roles.
 */
export async function requireAuth(roles?: UserRole[]): Promise<AuthSession> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  if (roles && !roles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

/**
 * IDOR Guard (Insecure Direct Object Reference)
 * Ensures CUSTOMER users can strictly access only records belonging to their own userId.
 */
export function checkResourceOwnership(user: AuthSession, resourceOwnerId?: string | null): boolean {
  if (user.role === 'ADMIN' || user.role === 'STAFF') {
    return true;
  }
  if (!resourceOwnerId) return false;
  return user.userId === resourceOwnerId;
}
