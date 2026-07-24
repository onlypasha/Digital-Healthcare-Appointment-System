import { NextResponse } from 'next/server';
import { SESSION_COOKIE, getRedirectForRole } from '@/lib/auth';
import { backendFetch, parseBackendResponse } from '@/lib/backend';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
  }

  try {
    // Call backend API for authentication
    const backendResponse = await backendFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const backendData = await parseBackendResponse(backendResponse);

    // Handle error responses
    if (!backendResponse.ok) {
      const errorMsg = backendData.error || backendData.message || 'Email atau password salah';
      return NextResponse.json(
        { error: errorMsg },
        { status: backendResponse.status }
      );
    }

    // Extract user info from backend response
    // Handle multiple possible response formats
    const userData = backendData.data || backendData.user || backendData;
    const user = userData.user || userData;
    const token = userData.token || backendData.token || '';

    if (!user?.email) {
      return NextResponse.json(
        { error: 'Invalid response format from server' },
        { status: 500 }
      );
    }

    // Normalize user data
    const session = {
      userId: String(user.id || user.userId || ''),
      role: String(user.role || '').toLowerCase(),
      name: String(user.name || user.fullName || user.displayName || ''),
      email: String(user.email || ''),
      token: String(token || ''),
      patientId: user.patientId,
      doctorId: user.doctorId,
    };

    const redirect = getRedirectForRole(session.role);
    const response = NextResponse.json({
      success: true,
      redirect,
      user: { name: session.name, role: session.role, email: session.email },
    });

    response.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login. Coba lagi nanti.' },
      { status: 500 }
    );
  }
}
