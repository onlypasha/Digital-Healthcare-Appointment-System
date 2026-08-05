import { NextResponse } from 'next/server';
import { SESSION_COOKIE, getRedirectForRole } from '@/lib/auth';
import { backendFetch, parseBackendResponse } from '@/lib/backend';

// Mapping nama spesialisasi dari UI ke ID angka untuk .NET
const SPECIALIZATION_MAP: Record<string, number> = {
  'Dokter Umum': 1,
  'Spesialis Anak': 2,
  'Spesialis Penyakit Dalam': 3,
  'Spesialis Jantung': 4,
  'Spesialis Kulit & Kelamin': 5,
  'Spesialis Saraf (Neurology)': 6,
  'Spesialis Saraf': 6,
  'Spesialis Mata': 7,
  'Spesialis Gigi': 8,
};

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
      fee,
    } = body as {
      name?: string;
      email?: string;
      password?: string;
      role?: 'patient' | 'doctor' | 'admin';
      phone?: string;
      gender?: string;
      specialty?: string;
      fee?: number | string;
    };

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (role === 'admin' || (role !== 'patient' && role !== 'doctor')) {
      return NextResponse.json(
        { error: 'Pendaftaran hanya diizinkan untuk Pasien dan Dokter Medis.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // 1. Register User ke backend .NET
    // Kirim role dalam format string biasa dan PascalCase jika perlu
    const formattedRole = role === 'doctor' ? 'Doctor' : 'Patient';

    let backendResponse;
    try {
      backendResponse = await backendFetch('/api/auth/register/doctor', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          role: formattedRole,
          phone,
          gender,
        }),
      });
    } catch (netErr) {
      console.error('Koneksi ke backend .NET gagal:', netErr);
      return NextResponse.json(
        { error: 'Tidak dapat terhubung ke server backend .NET (Port 5000/5001).' },
        { status: 502 }
      );
    }

    const backendData = await parseBackendResponse(backendResponse);

    if (!backendResponse.ok) {
      const errMsg =
        typeof backendData === 'string'
          ? backendData
          : backendData?.message || backendData?.error || backendData?.title || 'Gagal mendaftar ke server backend .NET';
      return NextResponse.json({ error: errMsg }, { status: backendResponse.status });
    }

    const userData = backendData.data || backendData.user || backendData;
    const user = userData.user || userData;
    const token = userData.token || backendData.token || '';
    const userId = Number(user?.id || user?.userId || userData?.id || 0);

    // 2. Jika Role = Doctor, daftarkan detail dokter
    if (role === 'doctor') {
      const specId =
        typeof specialty === 'number'
          ? specialty
          : SPECIALIZATION_MAP[specialty || ''] || Number(specialty) || 1;

      // Safe call ke /api/Doctor agar tidak bikin "Unknown error" kalau endpoint butuh Auth khusus
      try {
        const docRes = await backendFetch('/api/Doctor', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: JSON.stringify({
            userId: userId,
            consultationFee: Number(fee) || 150000,
            specializationId: specId,
            phone: phone || null,
          }),
        });

        if (!docRes.ok) {
          const docErrData = await parseBackendResponse(docRes);
          console.warn('Backend /api/Doctor mengembalikan status non-OK:', docRes.status, docErrData);
        }
      } catch (docErr) {
        console.error('Gagal memanggil POST /api/Doctor:', docErr);
      }

      const response = NextResponse.json({
        success: true,
        pendingApproval: true,
        message:
          'Pendaftaran Dokter berhasil dikirim! Akun Dokter Anda saat ini memerlukan persetujuan & verifikasi dari Super Admin (SA) sebelum Anda dapat masuk ke portal.',
      });
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }

    // 3. Jika Pasien
    const sessionData = {
      userId: String(userId),
      role: 'patient',
      name: String(user.name || name),
      email: String(user.email || email),
      token: String(token || ''),
      status: 'active',
    };

    const redirect = getRedirectForRole('patient');
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
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan internal saat pendaftaran.' },
      { status: 500 }
    );
  }
}