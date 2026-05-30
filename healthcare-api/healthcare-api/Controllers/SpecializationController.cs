using healthcare_api.Data;
using healthcare_api.Interface;
using Microsoft.AspNetCore.Mvc;

namespace healthcare_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializationController(IDoctorService doctorService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecializationResponseDto>>> GetSpecializations()
        {
            var specializations = await doctorService.GetSpecializationsAsync();
            var response = specializations.Select(s => new SpecializationResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description
            });
            return Ok(response);
        }
    }
}
