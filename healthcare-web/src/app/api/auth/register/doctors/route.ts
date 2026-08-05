import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { backendFetch, mapBackendDoctor, parseBackendResponse } from '@/lib/backend';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const statusFilter = searchParams.get('status'); // Bisa untuk filter 'Pending' / 'Active'

  try {
    const backendResponse = await backendFetch('/api/Doctor', {
      method: 'GET',
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: 'Gagal mengambil data dokter dari server backend .NET' },
        { status: backendResponse.status }
      );
    }

    const backendData = await parseBackendResponse(backendResponse);
    
    // Normalisasi array dari response backend
    const rawDoctors = Array.isArray(backendData)
      ? backendData
      : backendData?.data || backendData?.doctors || [];

    const allDoctors = rawDoctors.map(mapBackendDoctor);

    // Detail per ID
    if (id) {
      const doctor = allDoctors.find((d: any) => String(d.id) === String(id) || String(d.userId) === String(id));
      if (!doctor) return NextResponse.json({ error: 'Dokter tidak ditemukan' }, { status: 404 });
      return NextResponse.json(doctor);
    }

    // Filter berdasarkan status jika ada query ?status=Pending
    if (statusFilter) {
      const filtered = allDoctors.filter(
        (d: any) => String(d.status).toLowerCase() === statusFilter.toLowerCase()
      );
      return NextResponse.json(filtered);
    }

    return NextResponse.json(allDoctors);
  } catch (error) {
    console.error('Error fetching doctors from backend:', error);
    return NextResponse.json(
      { error: 'Server backend .NET tidak dapat dijangkau' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    const backendResponse = await backendFetch('/api/Doctor', {
      method: 'POST',
      body: JSON.stringify({
        name: body.name,
        specialty: body.specialty,
        hospital: body.hospital ?? 'General Hospital',
        gender: body.gender ?? 'male',
        experience: body.experience ?? '5+ Years Exp.',
        bio: body.bio ?? '',
        expertise: body.expertise ?? [],
        education: body.education ?? [],
        location: body.location ?? '',
        fee: Number(body.fee) || 150000,
        status: body.status || 'Pending',
      }),
    });

    const backendData = await parseBackendResponse(backendResponse);

    if (!backendResponse.ok) {
      return NextResponse.json(backendData, { status: backendResponse.status });
    }

    return NextResponse.json(backendData, { status: 201 });
  } catch (error) {
    console.error('Error creating doctor on backend:', error);
    return NextResponse.json({ error: 'Gagal menghubungkan ke backend .NET' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { error: 'Akses ditolak. Hanya Admin / SA yang dapat memverifikasi dokter.' },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { id, status } = body as { id: string; status: 'Active' | 'Pending' | 'Rejected' };

  if (!id || !status) {
    return NextResponse.json({ error: 'ID dokter dan status wajib diisi' }, { status: 400 });
  }

  try {
    // Coba ganti status lewat PATCH /api/Doctor/{id}
    let backendResponse = await backendFetch(`/api/Doctor/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    // Jika .NET menolak PATCH (405 Method Not Allowed / 404), fallback ke PUT
    if (backendResponse.status === 405 || backendResponse.status === 404) {
      backendResponse = await backendFetch(`/api/Doctor/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    }

    const backendData = await parseBackendResponse(backendResponse);

    if (!backendResponse.ok) {
      return NextResponse.json(backendData, { status: backendResponse.status });
    }

    return NextResponse.json({
      success: true,
      doctor: backendData,
      message: `Status dokter berhasil diubah menjadi ${status}`,
    });
  } catch (e) {
    console.error('Backend status update failed:', e);
    return NextResponse.json({ error: 'Gagal update status di backend .NET' }, { status: 500 });
  }
}