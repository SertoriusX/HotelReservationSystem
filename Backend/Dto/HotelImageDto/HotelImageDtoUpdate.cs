using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.HotelImageDto
{
    public class HotelImageDtoUpdate
    {
        [Url]
        public string? Url { get; set; }

        public bool? IsMain { get; set; }
    }
}
