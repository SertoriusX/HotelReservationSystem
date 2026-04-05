using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.RoomImgDto
{
    public class RoomImgDtoCreate
    {
        [Required]
        [Url]
        public string Url { get; set; } = string.Empty;

        public bool? IsMain { get; set; }

        [Required]
        public int roomId { get; set; }
    }
}
