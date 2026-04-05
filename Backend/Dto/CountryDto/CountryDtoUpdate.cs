using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.CountryDto
{
    public class CountryDtoUpdate
    {
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
    }
}
