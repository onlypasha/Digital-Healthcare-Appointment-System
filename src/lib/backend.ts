import { getSession } from '@/lib/auth';
import type { Appointment, AppointmentStatus, Doctor, HealthRecord, Patient, PaymentStatus } from './types';

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

  const isLoginPath = String(path).toLowerCase().includes('/auth/login');
  if (token && !isLoginPath) {
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

export function mapBackendDoctor(dto: any): Doctor {
  return {
    id: String(dto.id ?? dto.Id ?? dto.doctorId ?? ''),
    name: dto.name ?? dto.Name ?? 'Dr. ' + (dto.specialty ?? 'Umum'),
    specialty: dto.specialty ?? dto.Specialty ?? dto.specialisation ?? 'Dokter Umum',
    hospital: dto.hospital ?? dto.Hospital ?? 'Rumah Sakit Umum',
    rating: Number(dto.rating ?? dto.Rating ?? 4.8),
    reviews: Number(dto.reviews ?? dto.Reviews ?? 12),
    gender: (dto.gender ?? dto.Gender ?? 'male').toString().toLowerCase() === 'female' ? 'female' : 'male',
    experience: dto.experience ?? dto.Experience ?? '5+ Tahun Pengalaman',
    bio: dto.bio ?? dto.Bio ?? 'Spesialis medis berdedikasi.',
    expertise: Array.isArray(dto.expertise ?? dto.Expertise)
      ? dto.expertise ?? dto.Expertise
      : [dto.specialty ?? dto.Specialty ?? 'Konsultasi Medis'],
    education: Array.isArray(dto.education ?? dto.Education)
      ? dto.education ?? dto.Education
      : [{ title: 'Fakultas Kedokteran', detail: 'Spesialis' }],
    location: dto.location ?? dto.Location ?? 'Jakarta',
    fee: Number(dto.fee ?? dto.Fee ?? 150000),
    availableSlots: Array.isArray(dto.availableSlots ?? dto.AvailableSlots)
      ? dto.availableSlots ?? dto.AvailableSlots
      : ['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM'],
  };
}

export function mapBackendPatient(dto: any): Patient {
  return {
    id: String(dto.id ?? dto.Id ?? dto.patientId ?? ''),
    name: dto.name ?? dto.Name ?? dto.fullName ?? 'Pasien',
    email: dto.email ?? dto.Email ?? '',
    phone: dto.phone ?? dto.Phone ?? dto.phoneNumber ?? '-',
    mrn: dto.mrn ?? dto.Mrn ?? `MRN-${dto.id ?? '001'}`,
    bloodType: dto.bloodType ?? dto.BloodType ?? 'O+',
    age: Number(dto.age ?? dto.Age ?? 30),
    gender: dto.gender ?? dto.Gender ?? 'Laki-laki',
    address: dto.address ?? dto.Address ?? '-',
    emergencyContact: dto.emergencyContact ?? dto.EmergencyContact ?? '-',
    status: dto.status ?? dto.Status ?? 'Active',
  };
}

export function mapBackendAppointment(dto: any): Appointment {
  const rawDate = dto.appointmentsDate ?? dto.AppointmentsDate ?? dto.date ?? dto.Date;
  let date = '';
  let time = '';
  if (rawDate) {
    try {
      const d = new Date(rawDate);
      date = d.toISOString().split('T')[0];
      time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch {
      date = String(rawDate);
    }
  }

  return {
    id: String(dto.id ?? dto.Id ?? ''),
    patientId: String(dto.patientsId ?? dto.patientId ?? dto.PatientId ?? ''),
    patientName: dto.patientName ?? dto.PatientName ?? dto.patient?.name ?? 'Pasien',
    doctorId: String(dto.doctorsId ?? dto.doctorId ?? dto.DoctorId ?? ''),
    doctorName: dto.doctorName ?? dto.DoctorName ?? dto.doctor?.name ?? 'Dokter',
    date: date || new Date().toISOString().split('T')[0],
    time: time || '09:00',
    serviceType: dto.complaint ?? dto.Complaint ?? dto.serviceType ?? 'Konsultasi',
    status: (dto.status ?? dto.Status ?? 'Pending') as AppointmentStatus,
    payment: (dto.payment ?? dto.Payment ?? 'N/A') as PaymentStatus,
    notes: dto.complaint ?? dto.Complaint ?? dto.notes ?? '',
  };
}

export function mapBackendHealthRecord(dto: any): HealthRecord {
  const vitals = dto.vitals ?? dto.Vitals ?? {};
  const heartRate = Number(vitals.heartRate ?? vitals.HeartRate ?? dto.heartRate ?? 75);
  const bpSys = Number(vitals.bloodPressureSystolic ?? vitals.BloodPressureSystolic ?? dto.systolic ?? 120);
  const bpDia = Number(vitals.bloodPressureDiastolic ?? vitals.BloodPressureDiastolic ?? dto.diastolic ?? 80);
  const weight = Number(vitals.weight ?? vitals.Weight ?? dto.weight ?? 65);

  return {
    id: String(dto.id ?? dto.Id ?? ''),
    patientId: String(dto.patientId ?? dto.PatientId ?? dto.patientsId ?? ''),
    patientName: dto.patientName ?? dto.PatientName ?? 'Pasien',
    doctorId: String(dto.doctorId ?? dto.DoctorId ?? dto.doctorsId ?? ''),
    doctorName: dto.doctorName ?? dto.DoctorName ?? 'Dokter',
    appointmentId: String(dto.appointmentId ?? dto.AppointmentId ?? ''),
    date: dto.date ?? dto.Date ?? new Date().toISOString().split('T')[0],
    vitals: {
      heartRate,
      bloodPressureSystolic: bpSys,
      bloodPressureDiastolic: bpDia,
      weight,
      temperature: vitals.temperature ?? dto.temperature,
      oxygenSaturation: vitals.oxygenSaturation ?? dto.oxygenSaturation,
    },
    heartRateStatus: dto.heartRateStatus ?? (heartRate > 100 ? 'Tinggi' : heartRate < 60 ? 'Rendah' : 'Normal'),
    bloodPressureStatus: dto.bloodPressureStatus ?? (bpSys >= 140 ? 'Tinggi' : bpSys < 90 ? 'Rendah' : 'Stabil'),
    weightNote: dto.weightNote ?? 'Pemeriksaan rutin',
    diagnosis: dto.diagnosis ?? dto.Diagnosis ?? 'Kondisi Baik',
    notes: dto.notes ?? dto.Notes ?? '',
    recommendations: dto.recommendations ?? dto.Recommendations ?? 'Istirahat yang cukup',
  };
}

export function buildAppointmentPayload(body: any) {
  const timePart = parseTimeSlot(body.time);
  const appointmentDate = body.date ? `${body.date}T${timePart}` : undefined;

  return {
    doctorId: Number(body.doctorId) || body.doctorId,
    appointmentsDate: appointmentDate ? new Date(appointmentDate).toISOString() : new Date().toISOString(),
    complaint: body.notes || body.serviceType || 'Janji Temu Pasien',
  };
}

