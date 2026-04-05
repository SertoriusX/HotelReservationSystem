using HotelReservationSystem.Entity;
using HotelReservationSystem.Reposity.ReviewRep;

namespace HotelReservationSystem.Service.ReviewSer
{
    public class ReviewService
    {
        private readonly IReviewReposity _reposity;
        public ReviewService(IReviewReposity reposity)
        {
            _reposity = reposity;
        }

        public async Task<IEnumerable<Review>> GetReviewsAsync(int roomId) => await _reposity.GetReviewRepAsync(roomId);
        public async Task<IEnumerable<Review>> GetReviewsByRoomId(int roomId) => await _reposity.GetReviewsByRoomIdAsync(roomId);
        public async Task<Review?> GetReviewById(int id)=> await _reposity.GetReviewRepByIdAsync(id);
        public async Task CreateReview(Review newReview)
        {
            await _reposity.CreateReviewRep(newReview);
            await _reposity.SaveChangesAsync();
        }
        public async Task UpdateReview(Review newReview)
        {
            _reposity.UpdateReview(newReview);
            await _reposity.SaveChangesAsync();
        }
        public async Task RemoveReview(Review newReview)
        {
            _reposity.RemoveReview(newReview);
            await _reposity.SaveChangesAsync();
        }
    }
}
