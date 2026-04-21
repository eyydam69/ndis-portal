    using Service.API.DTOs;

    namespace NDISPortal.API.Services.Interfaces
    {
        public interface iservice_category_service
        {
            Task<IEnumerable<service_category_dto>> GetAllAsync();
            Task<service_category_dto?> GetByIdAsync(int id);
        }
    }
