using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Reposity.HotelImageRep
{
    public interface IHotelImageRep
    {
        Task CreateCityRep(HotelImage hotelImage);
        Task<HotelImage?> GetHotelImageRepByIdUserAsync(int id);
        Task<IEnumerable<HotelImage>> GetHotelImageRepUserAsync();
        void RemoveHotelImage(HotelImage hotelImage);
        Task<bool> SaveChangesAsync();
        void UpdateHotelImage(HotelImage hotelImage);
    }
}