using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.HotelImageDto
{
    public class HotelImageDtoCreate
    {
        [Required]
        [Url]
        public string Url { get; set; } = string.Empty;

        public bool? IsMain { get; set; }

        [Required]
        public int roomId { get; set; }
    }
}
