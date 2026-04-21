using Service.API.DTOs;

namespace NDISPortal.API.Services.Interfaces
{
    public interface iservice_service
    {
        Task<IEnumerable<services_dto>> GetAllAsync(int? categoryId);
        Task<services_dto?> GetByIdAsync(int id);
        Task<services_dto> CreateAsync(services_dto dto);
        Task<services_dto?> UpdateAsync(int id, services_dto dto);
        Task<bool> DeleteAsync(int id);
    }
}