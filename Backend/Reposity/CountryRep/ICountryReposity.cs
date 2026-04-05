using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Reposity.CountryRep
{
    public interface ICountryReposity
    {
        Task CreateCountrysRep(Country country);
        Task<Country?> GetCountrysRepByIdUserAsync(int id);
        Task<IEnumerable<Country>> GetCountrysRepUserAsync();
        void RemoveCountrys(Country country);
        Task<bool> SaveChangesAsync();
        void UpdateCountry(Country country);
    }
}