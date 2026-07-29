import { NextResponse } from 'next/server';
import { getAppointmentById } from '@/lib/store';
import { getSession } from '@/lib/auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const appointment = getAppointmentById(id);

  if (!appointment) {
    return NextResponse.json({ error: 'Janji temu tidak ditemukan' }, { status: 404 });
  }

  if (session.role === 'doctor' && appointment.doctorId !== session.doctorId) {
    return NextResponse.json({ error: 'Akses ditolak untuk janji temu ini' }, { status: 403 });
  }

  if (session.role === 'patient' && appointment.patientId !== session.patientId) {
    return NextResponse.json({ error: 'Akses ditolak untuk janji temu ini' }, { status: 403 });
  }

  return NextResponse.json(appointment);
}
