import { NextResponse } from 'next/server';
import { SESSION_COOKIE, getRedirectForRole } from '@/lib/auth';
import { backendFetch, parseBackendResponse } from '@/lib/backend';
import { authenticate, getDoctorById, getUserByEmail } from '@/lib/store';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
  }

  let session: any = null;

  try {
    // Call backend API for authentication
    const backendResponse = await backendFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const backendData = await parseBackendResponse(backendResponse);

    if (backendResponse.ok) {
      const userData = backendData.data || backendData.user || backendData;
      const user = userData.user || userData;
      const token = userData.token || backendData.token || '';

      if (user?.email) {
        session = {
          userId: String(user.id || user.userId || ''),
          role: String(user.role || '').toLowerCase(),
          name: String(user.name || user.fullName || user.displayName || ''),
          email: String(user.email || ''),
          token: String(token || ''),
          patientId: user.patientId,
          doctorId: user.doctorId,
          status: user.status,
        };
      }
    }
  } catch (error) {
    console.warn('Backend login failed, using local auth fallback:', error);
  }

  
  if (!session) {
    const localUser = authenticate(email, password);
    if (!localUser) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    session = {
      userId: localUser.id,
      role: localUser.role,
      name: localUser.name,
      email: localUser.email,
      token: `mock-token-${Date.now()}`,
      patientId: localUser.patientId,
      doctorId: localUser.doctorId,
      status: localUser.status,
    };
  }

  // Check Approval Status for Doctors
  if (session.role === 'doctor') {
    // Prefer authoritative status from backend (session.status) when available.
    // Only fall back to local store checks if session.status is missing.
    const localUser = getUserByEmail(session.email);
    const doctorObj = session.doctorId ? getDoctorById(session.doctorId) : undefined;

    const backendPending = session.status === 'pending_approval';
    const backendRejected = session.status === 'rejected';

    const localPending = localUser?.status === 'pending_approval' || doctorObj?.status === 'Pending';
    const localRejected = localUser?.status === 'rejected' || doctorObj?.status === 'Rejected';

    const isPending = backendPending || (!session.status && localPending);
    const isRejected = backendRejected || (!session.status && localRejected);

    if (isPending) {
      return NextResponse.json(
        { error: 'Akun Dokter Anda sedang dalam proses persetujuan oleh Super Admin. Silakan tunggu verifikasi sebelum dapat masuk ke portal.' },
        { status: 403 }
      );
    }

    if (isRejected) {
      return NextResponse.json(
        { error: 'Pendaftaran akun Dokter Anda tidak disetujui oleh Super Admin.' },
        { status: 403 }
      );
    }
  }

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
}
