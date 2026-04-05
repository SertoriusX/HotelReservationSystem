namespace HotelReservationSystem.Dto.CityDto
{
    public class CityDtoRead
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public int CountryId { get; set; }
        public string? CountryName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
