using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Register.API.DTOs.Auth;
using Register.API.Services;
using System;

namespace Register.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                Console.WriteLine($"[AuthController] Register called with: FullName='{dto?.FullName}', Email='{dto?.Email}', PasswordLength={dto?.Password?.Length ?? 0}, Role='{dto?.Role}'");
                
                if (dto == null)
                {
                    Console.WriteLine("[AuthController] DTO is null!");
                    return BadRequest(new { status = 400, message = "Request body is required" });
                }
                
                var result = await _authService.Register(dto);
                dynamic res = result;
                Console.WriteLine($"[AuthController] Register result: status={res.status}, message={res.message}");
                return StatusCode(res.status, res);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AuthController] Exception: {ex.Message}");
                Console.WriteLine($"[AuthController] Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { status = 500, message = $"Internal server error: {ex.Message}" });
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                Console.WriteLine($"[AuthController] Login called with: Email='{dto?.Email}', PasswordLength={dto?.Password?.Length ?? 0}");
                
                if (dto == null)
                {
                    Console.WriteLine("[AuthController] DTO is null!");
                    return BadRequest(new { status = 400, message = "Request body is required" });
                }
                
                var result = await _authService.Login(dto);
                dynamic res = result;
                Console.WriteLine($"[AuthController] Login result: status={res.status}, message={res.message}");
                return StatusCode(res.status, res);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AuthController] Exception: {ex.Message}");
                Console.WriteLine($"[AuthController] Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { status = 500, message = $"Internal server error: {ex.Message}" });
            }
        }
    }
}