using HotelReservationSystem.Entity;

namespace HotelReservationSystem.Reposity.ReviewRep
{
    public interface IReviewReposity
    {
        Task CreateReviewRep(Review review);
        Task<IEnumerable<Review>> GetReviewRepAsync(int roomId);
        Task<IEnumerable<Review>> GetReviewsByRoomIdAsync(int roomId);
        Task<Review?> GetReviewRepByIdAsync(int id);
        void RemoveReview(Review review);
        Task<bool> SaveChangesAsync();
        void UpdateReview(Review review);
    }
}