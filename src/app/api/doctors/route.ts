import { NextResponse } from 'next/server';
import { addDoctor, getDoctorById, getDoctors } from '@/lib/store';
import { getSession } from '@/lib/auth';
import { backendFetch, parseBackendResponse } from '@/lib/backend';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const session = await getSession();

  try {
    // Try to fetch from backend API first
    if (session?.token) {
      const backendResponse = await backendFetch('/api/Doctor', {
        method: 'GET',
      });

      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        let doctors = Array.isArray(backendData) ? backendData : backendData.data || [];
        
        // Filter by id if provided
        if (id) {
          const doctor = doctors.find((d: any) => String(d.id) === id);
          if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
          return NextResponse.json(doctor);
        }

        return NextResponse.json(doctors);
      }
    }
  } catch (error) {
    console.error('Error fetching from backend:', error);
    // Fall back to local store on error
  }

  // Fallback to local mock data
  if (id) {
    const doctor = getDoctorById(id);
    if (!doctor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doctor);
  }

  return NextResponse.json(getDoctors());
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
  });

  return NextResponse.json(doctor, { status: 201 });
}
