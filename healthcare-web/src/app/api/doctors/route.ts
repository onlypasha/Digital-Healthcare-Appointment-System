import { NextResponse } from 'next/server';
import { backendFetch, parseBackendResponse, mapBackendDoctor } from '@/lib/backend';
import { getSession } from '@/lib/auth';
import { getDoctorById, getDoctors, updateDoctorStatus } from '@/lib/store';

export async function GET(request: Request) {
  const session = await getSession();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  let backendDoctors: any[] = [];
  let fetchedBackend = false;

  try {
    if (session?.token) {
      const endpoint = id ? `/api/Doctor/${id}` : '/api/Doctor';
      const backendResponse = await backendFetch(endpoint, {
        method: 'GET',
      });

      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        if (id) {
          return NextResponse.json(mapBackendDoctor(backendData));
        }
        const rawDoctors = Array.isArray(backendData) ? backendData : backendData.data || [];
        backendDoctors = rawDoctors.map(mapBackendDoctor);
        fetchedBackend = true;
      }
    }
  } catch (error) {
    console.error('Error fetching doctors from backend:', error);
  }

  const localDoctors = getDoctors();

  if (id) {
    const doctor = getDoctorById(id) || backendDoctors.find((d) => String(d.id) === String(id));
    if (!doctor) {
      return NextResponse.json({ error: 'Dokter tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(doctor);
  }

  if (!fetchedBackend) {
    return NextResponse.json(localDoctors);
  }

  // Gabungkan dokter dari backend dan dokter lokal (termasuk dokter baru terdaftar ber-status Pending)
  const mergedDoctors = [...backendDoctors];
  for (const localDoc of localDoctors) {
    const existsInBackend = mergedDoctors.some(
      (d) => String(d.id) === String(localDoc.id) || (Boolean(localDoc.email) && d.email === localDoc.email)
    );
    if (!existsInBackend) {
      mergedDoctors.push(localDoc);
    }
  }

  return NextResponse.json(mergedDoctors);
}

export async function PATCH(request: Request) {
  const session = await getSession();
  const body = await request.json();
  const { id, status } = body;

  let backendUpdated = false;

  try {
    if (session?.token) {
      const backendResponse = await backendFetch(`/api/Doctor/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      if (backendResponse.ok) {
        backendUpdated = true;
      }
    }
  } catch (error) {
    console.error('Error updating doctor on backend:', error);
  }

  // Selalu perbarui status dokter di store lokal
  const updated = updateDoctorStatus(id, status);

  if (!updated && !backendUpdated) {
    return NextResponse.json({ error: 'Dokter tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: `Status dokter berhasil diubah menjadi ${status}`,
    doctor: updated,
  });
}
