using HotelReservationSystem.Dto.UserDto;
using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Service.AuthSer
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> Login(LoginDto request);
        Task<User> Register(RegisterDto request);
    }
}