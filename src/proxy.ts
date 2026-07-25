import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';
import type { Session } from '@/lib/auth';
import { getRedirectForRole } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/register', '/api/auth/login', '/api/auth/register'];

const PATIENT_PATHS = ['/dashboard', '/profile', '/doctors', '/schedule', '/settings', '/support'];
const ADMIN_PATHS = ['/admin'];
const DOCTOR_PATHS = ['/doctor'];

function parseSession(value: string | undefined): Session | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as Session;
  } catch {
    return null;
  }
}

function redirectForRole(session: Session, request: NextRequest) {
  return NextResponse.redirect(new URL(getRedirectForRole(session.role), request.url));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (pathname === '/logout') {
    return NextResponse.next();
  }

  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/') {
    return redirectForRole(session, request);
  }

  if (ADMIN_PATHS.some((p) => pathname.startsWith(p)) && session.role !== 'admin') {
    return redirectForRole(session, request);
  }

  if (DOCTOR_PATHS.some((p) => pathname.startsWith(p)) && session.role !== 'doctor') {
    return redirectForRole(session, request);
  }

  if (PATIENT_PATHS.some((p) => pathname.startsWith(p)) && session.role !== 'patient') {
    return redirectForRole(session, request);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
