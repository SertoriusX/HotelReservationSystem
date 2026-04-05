namespace HotelReservationSystem.Dto.ReviewDto
{
    public class ReviewDtoRead
    {
        public int Id { get; set; }
        public string Comment { get; set; } = string.Empty;
        public int Rating { get; set; }
        public int UserId { get; set; }
        public string? Username { get; set; }
        public int RoomId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
