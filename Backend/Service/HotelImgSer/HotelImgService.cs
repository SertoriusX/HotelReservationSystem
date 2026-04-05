using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.HotelImageRep;

namespace HotelReservationSystem.Service.HotelImgSer
{
    public class HotelImgService
    {
        private readonly IHotelImageRep _reposity;
        public HotelImgService(IHotelImageRep reposity)
        {
            _reposity = reposity;
        }

        public async Task<IEnumerable<HotelImage>> GetImages() => await _reposity.GetHotelImageRepUserAsync();
        public async Task<HotelImage?> GetImageById(int id) => await _reposity.GetHotelImageRepByIdUserAsync(id);
        public async Task CreateHotelImage(HotelImage hotelImage)
        {
            await _reposity.CreateCityRep(hotelImage);
            await _reposity.SaveChangesAsync();
        }
        public async Task UpdateHotelImage(HotelImage hotelImage)
        {
            _reposity.UpdateHotelImage(hotelImage);
            await _reposity.SaveChangesAsync();
        }
        public async Task DeleteHotelImage(HotelImage hotelImage)
        {
            _reposity.RemoveHotelImage(hotelImage);
            await _reposity.SaveChangesAsync();
        }

    }
}
