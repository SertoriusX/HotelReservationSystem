using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Entity
{
    public class HotelImage
    {
        [Key]
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public bool IsMain { get; set; }

        public int HotelId { get; set; }
        public Hotel? Hotel { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
