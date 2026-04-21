using NDISPortal.API.Data;
using Service.API.DTOs;
using Microsoft.EntityFrameworkCore;
using NDISPortal.API.Services.Interfaces;

namespace NDISPortal.API.Services.Implementations
{
    public class serivice_category_service : iservice_category_service
    {
        private readonly application_db_context _context;

        public serivice_category_service(application_db_context context)
        {
            _context = context;
        }

        public async Task<IEnumerable<service_category_dto>> GetAllAsync()
        {
            return await _context.service_categories
                .Select(c => new service_category_dto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToListAsync();
        }

        public async Task<service_category_dto?> GetByIdAsync(int id)
        {
            return await _context.service_categories
                .Where(c => c.Id == id)
                .Select(c => new service_category_dto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .FirstOrDefaultAsync();
        }
    }
}