import { NextResponse } from 'next/server';
import { getPatientById, getPatients } from '@/lib/store';
import { getSession } from '@/lib/auth';
import { backendFetch, mapBackendPatient, parseBackendResponse } from '@/lib/backend';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    // Try backend API first
    if (session.token) {
      const endpoint = id ? `/api/Patient/${id}` : '/api/Patient';
      const backendResponse = await backendFetch(endpoint, { method: 'GET' });

      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        if (id) {
          return NextResponse.json(mapBackendPatient(backendData));
        }
        const rawPatients = Array.isArray(backendData) ? backendData : backendData.data || [];
        const patients = rawPatients.map(mapBackendPatient);
        return NextResponse.json(patients);
      }
    }
  } catch (error) {
    console.error('Error fetching patients from backend:', error);
  }

  // Fallback to local mock data
  if (id) {
    const patient = getPatientById(id);
    if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(patient);
  }

  return NextResponse.json(getPatients());
}

