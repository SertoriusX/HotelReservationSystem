using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Entity
{
    public class Wishlist
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        public User? User { get; set; }

        [Required]
        public int RoomId { get; set; }
        public Room? Room { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
