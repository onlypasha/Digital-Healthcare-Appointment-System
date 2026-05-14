using System;
using System.Collections.Generic;

namespace healthcare_api.Models.Transactional;

public partial class Patient
{
    public long Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public long? UserId { get; set; }

    public DateOnly? BirthDate { get; set; }

    public string? Gender { get; set; }

    public string? BloodType { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();

    public virtual User1? User { get; set; }
}
