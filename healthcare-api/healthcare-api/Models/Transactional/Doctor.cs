using System;
using System.Collections.Generic;

namespace healthcare_api.Models.Transactional;

public partial class Doctor
{
    public long Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public long? UserId { get; set; }

    public string? Speacialization { get; set; }

    public decimal? ConsultationFee { get; set; }

    public string? Scedule { get; set; }

    public string? Phone { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();

    public virtual User? User { get; set; }
}
