using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using healthcare_api.Data;
using healthcare_api.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace healthcare_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentController(IAppointmentService service) : ControllerBase
    {
        [HttpPost]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<AppointmentResponseDto>> BookAppointment([FromBody] BookAppointmentDto request)
        {
            var userId = GetUserId();
            var response = await service.BookAppointmentAsync(userId, request);
            if (response == null)
            {
                return BadRequest("Jadwal dokter tidak tersedia pada tanggal tersebut, atau data dokter tidak aktif.");
            }

            return Ok(response);
        }

        [HttpGet]
        public async Task<ActionResult<List<AppointmentResponseDto>>> GetAppointments()
        {
            var userId = GetUserId();
            var role = GetUserRole();
            var appointments = await service.GetAppointmentsAsync(userId, role);
            return Ok(appointments);
        }

        [HttpPut("{id}/cancel")]
        public async Task<ActionResult> CancelAppointment(long id)
        {
            var userId = GetUserId();
            var role = GetUserRole();
            var success = await service.CancelAppointmentAsync(id, userId, role);
            if (!success)
            {
                return BadRequest("Gagal membatalkan janji temu. Pastikan ID janji temu benar dan Anda memiliki otorisasi.");
            }

            return Ok(new { message = "Janji temu berhasil dibatalkan." });
        }

        [HttpPut("{id}/complete")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult> CompleteAppointment(long id)
        {
            var userId = GetUserId();
            var role = GetUserRole();
            var success = await service.CompleteAppointmentAsync(id, userId, role);
            if (!success)
            {
                return BadRequest("Gagal menyelesaikan janji temu. Pastikan ID janji temu benar dan Anda memiliki otorisasi.");
            }

            return Ok(new { message = "Janji temu berhasil diselesaikan." });
        }

        private long GetUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return idClaim != null ? long.Parse(idClaim.Value) : 0;
        }

        private string GetUserRole()
        {
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            return roleClaim?.Value ?? string.Empty;
        }
    }
}
