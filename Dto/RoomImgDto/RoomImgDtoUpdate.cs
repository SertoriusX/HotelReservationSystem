using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.RoomImgDto
{
    public class RoomImgDtoUpdate
    {

        [Url]
        public string? Url { get; set; }

        public bool? IsMain { get; set; }
    }
}
