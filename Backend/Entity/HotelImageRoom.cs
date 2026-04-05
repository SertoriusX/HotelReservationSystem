using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Entity
{
    public class HotelImageRoom
    {
        [Key]
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public bool IsMain { get; set; }

        public int roomId { get; set; }
        public Room? Room { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
