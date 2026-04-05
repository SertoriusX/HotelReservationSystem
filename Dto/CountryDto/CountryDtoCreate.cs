using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.CountryDto
{
    public class CountryDtoCreate
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
    }
}
