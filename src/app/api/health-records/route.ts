import { NextResponse } from 'next/server';
import {
  addHealthRecord,
  getHealthRecordByAppointment,
  getHealthRecords,
  getLatestHealthRecord,
} from '@/lib/store';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const latest = searchParams.get('latest') === 'true';

  if (session.role === 'patient') {
    const patientId = session.patientId ?? '1';
    if (latest) {
      const record = getLatestHealthRecord(patientId);
      return NextResponse.json(record ?? null);
    }
    return NextResponse.json(getHealthRecords({ patientId }));
  }

  if (session.role === 'doctor') {
    const doctorId = session.doctorId;
    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor profile not linked' }, { status: 400 });
    }
    const patientId = searchParams.get('patientId') ?? undefined;
    return NextResponse.json(getHealthRecords({ doctorId, patientId }));
  }

  if (session.role === 'admin') {
    const patientId = searchParams.get('patientId') ?? undefined;
    const doctorId = searchParams.get('doctorId') ?? undefined;
    if (latest && patientId) {
      return NextResponse.json(getLatestHealthRecord(patientId) ?? null);
    }
    return NextResponse.json(getHealthRecords({ patientId, doctorId }));
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'doctor') {
    return NextResponse.json({ error: 'Hanya dokter yang dapat mencatat hasil pemeriksaan' }, { status: 403 });
  }

  const doctorId = session.doctorId;
  if (!doctorId) {
    return NextResponse.json({ error: 'Profil dokter tidak terhubung' }, { status: 400 });
  }

  const body = await request.json();
  const { appointmentId, patientId, vitals, diagnosis, notes, recommendations } = body;

  if (!appointmentId || !patientId || !vitals) {
    return NextResponse.json({ error: 'Data pemeriksaan tidak lengkap' }, { status: 400 });
  }

  const existing = getHealthRecordByAppointment(appointmentId);
  if (existing) {
    return NextResponse.json({ error: 'Pemeriksaan untuk janji temu ini sudah dicatat' }, { status: 409 });
  }

  const record = addHealthRecord({
    patientId,
    doctorId,
    appointmentId,
    vitals: {
      heartRate: Number(vitals.heartRate),
      bloodPressureSystolic: Number(vitals.bloodPressureSystolic),
      bloodPressureDiastolic: Number(vitals.bloodPressureDiastolic),
      weight: Number(vitals.weight),
      temperature: vitals.temperature ? Number(vitals.temperature) : undefined,
      oxygenSaturation: vitals.oxygenSaturation ? Number(vitals.oxygenSaturation) : undefined,
    },
    diagnosis: diagnosis ?? '',
    notes: notes ?? '',
    recommendations: recommendations ?? '',
  });

  if (!record) {
    return NextResponse.json({ error: 'Gagal menyimpan hasil pemeriksaan' }, { status: 400 });
  }

  return NextResponse.json(record, { status: 201 });
}
