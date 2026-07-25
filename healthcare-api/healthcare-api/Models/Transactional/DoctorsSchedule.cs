using System;
using System.Collections.Generic;

namespace healthcare_api.Models.Transactional;

public partial class DoctorsSchedule
{
    public long Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public long? DoctorsId { get; set; }

    public string? DayOfWeek { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public virtual Doctor? Doctors { get; set; }
}
