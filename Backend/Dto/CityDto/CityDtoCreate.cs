using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.CityDto
{
    public class CityDtoCreate
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        [Required]
        public int CountryId { get; set; }
    }
}
