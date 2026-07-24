import { NextResponse } from 'next/server';
import { getPatientById, getPatients } from '@/lib/store';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const patient = getPatientById(id);
    if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(patient);
  }

  return NextResponse.json(getPatients());
}
