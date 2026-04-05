using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Dto.RoomDto
{
    public class RoomDtoCreate
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        public int NumberOfBedrooms { get; set; }
        public int NumberOfBeds { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Capacity { get; set; }

        public string Type { get; set; } = "Standard";
        public bool HasKitchen { get; set; }
        public bool HasFreeParging { get; set; }
        public bool IsNonSmoking { get; set; }
        public bool HasSwimmingPool { get; set; }
        public bool HasBar { get; set; }

        public bool HasWifi { get; set; }
        public bool HasAirConditioning { get; set; }
        public bool HasTv { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        [Required]
        public int HotelId { get; set; }
    }
}
