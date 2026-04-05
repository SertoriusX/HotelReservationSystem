using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Entity
{
    public class City
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public int CountryId { get; set; }
        public Country? Country { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
