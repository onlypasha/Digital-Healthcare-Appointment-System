# Technical Implementation Plan: Auth Logout Feature

## 1. Component Breakdown & Order
1. **Interface Layer (`Interface/IAuthService.cs`)**:
   - Tambahkan method signature `Task LogoutAsync();`
2. **Service Layer (`Service/AuthService.cs`)**:
   - Implementasikan method `LogoutAsync()` yang menangani logika logout.
3. **Controller Layer (`Controllers/AuthController.cs`)**:
   - Tambahkan endpoint `POST api/Auth/logout` dengan atribut `[Authorize]` yang memanggil `service.LogoutAsync()`.
4. **Verification**:
   - Jalankan `dotnet build` untuk memastikan proyek terkompilasi tanpa error.

## 2. Dependency Graph & Strategy
- Interface -> Service Implementation -> Controller Endpoint -> Verification.
