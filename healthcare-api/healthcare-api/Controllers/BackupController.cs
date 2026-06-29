using healthcare_api.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace healthcare_api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class BackupController(IBackupTrxToRpt service) : ControllerBase
{
    [HttpPost("doctor-performance")]
    public async Task<IActionResult> BackupDoctorPerformance([FromQuery] int year, [FromQuery] int month)
    {
        if (year <= 0 || month < 1 || month > 12)
            return BadRequest("Year dan month tidak valid.");

        var result = await service.BackupDoctorPerformanceAsync(year, month);
        return Ok(new { synced = result.Count, year, month, data = result });
    }

    [HttpPost("monthly-appointment")]
    public async Task<IActionResult> BackupMonthlyAppointment([FromQuery] int year, [FromQuery] int month)
    {
        if (year <= 0 || month < 1 || month > 12)
            return BadRequest("Year dan month tidak valid.");

        var result = await service.BackupMonthlyAppointmentAsync(year, month);
        return Ok(result);
    }
}
