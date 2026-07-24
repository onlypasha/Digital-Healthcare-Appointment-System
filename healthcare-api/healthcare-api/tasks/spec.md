# Spec: Auth Logout Feature

## Objective
Menambahkan fitur logout pada `healthcare-api`. Fitur ini memfasilitasi penanganan alur penutupan sesi otentikasi di sisi server (menerima request logout terotentikasi dan mengembalikan konfirmasi sukses).

## Tech Stack
- C# / .NET 10.0 Web API
- JWT Authentication (Bearer Token)
- ASP.NET Core MVC Controllers

## Commands
- Build: `dotnet build`
- Run: `dotnet run`
- Test API: `healthcare-api.http` / Scalar UI

## Project Structure
- `Interface/IAuthService.cs` → Definisi kontrak interface `Task LogoutAsync()`
- `Service/AuthService.cs` → Implementasi method `LogoutAsync()`
- `Controllers/AuthController.cs` → Endpoint `POST /api/Auth/logout`

## Code Style
```csharp
[Authorize]
[HttpPost("logout")]
public async Task<ActionResult> Logout()
{
    await service.LogoutAsync();
    return Ok(new { message = "Logout berhasil" });
}
```

## Testing Strategy
- Verifikasi kompilasi proyek dengan `dotnet build`.
- Pengujian endpoint `POST /api/Auth/logout` dengan token JWT terotentikasi.

## Boundaries
- **Always do:** Mengikuti pola arsitektur DI (Dependency Injection), mendokumentasikan method dengan XML comments.
- **Ask first:** Perubahan skema database atau penambahan middleware token revocation terpusat.
- **Never do:** Mengubah signature method registrasi/login yang sudah ada atau merusak kontrak endpoint yang sudah ada.

## Success Criteria
1. `IAuthService` memiliki definisi `Task LogoutAsync();`
2. `AuthService` mengimplementasikan `LogoutAsync()` secara asynchronous.
3. `AuthController` memiliki action method `[HttpPost("logout")]` terotentikasi yang memanggil `LogoutAsync()` dan mengembalikan HTTP 200 OK dengan pesan respon `"Logout berhasil"`.
4. `dotnet build` berjalan sukses tanpa error.
