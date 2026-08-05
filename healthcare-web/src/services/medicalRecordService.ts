import { parseBackendResponse } from '@/lib/backend';

/**
 * Request DTO untuk membuat Medical Record baru
 * Endpoint: POST /api/MedicalRecord
 */
export interface CreateMedicalRecordDto {
  /** ID Janji Temu (int64, required) */
  appointmentsId: number;
  /** Diagnosis medis (string, required) */
  diagnosis: string;
  /** Resep obat (string, optional / nullable) */
  prescription?: string | null;
  /** Catatan pemeriksaan (string, optional / nullable) */
  notes?: string | null;
}

/**
 * Response DTO untuk Data Item Rekam Medis
 * Sesuai struktur response dari backend:
 * - GET /api/MedicalRecord/user/{userId}
 * - GET /api/MedicalRecord/appointment/{appointmentId}
 */
export interface MedicalRecordDto {
  id: string;
  createdAt: string;
  appointmentsId: string;
  patientsId: string;
  patientName: string;
  doctorsId: string;
  doctorName: string;
  diagnosis: string;
  prescription: string | null;
  notes: string | null;
}

/**
 * Wrapper Standar Respons API Service Client
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export class MedicalRecordApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.BACKEND_API_URL ||
      'http://localhost:5062';
  }

  /**
   * Helper internal untuk mendapatkan Header HTTP lengkap (Header Auth & Ngrok Skip Warning)
   */
  private getHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * 1. Create Medical Record
   * HTTP Method: POST
   * Endpoint: /api/MedicalRecord
   * 
   * @param payload Request body berisi data rekam medis
   * @param token Bearer authentication token (opsional)
   */
  async createMedicalRecord(
    payload: CreateMedicalRecordDto,
    token?: string
  ): Promise<ApiResponse<MedicalRecordDto>> {
    // Validasi field wajib di sisi client
    if (payload.appointmentsId === undefined || payload.appointmentsId === null || isNaN(payload.appointmentsId)) {
      return { success: false, error: 'Field "appointmentsId" (int64) wajib diisi' };
    }
    if (!payload.diagnosis || !payload.diagnosis.trim()) {
      return { success: false, error: 'Field "diagnosis" (string) wajib diisi' };
    }

    const requestBody: CreateMedicalRecordDto = {
      appointmentsId: Number(payload.appointmentsId),
      diagnosis: payload.diagnosis.trim(),
      prescription: payload.prescription ?? null,
      notes: payload.notes ?? null,
    };

    try {
      const res = await fetch(`${this.baseUrl}/api/MedicalRecord`, {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(requestBody),
      });

      const data = await parseBackendResponse(res);

      if (!res.ok) {
        return {
          success: false,
          status: res.status,
          error: data?.error || data?.message || `Gagal membuat rekam medis (Status Code: ${res.status})`,
        };
      }

      return {
        success: true,
        status: res.status,
        data: data as MedicalRecordDto,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Terjadi kesalahan koneksi saat membuat rekam medis',
      };
    }
  }

  /**
   * 2. Get Medical Records by User ID
   * HTTP Method: GET
   * Endpoint: /api/MedicalRecord/user/{userId}
   * 
   * @param userId ID Pengguna (int64, required)
   * @param token Bearer authentication token (opsional)
   */
  async getMedicalRecordsByUserId(
    userId: number | string,
    token?: string
  ): Promise<ApiResponse<MedicalRecordDto[]>> {
    if (userId === undefined || userId === null || String(userId).trim() === '') {
      return { success: false, error: 'Parameter "userId" (int64) wajib diisi' };
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/MedicalRecord/user/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await parseBackendResponse(res);

      if (!res.ok) {
        return {
          success: false,
          status: res.status,
          error: data?.error || data?.message || `Gagal mengambil rekam medis user (Status Code: ${res.status})`,
        };
      }

      const records = Array.isArray(data) ? data : data?.data || [];
      return {
        success: true,
        status: res.status,
        data: records as MedicalRecordDto[],
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Terjadi kesalahan koneksi saat mengambil rekam medis user',
      };
    }
  }

  /**
   * 3. Get Medical Record by Appointment ID
   * HTTP Method: GET
   * Endpoint: /api/MedicalRecord/appointment/{appointmentId}
   * 
   * @param appointmentId ID Janji Temu (int64, required)
   * @param token Bearer authentication token (opsional)
   */
  async getMedicalRecordByAppointmentId(
    appointmentId: number | string,
    token?: string
  ): Promise<ApiResponse<MedicalRecordDto>> {
    if (appointmentId === undefined || appointmentId === null || String(appointmentId).trim() === '') {
      return { success: false, error: 'Parameter "appointmentId" (int64) wajib diisi' };
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/MedicalRecord/appointment/${appointmentId}`, {
        method: 'GET',
        headers: this.getHeaders(token),
      });

      const data = await parseBackendResponse(res);

      if (!res.ok) {
        return {
          success: false,
          status: res.status,
          error: data?.error || data?.message || `Gagal mengambil rekam medis janji temu (Status Code: ${res.status})`,
        };
      }

      return {
        success: true,
        status: res.status,
        data: data as MedicalRecordDto,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Terjadi kesalahan koneksi saat mengambil rekam medis janji temu',
      };
    }
  }
}

// Singleton Instance Export
export const medicalRecordService = new MedicalRecordApiClient();

// Standalone Helper Function Exports
export const createMedicalRecord = (payload: CreateMedicalRecordDto, token?: string) =>
  medicalRecordService.createMedicalRecord(payload, token);

export const getMedicalRecordsByUserId = (userId: number | string, token?: string) =>
  medicalRecordService.getMedicalRecordsByUserId(userId, token);

export const getMedicalRecordByAppointmentId = (appointmentId: number | string, token?: string) =>
  medicalRecordService.getMedicalRecordByAppointmentId(appointmentId, token);
