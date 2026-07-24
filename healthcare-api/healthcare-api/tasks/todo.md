# Task List: Auth Logout Feature

- [x] Task 1: Update `IAuthService` interface
  - Acceptance: `Task LogoutAsync();` ditambahkan ke `IAuthService.cs`
  - Verify: Kompilasi interface
  - Files: `Interface/IAuthService.cs`

- [x] Task 2: Implement `LogoutAsync` in `AuthService`
  - Acceptance: Method `LogoutAsync()` diimplementasikan di `AuthService.cs`
  - Verify: Kompilasi service
  - Files: `Service/AuthService.cs`

- [x] Task 3: Expose `Logout` endpoint in `AuthController`
  - Acceptance: `[Authorize] [HttpPost("logout")]` ditambahkan ke `AuthController.cs`
  - Verify: Endpoint siap digunakan
  - Files: `Controllers/AuthController.cs`

- [x] Task 4: Verify build
  - Acceptance: `dotnet build` berhasil dengan 0 Error
  - Verify: Executable build command `dotnet build`
  - Files: N/A
