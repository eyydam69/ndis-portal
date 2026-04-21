using Microsoft.AspNetCore.Mvc;
using Register.API.DTOs.Auth;
using Register.API.Services;

[ApiController]
[Route("api/[controller]")]
public class auth_controller : ControllerBase
{
    private readonly iauth_service _authService;

    public auth_controller(iauth_service authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(register_dto dto)
    {
        var result = await _authService.Register(dto);
        dynamic res = result;
        return StatusCode(res.status, res);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(login_dto dto)
    {
        var result = await _authService.Login(dto);
        dynamic res = result;
        return StatusCode(res.status, res);
    }
}