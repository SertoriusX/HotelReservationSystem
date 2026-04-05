namespace HotelReservationSystem.Dto.RoomImgDto
{
    public class RoomImgDtoRead
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public bool IsMain { get; set; }
        public int RoomId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
