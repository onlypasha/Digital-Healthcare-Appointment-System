using System;
using System.Collections.Generic;

namespace healthcare_api.Models.Transactional;

public partial class User
{
    public long Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public string? Role { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();

    public virtual ICollection<TeleconsultationMessage> TeleconsultationMessages { get; set; } = new List<TeleconsultationMessage>();
}
