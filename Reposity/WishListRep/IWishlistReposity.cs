using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Reposity.WishListRep
{
    public interface IWishlistReposity
    {
        Task CreateWishlist(Wishlist wishlist);
        void DeleteWishlist(Wishlist wishlist);
        Task<IEnumerable<Wishlist>> GetAllWish(int userId);
        Task<Wishlist?> GetByIdWish(int userId, int id);
        Task<bool> SaveChangesAsync();
    }
}