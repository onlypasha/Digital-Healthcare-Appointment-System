using System;
using System.Collections.Generic;

namespace healthcare_api.Models.Transactional;

public partial class Appointment
{
    public long Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public long? PatientsId { get; set; }

    public long? DoctorsId { get; set; }

    public DateTime? AppointmentsId { get; set; }

    public long? QueueNumber { get; set; }

    public string? Status { get; set; }

    public string? Complaint { get; set; }

    public virtual Doctor? Doctors { get; set; }

    public virtual ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();

    public virtual Patient? Patients { get; set; }

    public virtual ICollection<Teleconsultation> Teleconsultations { get; set; } = new List<Teleconsultation>();
}
