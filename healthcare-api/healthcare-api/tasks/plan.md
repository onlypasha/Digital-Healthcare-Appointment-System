# Implementation Plan - POST /api/MedicalRecord

## Architecture & Data Flow
1. Client mengirim `CreateMedicalRecordDto` (`AppointmentsId`, `Diagnosis`, `Prescription`, `Notes`) ke `MedicalRecordController`.
2. Controller mengekstrak `userId` & `role` dari JWT Claim, memanggil `IMedicalRecordService.CreateMedicalRecordAsync(...)`.
3. Service memvalidasi keberadaan `Appointment`:
   - Memastikan `Appointment` ada.
   - Jika role = Doctor, memastikan `Appointment.Doctors.UserId == userId`.
   - Mengambil `PatientsId` dan `DoctorsId` secara otomatis dari entitas `Appointment`.
4. Service membuat instance `MedicalRecord`, menyimpannya ke `TrxDbContext`, dan mengubah status `Appointment` menjadi `Completed` (jika belum).
5. Service mengembalikan `MedicalRecordResponseDto` yang berisi detail rekam medis.

## Order of Execution
1. Buat DTO (`Data/MedicalRecordDto.cs`).
2. Buat Interface (`Interface/IMedicalRecordService.cs`).
3. Buat Service Implementation (`Service/MedicalRecordService.cs`).
4. Buat Controller (`Controllers/MedicalRecordController.cs`).
5. Registrasikan Service di `Program.cs`.
6. Verifikasi build dengan `dotnet build`.
