using HotelReservationSystem.Dto.CityDto;

namespace HotelReservationSystem.Dto.CountryDto
{
    public class CountryDtoRead
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<CityDtoRead?> Cities { get;set;}
    }
}
