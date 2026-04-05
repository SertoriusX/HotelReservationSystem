using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.ReviewDto
{
    public class ReviewDtoUpdate
    {
        [StringLength(1000)]
        public string Comment { get; set; } = string.Empty;

        [Range(1, 5)]
        public int? Rating { get; set; }
    }
}
