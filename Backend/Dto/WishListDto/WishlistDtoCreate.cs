using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.WishListDto
{
    public class WishlistDtoCreate
    {
        [Required]
        public int RoomId { get; set; }
    }
}
