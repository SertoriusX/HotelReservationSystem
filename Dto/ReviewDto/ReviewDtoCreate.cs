using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.ReviewDto
{
    public class ReviewDtoCreate
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int RoomId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Comment { get; set; } = string.Empty;

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
    }
}
