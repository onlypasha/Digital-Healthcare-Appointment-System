using healthcare_api.Data;
using healthcare_api.Db;
using healthcare_api.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace healthcare_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService service) : ControllerBase
    {
        [HttpPost("register/patient")]
        public async Task<ActionResult> RegisterPatient(RegisterPatientDto request)
        {
            var user = await service.RegisterPatientAsync(request);

            if (user == null)
            {
                return BadRequest("Email sudah terdaftar.");
            }
            return Ok(new { message = "Registrasi Pasien berhasil", email = user.Email });
        }

        [HttpPost("register/doctor")]
        public async Task<ActionResult> RegisterDoctor(RegisterDoctorDto request)
        {
            var user = await service.RegisterDoctorAsync(request);

            if (user == null)
            {
                return BadRequest("Email sudah terdaftar.");
            }
            return Ok(new { message = "Registrasi Dokter berhasil. Menunggu persetujuan Admin.", email = user.Email });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto request)
        {
            var response = await service.LoginAsync(request);

            if (response == null)
            {
                return BadRequest("Email atau Password salah, atau akun tidak aktif.");
            }

            return Ok(new
            {
                message = "Login berhasil",
                token = response.Token,
                user = response.User
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await service.LogoutAsync();

            return Ok(new
            {
                message = "Logout berhasil"
            });
        }
    }
}