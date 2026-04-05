using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.CityRep;

namespace HotelReservationSystem.Service.CitySer
{
    public class CityService
    {
        private readonly ICityReposity _reposity;
        public CityService(ICityReposity reposity)
        {
            _reposity = reposity;
        }
        public async Task<IEnumerable<City>> GetAll()=> await _reposity.GetCitysRepUserAsync();
        public async Task<City?>GetCityAsync(int  id)=> await _reposity.GetCityRepByIdUserAsync(id);
        public async Task CreateCity(City city)
        {
            await _reposity.CreateCityRep(city);
            await _reposity.SaveChangesAsync();
        }
        public async Task UpdateCity(City city)
        {
            _reposity.UpdateCity(city);
            await _reposity.SaveChangesAsync();
        }
        public async Task DeleteCity(City city)
        {
            _reposity.RemoveCity(city);
            await _reposity.SaveChangesAsync();
        }

    }
}
