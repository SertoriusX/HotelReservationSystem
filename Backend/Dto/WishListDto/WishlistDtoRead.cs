using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Dto.WishListDto
{
    public class WishlistDtoRead
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Username { get; set; }
        public int RoomId { get; set; }
        public string? RoomName { get; set; }
        public decimal? RoomPrice { get; set; }
        public string? HotelName { get; set; }
        public List<WishlistRoomImage>? RoomImages { get; set; }
        public DateTime CreatedAt { get; set; }

    }

    public class WishlistRoomImage
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
    }
}
