import { cookies } from 'next/headers';
import type { UserRole } from './types';
import { getUserById } from './store';

export const SESSION_COOKIE = 'careconnect_session';

export interface Session {
  userId: string;
  role: UserRole;
  name: string;
  email: string;
  token?: string;
  doctorId?: string;
  patientId?: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return getUserById(session.userId) ?? null;
}

export function getRedirectForRole(role: string): string {
  const normalizedRole = role?.toLowerCase();
  if (normalizedRole === 'admin') return '/admin/dashboard';
  if (normalizedRole === 'doctor') return '/doctor/dashboard';
  return '/dashboard';
}
