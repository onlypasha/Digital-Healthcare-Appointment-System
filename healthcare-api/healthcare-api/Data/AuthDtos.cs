using System.ComponentModel.DataAnnotations;

namespace healthcare_api.Data
{
    public class RegisterPatientDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public DateOnly? BirthDate { get; set; }
        public string? Gender { get; set; }
        public string? BloodType { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class RegisterDoctorDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Speacialization { get; set; } = string.Empty;

        public decimal? ConsultationFee { get; set; }
        public string? Scedule { get; set; }
        public string? Phone { get; set; }
    }

    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class UserDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = new();
    }
}
