using System;
using System.Collections.Generic;

namespace healthcare_api.Models.Transactional;

public partial class Specialization
{
    public long Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
}
