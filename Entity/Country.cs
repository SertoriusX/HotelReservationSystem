using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Entity
{
    public class Country
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<City> Cities { get; set; } = new List<City>();

        public DateTime CreatedAt { get; set; }
    }
}
