using healthcare_api.Data;
using healthcare_api.Interface;
using healthcare_api.Models.Transactional;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace healthcare_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class SpecializationController(ISpecializationService service) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecializationResponseDto>>> GetSpecializations()
        {
            var specializations = await service.GetSpecializationsAsync();
            var response = specializations.Select(s => new SpecializationResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description
            });
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<SpecializationResponseDto>> AddSpecialization(AddSpecializationRequestDto requestDto)
        {
            var specialization = await service.AddSpecializationAsync(requestDto);
            if (specialization == null)
            {
                return BadRequest("Nama atau deskripsi spesialis tidak boleh kosong.");
            }

            var response = new SpecializationResponseDto
            {
                Id = specialization.Id,
                Name = specialization.Name,
                Description = specialization.Description
            };

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<SpecializationResponseDto>> UpdateSpecialization(long id, UpdateSpecializationRequestDto requestDto)
        {
            var specialization = await service.UpdateSpecializationAsync(id, requestDto);
            if (specialization == null)
            {
                return NotFound("Spesialisasi tidak ditemukan.");
            }

            var response = new SpecializationResponseDto
            {
                Id = specialization.Id,
                Name = specialization.Name,
                Description = specialization.Description
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSpecialization(long id)
        {
            // Cek keberadaan data terlebih dahulu melalui daftar yang ada
            var allSpecializations = await service.GetSpecializationsAsync();
            var specializationExists = allSpecializations.Any(s => s.Id == id);
            
            if (!specializationExists)
            {
                return NotFound("Spesialisasi tidak ditemukan.");
            }

            var success = await service.DeleteSpecializationAsync(id);
            if (!success)
            {
                return BadRequest("Tidak dapat menghapus spesialisasi yang masih digunakan oleh dokter.");
            }

            return Ok(new DoctorControllerResponse { message = "Spesialisasi berhasil dihapus." });
        }
    }
}
