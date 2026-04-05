using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Entity
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        public string Comment { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public int RoomId { get; set; }
        public Room? Room { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
