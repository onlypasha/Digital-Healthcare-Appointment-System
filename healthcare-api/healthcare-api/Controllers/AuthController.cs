using healthcare_api.Data;
using healthcare_api.Db;
using healthcare_api.Models.Transactional;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace healthcare_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(TrxDbContext context, IConfiguration configuration) : ControllerBase
    {
        [HttpPost("register/patient")]
        public async Task<ActionResult> RegisterPatient(RegisterPatientDto request)
        {
            // mengecek apakah pasien sudah terdaftar melalui email
            // blok if ini dijalankan jika pasien sudah terdaftar
            if (await context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("Email sudah terdaftar.");
            }

            // membuat user baru dengan role "Patient"
            var user = new User
            {
                Email = request.Email,
                Name = request.Name,
                Role = "Patient",
                CreatedAt = DateTime.UtcNow
            };
            user.PasswordHash = new PasswordHasher<User>().HashPassword(user, request.Password);

            // detail dari Patient
            var patient = new Patient
            {
                User = user,
                BirthDate = request.BirthDate,
                Gender = request.Gender,
                BloodType = request.BloodType,
                Phone = request.Phone,
                Address = request.Address,
                CreatedAt = DateTime.UtcNow
            };


            // save ke db
            context.Users.Add(user);
            context.Patients.Add(patient);
            await context.SaveChangesAsync();

            return Ok(new { message = "Registrasi Pasien berhasil", email = user.Email });
        }

        [HttpPost("register/doctor")]
        public async Task<ActionResult> RegisterDoctor(RegisterDoctorDto request)
        {
            // mengecek apakah dokter sudah terdaftar melalui email
            // blok if ini dijalankan jika dokter sudah terdaftar
            if (await context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("Email sudah terdaftar.");
            }

            // membuat user baru dengan role "Doctor"
            var user = new User
            {
                Email = request.Email,
                Name = request.Name,
                Role = "Doctor",
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };
            user.PasswordHash = new PasswordHasher<User>().HashPassword(user, request.Password);

            // detail dokter
            var doctor = new Doctor
            {
                User = user,
                Speacialization = request.Speacialization,
                ConsultationFee = request.ConsultationFee,
                Scedule = request.Scedule,
                Phone = request.Phone,
                CreatedAt = DateTime.UtcNow
            };

            // save ke db
            context.Users.Add(user);
            context.Doctors.Add(doctor);
            await context.SaveChangesAsync();

            return Ok(new { message = "Registrasi Dokter berhasil. Menunggu persetujuan Admin.", email = user.Email });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto request)
        {
            // Cek Admin Hardcoded dari appsettings.json
            var adminUsername = configuration["AdminCred:Username"];
            var adminPassword = configuration["AdminCred:Passsword"]; // Menggunakan typo 'Passsword' sesuai config

            // blok if ini dijalanka jika:
            // 1. Username dan Password tidak kosong
            // 2. Field email yang diisi adalah username dari admin (karena admin hardcoded)
            // 3. Field password yang diisi adalah password dari admin
            if (!string.IsNullOrEmpty(adminUsername) && !string.IsNullOrEmpty(adminPassword) &&
                request.Email == adminUsername && request.Password == adminPassword)
            {

                // membuat user baru dengan role Admin
                var adminUser = new User
                {
                    Id = 0,
                    Name = "Administrator",
                    Email = adminUsername,
                    Role = "Admin",
                    Status = "Active"
                };

                return Ok(new
                {
                    message = "Login Admin berhasil",
                    token = CreateToken(adminUser),
                    user = new
                    {
                        id = adminUser.Id,
                        name = adminUser.Name,
                        email = adminUser.Email,
                        role = adminUser.Role
                    }
                });
            }

            // Jika bukan admin, cek database
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return BadRequest("Email atau Password salah.");
            }

            if (user.Status != "Active")
            {
                return BadRequest($"Akun Anda tidak aktif. Status saat ini: {user.Status}");
            }

            var result = new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash!, request.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return BadRequest("Email atau Password salah.");
            }

            var token = CreateToken(user);

            return Ok(new
            {
                message = "Login berhasil",
                token = token,
                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role
                }
            });
        }

        [HttpPut("approve-doctor/{userId}")]
        public async Task<ActionResult> ApproveDoctor(long userId)
        {
            // Menemukan User id dari dokter
            var user = await context.Users.FindAsync(userId);

            if (user == null || user.Role != "Doctor")
            {
                return NotFound("Dokter tidak ditemukan.");
            }

            // Merubah status dari InActive jadi Active
            user.Status = "Active";
            await context.SaveChangesAsync();

            return Ok(new { message = "Akun Dokter telah disetujui dan diaktifkan." });
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Role, user.Role!)
            };

            var jwtSettings = configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
