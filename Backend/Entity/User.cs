using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Entity
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }= string.Empty;
        public string Email {  get; set; }= string.Empty;
        public string PasswordHash {  get; set; }= string.Empty;
        public string Roles {  get; set; }= string.Empty;
        public List<Booking> Bookings { get; set; } = new List<Booking>();
        public DateTime CreatedAt { get; set; }
    }
}
