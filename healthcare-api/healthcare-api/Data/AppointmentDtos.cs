using System;

namespace healthcare_api.Data
{
    public class BookAppointmentDto
    {
        public long DoctorId { get; set; }
        public DateTime AppointmentsDate { get; set; }
        public string? Complaint { get; set; }
    }

    public class AppointmentResponseDto
    {
        public long Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? AppointmentsDate { get; set; }
        public long? QueueNumber { get; set; }
        public string? Status { get; set; }
        public string? Complaint { get; set; }
        public long? PatientsId { get; set; }
        public string? PatientName { get; set; }
        public long? DoctorsId { get; set; }
        public string? DoctorName { get; set; }
        public string? SpecializationName { get; set; }
    }
}
