namespace HotelReservationSystem.Dto.HotelImageDto
{
    public class HotelImageDtoRead
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public bool IsMain { get; set; }
        public int roomId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
