using System;

namespace healthcare_api.Data
{
    public class SendMessageDto
    {
        public long TeleconsultationId { get; set; }
        public string Content { get; set; } = string.Empty;
    }

    public class MessageResponseDto
    {
        public long Id { get; set; }
        public long TeleconsultationId { get; set; }
        public long? SenderId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class StartTeleconsultationDto
    {
        public long AppointmentId { get; set; }
    }

    public class EndTeleconsultationDto
    {
        public long TeleconsultationId { get; set; }
    }
}
