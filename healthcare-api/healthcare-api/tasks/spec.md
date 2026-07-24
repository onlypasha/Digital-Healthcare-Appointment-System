# Spec: Create Medical Record Endpoint (`POST /api/MedicalRecord`)

## Objective
Implementasi endpoint `POST /api/MedicalRecord` pada `healthcare-api` untuk mencatat rekam medis (diagnosa, resep obat, dan catatan medis) hasil pemeriksaan janji temu pasien oleh dokter atau admin.

## Tech Stack
- C# 13 / .NET 10.0 ASP.NET Core Web API
- Entity Framework Core 10 (PostgreSQL / `TrxDbContext`)
- ASP.NET Core Identity & JWT Authentication (`[Authorize(Roles = "Admin,Doctor")]`)

## Commands
- Build: `dotnet build`
- Run: `dotnet run`

## Project Structure & Touched Files
- `Data/MedicalRecordDto.cs` → Data Transfer Objects (`CreateMedicalRecordDto`, `MedicalRecordResponseDto`).
- `Interface/IMedicalRecordService.cs` → Kontrak interface layanan rekam medis.
- `Service/MedicalRecordService.cs` → Implementasi logika bisnis rekam medis (validasi appointment, otorisasi dokter, pembuatan record).
- `Controllers/MedicalRecordController.cs` → Controller HTTP endpoint `POST /api/MedicalRecord`.
- `Program.cs` → Registrasi `IMedicalRecordService` di DI Container.

## Code Style
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Doctor")]
public class MedicalRecordController(IMedicalRecordService service) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<MedicalRecordResponseDto>> CreateMedicalRecord([FromBody] CreateMedicalRecordDto request)
    {
        var userId = GetUserId();
        var role = GetUserRole();
        var result = await service.CreateMedicalRecordAsync(request, userId, role);
        if (result == null)
            return BadRequest("Gagal membuat rekam medis. Pastikan ID Janji Temu benar dan Anda memiliki otorisasi.");

        return Ok(result);
    }
}
```

## Testing Strategy
- Kompilasi seluruh kode dengan `dotnet build` tanpa error maupun warning baru.
- Verifikasi alur penanganan validasi ID Appointment, penentuan ID Dokter/Pasien otomatis, dan penyimpanan ke `TrxDbContext`.

## Boundaries
- **Always do:** Menggunakan DTO untuk request & response, memvalidasi keberadaan `Appointment`, menggunakan pencatatan waktu UTC (`DateTime.UtcNow`).
- **Ask first:** Mengubah skema DB atau membuat migrasi DB baru jika tidak diperlukan.
- **Never do:** Membiarkan dokter membuat rekam medis untuk janji temu dokter lain (kecuali role Admin).

## Success Criteria
1. `CreateMedicalRecordDto` & `MedicalRecordResponseDto` dibuat di `Data/MedicalRecordDto.cs`.
2. `IMedicalRecordService` terdefinisi dengan method `Task<MedicalRecordResponseDto?> CreateMedicalRecordAsync(...)`.
3. `MedicalRecordService` terimplementasi & terisi di `TrxDbContext`.
4. `MedicalRecordController` terpasang endpoint `POST /api/MedicalRecord`.
5. Service terdaftar di `Program.cs`.
6. Proyek berhasil di-build (`dotnet build`) dengan 0 error.
