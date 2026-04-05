namespace HotelReservationSystem.Dto.UserDto
{
    public class LoginResponseDto
    {

        public string Token { get; set; } = string.Empty;
        public string Roles { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}
