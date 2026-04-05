using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.RoomImgRep;

namespace HotelReservationSystem.Service.RoomImgSer
{
    public class RoomImgService
    {
        private readonly IRoomImgReposity _reposity;

        public RoomImgService(IRoomImgReposity reposity)
        {
            _reposity = reposity;
        }
        public async Task<IEnumerable<HotelImageRoom>> AllImgRoom() => await _reposity.GetAllRoomImage();
        public async Task<IEnumerable<HotelImageRoom>> AllImgRoomById(int roomId) => await _reposity.GetAllRoomImage(roomId);
        public async Task<HotelImageRoom?> GEtById(int id) => await _reposity.GetById(id);
        public async Task CreateImg(HotelImageRoom hotelImageRoom)
        {
            await _reposity.CreateImageRoom(hotelImageRoom);
            await _reposity.SaveChangesAsync();
        }
        public async Task UpdateImg(HotelImageRoom hotelImageRoom)
        {
            _reposity.UpdateImgRoom(hotelImageRoom);
            await _reposity.SaveChangesAsync();
        }
        public async Task RemoveImg(HotelImageRoom hotelImageRoom)
        {
            _reposity.RemoveImgRoom(hotelImageRoom);
            await _reposity.SaveChangesAsync();
        }
    }
}
