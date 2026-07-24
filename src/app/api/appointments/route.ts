import { NextResponse } from 'next/server';
import { buildAppointmentPayload, backendFetch, parseBackendResponse } from '@/lib/backend';
import { getSession } from '@/lib/auth';
import { addAppointment, getAppointmentById, getAppointments, getDoctorById, getPatientById, updateAppointment } from '@/lib/store';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') ?? undefined;

  try {
    // Try to fetch from backend API first
    if (session.token) {
      const backendResponse = await backendFetch('/api/Appointment', {
        method: 'GET',
      });

      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        let appointments = Array.isArray(backendData) ? backendData : backendData.data || [];

        // Filter by status if provided
        if (status && status !== 'all') {
          appointments = appointments.filter((a: any) => a.status === status);
        }

        return NextResponse.json(appointments);
      }
    }
  } catch (error) {
    console.error('Error fetching appointments from backend:', error);
    // Fall back to local store on error
  }

  // Fallback to local mock data
  let appointments = getAppointments();
  if (session.role === 'patient') {
    appointments = getAppointments({ patientId: session.patientId });
  } else if (session.role === 'doctor') {
    appointments = getAppointments({ doctorId: session.doctorId });
  }

  const filtered = status && status !== 'all'
    ? appointments.filter((appointment) => appointment.status === status)
    : appointments;

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'patient') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const payload = buildAppointmentPayload(body);
  if (!payload.appointmentsDate) {
    return NextResponse.json({ error: 'Tanggal janji temu tidak valid' }, { status: 400 });
  }

  try {
    // Try to create on backend first
    if (session.token) {
      const backendResponse = await backendFetch('/api/Appointment', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        return NextResponse.json(backendData, { status: 201 });
      }
    }
  } catch (error) {
    console.error('Error creating appointment on backend:', error);
    // Fall back to local store on error
  }

  // Fallback to local mock data
  const patient = session.patientId ? getPatientById(session.patientId) : undefined;
  const doctor = body.doctorId ? getDoctorById(String(body.doctorId)) : undefined;
  const appointment = addAppointment({
    patientId: patient?.id ?? session.userId,
    patientName: patient?.name ?? session.name,
    doctorId: String(body.doctorId ?? ''),
    doctorName: doctor?.name ?? 'Dokter',
    date: payload.appointmentsDate.split('T')[0],
    time: payload.appointmentsDate.split('T')[1] ?? '00:00',
    serviceType: body.serviceType || 'Konsultasi',
    status: 'Confirmed',
    payment: 'Unpaid',
    notes: body.notes || body.serviceType || 'Janji Temu Pasien',
  });

  return NextResponse.json(appointment, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, status } = body as { id: string; status?: string };

  if (!id || !status) {
    return NextResponse.json({ error: 'Data status janji temu tidak lengkap' }, { status: 400 });
  }

  try {
    // Try to update on backend first
    if (session.token) {
      const backendResponse = await backendFetch(`/api/Appointment/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      if (backendResponse.ok) {
        const backendData = await parseBackendResponse(backendResponse);
        return NextResponse.json(backendData);
      }
    }
  } catch (error) {
    console.error('Error updating appointment on backend:', error);
    // Fall back to local store on error
  }

  // Fallback to local mock data
  const appointment = getAppointmentById(id);
  if (!appointment) {
    return NextResponse.json({ error: 'Janji temu tidak ditemukan' }, { status: 404 });
  }

  if (status !== 'Cancelled' && status !== 'Completed') {
    return NextResponse.json({ error: 'Status tidak didukung' }, { status: 400 });
  }

  const updated = updateAppointment(id, { status });
  if (!updated) {
    return NextResponse.json({ error: 'Gagal mengubah status janji temu' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Berhasil mengubah status janji temu' });
}
