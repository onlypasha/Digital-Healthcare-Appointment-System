    using System;
using System.Collections.Generic;

namespace healthcare_api.Models.Transactional;

public partial class MedicalRecord
{
    public long Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public long? AppointmentsId { get; set; }

    public long? PatientsId { get; set; }

    public long? DoctorsId { get; set; }

    public string? Diagnosis { get; set; }

    public string? Prescription { get; set; }

    public string? Notes { get; set; }

    public virtual Appointment? Appointments { get; set; }

    public virtual Doctor? Doctors { get; set; }

    public virtual Patient? Patients { get; set; }
}
