using System;
using System.Collections.Generic;

namespace healthcare_api.Models.Transactional;

public partial class Teleconsultation
{
    public long Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public long? AppointmentsId { get; set; }

    public string? MeetingLink { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public string? Status { get; set; }

    public virtual Appointment? Appointments { get; set; }
}
