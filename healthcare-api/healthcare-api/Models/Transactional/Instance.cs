using System;
using System.Collections.Generic;

namespace healthcare_api.Models.Transactional;

/// <summary>
/// Auth: Manages users across multiple sites.
/// </summary>
public partial class Instance
{
    public Guid Id { get; set; }

    public Guid? Uuid { get; set; }

    public string? RawBaseConfig { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
