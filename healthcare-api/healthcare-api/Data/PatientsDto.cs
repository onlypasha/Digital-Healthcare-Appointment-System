using System;

namespace healthcare_api.Data
{
    public class PatientsResponseDto
    {
        public long Id { get; set; }

        public long? UserId { get; set; }

        public string? Name { get; set; }

        public string? Email { get; set; }

        public DateOnly? BirthDate { get; set; }

        public string? Gender { get; set; }

        public string? BloodType { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}