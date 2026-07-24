using System;
using System.ComponentModel.DataAnnotations;

namespace healthcare_api.Data
{
    public class CreateMedicalRecordDto
    {
        [Required]
        public long AppointmentsId { get; set; }

        [Required]
        public string Diagnosis { get; set; } = string.Empty;

        public string? Prescription { get; set; }

        public string? Notes { get; set; }
    }

    public class MedicalRecordResponseDto
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public long? AppointmentsId { get; set; }
        public long? PatientsId { get; set; }
        public string? PatientName { get; set; }
        public long? DoctorsId { get; set; }
        public string? DoctorName { get; set; }
        public string? Diagnosis { get; set; }
        public string? Prescription { get; set; }
        public string? Notes { get; set; }
    }
}
