namespace HotelReservationSystem.Dto.UserDto
{
    public class UserDtoRead
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Roles { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
