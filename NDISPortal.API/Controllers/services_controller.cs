using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NDISPortal.API.Services.Interfaces;
using Service.API.DTOs;

namespace Service.API.Controllers
{
    [Route("api/services")]
    [ApiController]
    public class services_controller : ControllerBase
    {
        private readonly iservice_service _service;

        public services_controller(iservice_service service)
        {
            _service = service;
        }

        // GET: api/services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<services_dto>>> GetServices([FromQuery] int? categoryId)
        {
            var services = await _service.GetAllAsync(categoryId);
            return Ok(services);
        }

        // GET: api/services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<services_dto>> GetServiceItem(int id)
        {
            var service = await _service.GetByIdAsync(id);

            if (service == null)
                return NotFound();

            return Ok(service);
        }

        // PUT: api/services/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> PutServiceItem(int id, services_dto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var updated = await _service.UpdateAsync(id, dto);

            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        // POST: api/services
        [HttpPost]
        [Authorize(Roles = "Coordinator")]
        public async Task<ActionResult<services_dto>> PostServiceItem(services_dto dto)
        {
            var created = await _service.CreateAsync(dto);

            return CreatedAtAction(nameof(GetServiceItem), new { id = created.Id }, created);
        }

        // DELETE: api/services/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Coordinator")]
        public async Task<IActionResult> DeleteServiceItem(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}