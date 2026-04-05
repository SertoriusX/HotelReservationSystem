using Stripe.Treasury;
using System.ComponentModel.DataAnnotations;

namespace HotelReservationSystem.Entity
{
    public enum RoomType
    {
        Standard,
        Deluxe,
        Suite,
        Family
    }

    public class Room
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int NumberOfBedrooms { get; set; }
        public int NumberOfBeds { get; set; }
        public int Capacity { get; set; }
        public RoomType Type { get; set; } = RoomType.Standard;

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

        public int HotelId { get; set; }
        public List<HotelImageRoom> ImagesRoom { get; set; } = new List<HotelImageRoom>();

        public Hotel? Hotel { get; set; }

        public List<Booking> Bookings { get; set; } = new List<Booking>();
        public List<Review> Reviews { get; set; } = new List<Review>();

        public DateTime CreatedAt { get; set; }
    }
}
