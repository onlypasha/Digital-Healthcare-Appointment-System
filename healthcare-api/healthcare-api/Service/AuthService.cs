using healthcare_api.Data;
using healthcare_api.Db;
using healthcare_api.Interface;
using healthcare_api.Models.Transactional;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using healthcare_api.Messaging.Events;
using MassTransit;

namespace healthcare_api.Service
{
    public class AuthService(TrxDbContext context, IConfiguration configuration, IPublishEndpoint publishEndpoint) : IAuthService
    {
        private readonly TrxDbContext context = context ?? throw new ArgumentNullException(nameof(context));
        private readonly IConfiguration configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        private readonly IPublishEndpoint publishEndpoint = publishEndpoint ?? throw new ArgumentNullException(nameof(publishEndpoint));

        public async Task<RegisterPatientDto?> RegisterPatientAsync(RegisterPatientDto request)
        {
            if (await context.Users.AnyAsync(u => u.Email == request.Email)) {
                return null;
            }

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

            return new RegisterPatientDto { Email = request.Email };
        }

        public async Task<RegisterDoctorDto?> RegisterDoctorAsync(RegisterDoctorDto request)
        {
            if (await context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return null;
            }

            var user = new User
            {
                Email = request.Email,
                Name = request.Name,
                Role = "Doctor",
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };
            user.PasswordHash = new PasswordHasher<User>().HashPassword(user, request.Password);

            var doctor = new Doctor
            {
                User = user,
                SpecializationId = request.SpecializationId,
                Phone = request.Phone,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(user);
            context.Doctors.Add(doctor);
            await context.SaveChangesAsync();

            // Publish event notification
            await publishEndpoint.Publish(new DoctorRegisteredEvent(
                doctor.Id,
                user.Name ?? string.Empty,
                user.Email ?? string.Empty,
                doctor.SpecializationId ?? 0
            ));

            return new RegisterDoctorDto { Email = request.Email };
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto request)
        {
            // Cek Admin Hardcoded
            var adminUsername = configuration["AdminCred:Username"];
            var adminPassword = configuration["AdminCred:Passsword"] ?? configuration["AdminCred:Password"];

            if (!string.IsNullOrEmpty(adminUsername) && !string.IsNullOrEmpty(adminPassword) &&
                request.Email == adminUsername && request.Password == adminPassword)
            {
                var adminUser = new User
                {
                    Id = 0,
                    Name = "Administrator",
                    Email = adminUsername,
                    Role = "Admin",
                    Status = "Active"
                };

                return new LoginResponseDto
                {
                    Token = CreateToken(adminUser),
                    User = new UserDto
                    {
                        Id = adminUser.Id,
                        Name = adminUser.Name ?? string.Empty,
                        Email = adminUser.Email ?? string.Empty,
                        Role = adminUser.Role ?? string.Empty
                    }                };
            }

            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.Status != "Active")
            {
                return null;
            }

            var result = new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash!, request.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return null;
            }

            return new LoginResponseDto
            {
                Token = CreateToken(user),
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    Role = user.Role ?? string.Empty
                }
            };
        }

        public Task LogoutAsync()
        {
            // For stateless JWT authentication, client handles token removal.
            // Server-side cleanup or audit logging can be performed here if needed.
            return Task.CompletedTask;
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
