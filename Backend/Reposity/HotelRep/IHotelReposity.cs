using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Reposity.HotelRep
{
    public interface IHotelReposity
    {
        Task CreateHotelRep(Hotel hotel);
        Task<Hotel?> GetHotelRepByIdAsync(int id, int userId);
        Task<Hotel?> GetHotelRepByIdUserAsync(int id);
        Task<IEnumerable<Hotel>> GetHotelsRepAsync(int userId);
        Task<IEnumerable<Hotel>> GetHotelsRepUserAsync();
        void RemoveHotel(Hotel hotel);
        Task<bool> SaveChangesAsync();
        void UpdateHotel(Hotel hotel);
    }
}