using HotelReservationSystem.Dto.UserDto;
using HotelReservationSystem.Service.AuthSer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HotelReservationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var user = await _authService.Register(dto);

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.Login(dto);

            if (result == null)
                return Unauthorized("Invalid credentials");

            return Ok(result);  // ← Change this line!
        }
    }
}

