using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Reposity.CityRep
{
    public interface ICityReposity
    {
        Task CreateCityRep(City city);
        Task<City?> GetCityRepByIdUserAsync(int id);
        Task<IEnumerable<City>> GetCitysRepUserAsync();
        void RemoveCity(City city);
        Task<bool> SaveChangesAsync();
        void UpdateCity(City city);
    }
}