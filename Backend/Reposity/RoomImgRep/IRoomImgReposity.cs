using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Reposity.RoomImgRep
{
    public interface IRoomImgReposity
    {
        Task CreateImageRoom(HotelImageRoom room);
        Task<IEnumerable<HotelImageRoom>> GetAllRoomImage();
        Task<IEnumerable<HotelImageRoom>> GetAllRoomImage(int roomId);
        Task<HotelImageRoom?> GetById(int id);
        void RemoveImgRoom(HotelImageRoom room);
        Task<bool> SaveChangesAsync();
        void UpdateImgRoom(HotelImageRoom room);
    }
}