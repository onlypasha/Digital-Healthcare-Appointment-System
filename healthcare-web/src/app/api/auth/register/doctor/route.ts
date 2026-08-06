import { NextResponse } from 'next/server';
import { backendFetch, parseBackendResponse } from '@/lib/backend';
import { addDoctor, getUserByEmail } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      gender,
      specialty,
      hospital,
      experience,
      fee,
      location,
      bio,
      expertise,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Periksa apakah email sudah terdaftar di store lokal
    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan gunakan email lain.' },
        { status: 400 }
      );
    }

    let backendMessage = '';

    // Coba kirim ke backend API terlebih dahulu
    try {
      const backendResponse = await backendFetch('/api/auth/register/doctor', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'Doctor',
          phone,
          gender,
        }),
      });

      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        backendMessage = backendData?.message || '';
      }
    } catch (err) {
      console.warn('Backend doctor registration warning:', err);
    }

    // Daftarkan ke mock store lokal dengan status 'Pending' (memerlukan persetujuan Super Admin)
    addDoctor(
      {
        name,
        email,
        password,
        phone: phone || '-',
        specialty: specialty || 'Dokter Umum',
        hospital: hospital || 'CareConnect Clinic',
        rating: 5.0,
        reviews: 0,
        gender: gender === 'female' ? 'female' : 'male',
        experience: experience || '1+ Tahun Pengalaman',
        bio: bio || 'Dokter Medis Spesialis',
        status: 'Pending',
        expertise: Array.isArray(expertise) ? expertise : [specialty || 'Konsultasi Medis'],
        education: [{ title: 'Fakultas Kedokteran', detail: 'Spesialis Medis' }],
        location: location || 'Jakarta',
        fee: Number(fee) || 150000,
      },
      false
    );

    return NextResponse.json({
      success: true,
      pendingApproval: true,
      message:
        backendMessage ||
        'Pendaftaran Dokter berhasil dikirim! Akun Dokter Anda saat ini memerlukan persetujuan & verifikasi dari Super Admin (SA) sebelum Anda dapat masuk ke portal.',
    });
  } catch (error: any) {
    console.error('Doctor registration error:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal melakukan pendaftaran dokter' },
      { status: 500 }
    );
  }
}
