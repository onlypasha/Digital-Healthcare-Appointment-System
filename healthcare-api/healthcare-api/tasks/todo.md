- [x] Task 1: Create MedicalRecord DTOs (`Data/MedicalRecordDto.cs`)
  - Acceptance: DTOs for `CreateMedicalRecordDto` and `MedicalRecordResponseDto` are defined.
  - Verify: `dotnet build`
  - Files: `Data/MedicalRecordDto.cs`

- [x] Task 2: Create `IMedicalRecordService` interface (`Interface/IMedicalRecordService.cs`)
  - Acceptance: `IMedicalRecordService` defines `CreateMedicalRecordAsync`.
  - Verify: `dotnet build`
  - Files: `Interface/IMedicalRecordService.cs`

- [x] Task 3: Implement `MedicalRecordService` (`Service/MedicalRecordService.cs`)
  - Acceptance: `CreateMedicalRecordAsync` validates appointment, checks doctor authorization, saves `MedicalRecord`, and updates appointment status.
  - Verify: `dotnet build`
  - Files: `Service/MedicalRecordService.cs`

- [x] Task 4: Create `MedicalRecordController` (`Controllers/MedicalRecordController.cs`)
  - Acceptance: Endpoint `POST /api/MedicalRecord` is exposed with `[Authorize(Roles = "Admin,Doctor")]`.
  - Verify: `dotnet build`
  - Files: `Controllers/MedicalRecordController.cs`

- [x] Task 5: Register service in `Program.cs` & Verify Build
  - Acceptance: `IMedicalRecordService` registered in DI, solution builds cleanly with 0 errors.
  - Verify: `dotnet build`
  - Files: `Program.cs`
