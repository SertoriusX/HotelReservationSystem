namespace HotelReservationSystem.Dto.UserDto
{
    public class JwtResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Roles { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }
}
