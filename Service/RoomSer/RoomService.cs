using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.RoomRep;

namespace HotelReservationSystem.Service.RoomSer
{
    public class RoomService
    {
        private readonly IRoomRep _reposity;
        public RoomService(IRoomRep reposity)
        {
            _reposity = reposity;
        }
        public async Task<IEnumerable<Room>> GetAllRooms() => await _reposity.GetRoomRepAsync();
        public async Task<Room?> GetRoomsById(int id)=> await _reposity.GetRoomRepByIdAsync(id);
        public async Task CreateRoom(Room room)
        {
            await _reposity.CreateRoomRep(room);
            await _reposity.SaveChangesAsync();

        }
        public async Task UpdateRoom(Room room)
        {
            _reposity.UpdateRoom(room);
            await _reposity.SaveChangesAsync();

        }
        public async Task DeleteRoom(Room room)
        {
            _reposity.RemoveRoom(room);
            await _reposity.SaveChangesAsync();

        }

        public async Task<double> GetDistanceFromGoogle(double roomLat, double roomLng, double destLat, double destLng)
        {
            var apiKey = "YOUR_API_KEY";
            string url = $"https://maps.googleapis.com/maps/api/distancematrix/json?" +
                         $"origins={roomLat},{roomLng}&destinations={destLat},{destLng}&key={apiKey}";

            using var client = new HttpClient();
            var response = await client.GetStringAsync(url);

            dynamic data = Newtonsoft.Json.JsonConvert.DeserializeObject(response);

            return data.rows[0].elements[0].distance.value;
        }
    }
}
