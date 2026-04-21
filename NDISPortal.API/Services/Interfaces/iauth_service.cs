using Register.API.DTOs.Auth;

namespace Register.API.Services
{
    public interface iauth_service
    {
        Task<object> Register(register_dto dto);
        Task<object> Login(login_dto dto);
    }
}