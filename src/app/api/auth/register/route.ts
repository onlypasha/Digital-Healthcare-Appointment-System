import { NextResponse } from 'next/server';
import { SESSION_COOKIE, getRedirectForRole } from '@/lib/auth';
import { backendFetch, parseBackendResponse } from '@/lib/backend';
import { registerUser } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      role = 'patient',
      phone,
      gender,
      specialty,
      hospital,
      experience,
      fee,
      location,
      bio,
      expertise,
    } = body as {
      name?: string;
      email?: string;
      password?: string;
      role?: 'patient' | 'doctor' | 'admin';
      phone?: string;
      gender?: string;
      specialty?: string;
      hospital?: string;
      experience?: string;
      fee?: number;
      location?: string;
      bio?: string;
      expertise?: string[];
    };

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    let sessionData: any = null;

    // 1. Try backend registration
    try {
      const backendResponse = await backendFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
          gender,
          specialty,
          hospital,
          experience,
          fee,
          location,
          bio,
          expertise,
        }),
      });

      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        const userData = backendData.data || backendData.user || backendData;
        const user = userData.user || userData;
        const token = userData.token || backendData.token || '';

        if (user?.email) {
          sessionData = {
            userId: String(user.id || user.userId || ''),
            role: String(user.role || role).toLowerCase(),
            name: String(user.name || name),
            email: String(user.email || email),
            token: String(token || ''),
            patientId: user.patientId,
            doctorId: user.doctorId,
            status: user.status,
          };
        }
      }
    } catch (e) {
      console.warn('Backend registration failed, using local registration fallback:', e);
    }

    // 2. Fallback to local store registration
    if (!sessionData) {
      try {
        const localUser = registerUser({
          name,
          email,
          password,
          role,
          phone,
          gender,
          specialty,
          hospital,
          experience,
          fee,
          location,
          bio,
          expertise,
        });

        sessionData = {
          userId: localUser.id,
          role: localUser.role,
          name: localUser.name,
          email: localUser.email,
          token: `mock-token-${Date.now()}`,
          patientId: localUser.patientId,
          doctorId: localUser.doctorId,
          status: localUser.status,
        };
      } catch (err: any) {
        return NextResponse.json(
          { error: err.message || 'Gagal mendaftarkan akun' },
          { status: 400 }
        );
      }
    }

    // Doctor registration requires Super Admin approval
    if (role === 'doctor') {
      return NextResponse.json({
        success: true,
        pendingApproval: true,
        message: 'Pendaftaran dokter berhasil! Akun Anda sedang menunggu persetujuan dari Super Admin sebelum dapat digunakan untuk masuk ke portal.',
      });
    }

    const redirect = getRedirectForRole(sessionData.role);
    const response = NextResponse.json({
      success: true,
      redirect,
      user: { name: sessionData.name, role: sessionData.role, email: sessionData.email },
    });

    response.cookies.set(SESSION_COOKIE, JSON.stringify(sessionData), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat pendaftaran. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
