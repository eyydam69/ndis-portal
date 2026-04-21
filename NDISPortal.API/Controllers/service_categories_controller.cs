using Microsoft.AspNetCore.Mvc;
using NDISPortal.API.Services.Interfaces;
using Service.API.DTOs;


namespace Service.API.Controllers
{
    [Route("api/service-categories")]
    [ApiController]
    public class service_categories_controller : ControllerBase
    {
        private readonly iservice_category_service _service;

        public service_categories_controller(iservice_category_service service)
        {
            _service = service;
        }

        // GET: api/ServiceCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<service_category_dto>>> GetServiceCategories()
        {
            var categories = await _service.GetAllAsync();
            return Ok(categories);
        }

        // GET: api/ServiceCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<service_category_dto>> GetServiceCategory(int id)
        {
            var category = await _service.GetByIdAsync(id);

            if (category == null)
                return NotFound();

            return Ok(category);
        }

    }
}
