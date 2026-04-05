using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Reposity.RoomRep
{
    public interface IRoomRep
    {
        Task CreateRoomRep(Room room);
        Task<IEnumerable<Room>> GetRoomRepAsync();
        Task<Room?> GetRoomRepByIdAsync(int id);
        void RemoveRoom(Room room);
        Task<bool> SaveChangesAsync();
        void UpdateRoom(Room room);
    }
}