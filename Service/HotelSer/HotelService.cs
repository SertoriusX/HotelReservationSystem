using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.HotelRep;

namespace HotelReservationSystem.Service.HotelSer
{
    public class HotelService
    {
        private readonly IHotelReposity _reposity;
        public HotelService(IHotelReposity reposity)
        {
            _reposity = reposity;
        }


        public async Task<IEnumerable<Hotel>> GetHotelsOwner(int userId) => await _reposity.GetHotelsRepAsync(userId);
        public async Task<Hotel?> GetByOwner(int id,int userId)=> await _reposity.GetHotelRepByIdAsync(id, userId);

        public async Task<IEnumerable<Hotel>> GetHotels() => await _reposity.GetHotelsRepUserAsync();
        public async Task<Hotel?> GetById(int id) => await _reposity.GetHotelRepByIdUserAsync(id);

        public async Task CreateHotel(Hotel hotel)
        {
            await _reposity.CreateHotelRep(hotel);
            await _reposity.SaveChangesAsync();
        }
        public async Task UpdateHotel(Hotel hotel)
        {
            _reposity.UpdateHotel(hotel);
            await _reposity.SaveChangesAsync();
        }

        public async Task DeleteHotel(Hotel hotel)
        {
            _reposity.RemoveHotel(hotel);
            await _reposity.SaveChangesAsync();
        }

    }
}
