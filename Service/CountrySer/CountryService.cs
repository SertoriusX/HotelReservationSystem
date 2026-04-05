using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.CountryRep;

namespace HotelReservationSystem.Service.CountrySer
{
    public class CountryService
    {
        private readonly ICountryReposity _reposity;
        public CountryService(ICountryReposity reposity)
        {
            _reposity = reposity;
        }
        public async Task<IEnumerable<Country>> GetAllCountrySer()=> await _reposity.GetCountrysRepUserAsync();
        public async Task<Country?> GetById(int id)=> await _reposity.GetCountrysRepByIdUserAsync(id);
        public async Task CreaeteCountry(Country country)
        {
            await _reposity.CreateCountrysRep(country);
            await _reposity.SaveChangesAsync();
        }
        public async Task UpdateCountry(Country country)
        {
            await _reposity.CreateCountrysRep(country);
            await _reposity.SaveChangesAsync();
        }
        public async Task DeleteCountry(Country country)
        {
            await _reposity.CreateCountrysRep(country);
            await _reposity.SaveChangesAsync();
        }
    }
}
