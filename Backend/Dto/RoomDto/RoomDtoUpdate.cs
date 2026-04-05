using System.ComponentModel.DataAnnotations;
using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Dto.RoomDto
{
    public class RoomDtoUpdate
    {
        [StringLength(100)]
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? NumberOfBedrooms { get; set; }
        public int? NumberOfBeds { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? Price { get; set; }

        [Range(1, int.MaxValue)]
        public int? Capacity { get; set; }

        public RoomType? Type { get; set; }
        public bool? HasFreeParging { get; set; }
        public bool? IsNonSmoking { get; set; }
        public bool? HasSwimmingPool { get; set; }
        public bool? HasBar { get; set; }
        public bool? HasKitchen { get; set; }
        public bool? HasWifi { get; set; }
        public bool? HasAirConditioning { get; set; }
        public bool? HasTv { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}


