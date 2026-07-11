using System;

namespace healthcare_api.Models.Transactional;

public partial class TeleconsultationMessage
{
    public long Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public long? TeleconsultationId { get; set; }

    public long? SenderId { get; set; }

    public string? Content { get; set; }

    public virtual Teleconsultation? Teleconsultation { get; set; }

    public virtual User? Sender { get; set; }
}
