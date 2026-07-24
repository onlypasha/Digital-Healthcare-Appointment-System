import { getSession } from '@/lib/auth';
import type { Appointment } from './types';

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5062';

const DEFAULT_APPOINTMENT_TIME = '00:00';

function parseTimeSlot(timeSlot: string | undefined): string {
  if (!timeSlot) return DEFAULT_APPOINTMENT_TIME;
  const normalized = timeSlot.trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match) {
    let hour = Number(match[1]);
    const minute = match[2];
    const period = match[3];
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    }
    if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  }
  return timeSlot;
}

export function getBackendBaseUrl() {
  return BACKEND_API_URL;
}

export async function backendFetch(path: string, options?: RequestInit) {
  const session = await getSession();
  const token = session?.token;
  const headers = new Headers(options?.headers ?? {});

  // Add ngrok bypass header
  headers.set('ngrok-skip-browser-warning', 'true');

  if (token) {
    headers.set('Authorization', 'Bearer ' + token);
  }

  if (options?.body && !headers.has('Content-Type') && !(options?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BACKEND_API_URL}${path}`, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Parse response from backend API
 * Backend may return plain text error or JSON success
 */
export async function parseBackendResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return await response.json();
  }
  
  // Plain text response
  const text = await response.text();
  if (!response.ok) {
    const isHtml = contentType?.includes('text/html') || /<\/?html|<!doctype/i.test(text || '');
    if (isHtml) {
      return { error: 'Server Sibuk', status: response.status };
    }
    return { error: text || 'Unknown error', status: response.status };
  }
  
  // Try to parse as JSON anyway
  try {
    return JSON.parse(text);
  } catch {
    return { data: text };
  }
}

export function mapBackendAppointment(dto: any): Appointment {
  const date = dto.appointmentsDate ? new Date(dto.appointmentsDate).toISOString().split('T')[0] : '';
  const time = dto.appointmentsDate
    ? new Date(dto.appointmentsDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '';

  return {
    id: String(dto.id ?? dto.Id ?? ''),
    patientId: dto.patientsId ? String(dto.patientsId) : String(dto.patientId ?? ''),
    patientName: dto.patientName ?? dto.PatientName ?? '',
    doctorId: dto.doctorsId ? String(dto.doctorsId) : String(dto.doctorId ?? ''),
    doctorName: dto.doctorName ?? dto.DoctorName ?? '',
    date,
    time,
    serviceType: dto.complaint ?? dto.Complaint ?? 'Konsultasi',
    status: dto.status ?? dto.Status ?? 'Pending',
    payment: 'N/A',
    notes: dto.complaint ?? dto.Complaint ?? '',
  };
}

export function buildAppointmentPayload(body: any) {
  const timePart = parseTimeSlot(body.time);
  const appointmentDate = body.date ? `${body.date}T${timePart}` : undefined;

  return {
    doctorId: Number(body.doctorId),
    appointmentsDate: appointmentDate ? new Date(appointmentDate).toISOString() : undefined,
    complaint: body.notes || body.serviceType || 'Janji Temu Pasien',
  };
}
