import { NextResponse } from 'next/server';
import { addDoctor, getDoctorById, getDoctors, updateDoctorStatus } from '@/lib/store';
import { getSession } from '@/lib/auth';
import { backendFetch, mapBackendDoctor, parseBackendResponse } from '@/lib/backend';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const session = await getSession();

  let backendDoctors: any[] = [];

  try {
    // Try to fetch from backend API first
    if (session?.token) {
      const backendResponse = await backendFetch('/api/Doctor', {
        method: 'GET',
      });

      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        const rawDoctors = Array.isArray(backendData) ? backendData : backendData.data || [];
        backendDoctors = rawDoctors.map(mapBackendDoctor);
      }
    }
  } catch (error) {
    console.error('Error fetching doctors from backend:', error);
  }

  // Combine backend doctors with local store doctors so pending approval doctors are always visible
  const localDoctors = getDoctors();
  const mergedMap = new Map<string, any>();

  for (const doc of backendDoctors) {
    if (doc.id) mergedMap.set(String(doc.id), doc);
  }
  for (const localDoc of localDoctors) {
    if (!mergedMap.has(String(localDoc.id)) || localDoc.status === 'Pending') {
      mergedMap.set(String(localDoc.id), localDoc);
    }
  }

  const allDoctors = Array.from(mergedMap.values());

  if (id) {
    const doctor = allDoctors.find((d: any) => String(d.id) === id);
    if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doctor);
  }

  return NextResponse.json(allDoctors);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    // Try to create on backend first
    if (session.token) {
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
          fee: Number(body.fee) || 150,
        }),
      });

      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        return NextResponse.json(backendData, { status: 201 });
      }
    }
  } catch (error) {
    console.error('Error creating doctor on backend:', error);
    // Fall back to local store on error
  }

  // Fallback to local mock data
  const doctor = addDoctor({
    name: body.name,
    specialty: body.specialty,
    hospital: body.hospital ?? 'General Hospital',
    rating: 4.5,
    reviews: 0,
    gender: body.gender ?? 'male',
    experience: body.experience ?? '5+ Years Exp.',
    bio: body.bio ?? '',
    expertise: body.expertise ?? [],
    education: body.education ?? [],
    location: body.location ?? '',
    fee: Number(body.fee) || 150,
    status: 'Active',
  });

  return NextResponse.json(doctor, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Akses ditolak. Hanya Admin / SA yang dapat memverifikasi dokter.' }, { status: 403 });
  }

  const body = await request.json();
  const { id, status } = body as { id: string; status: 'Active' | 'Pending' | 'Rejected' };

  if (!id || !status) {
    return NextResponse.json({ error: 'ID dokter dan status wajib diisi' }, { status: 400 });
  }

  try {
    if (session.token) {
      const backendResponse = await backendFetch(`/api/Doctor/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        return NextResponse.json(backendData);
      }
    }
  } catch (e) {
    console.warn('Backend patch failed, using local status update:', e);
  }

  const updated = updateDoctorStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: 'Dokter tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({ success: true, doctor: updated, message: `Status dokter berhasil diubah menjadi ${status}` });
}
