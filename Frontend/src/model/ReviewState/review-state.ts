import { Injectable, signal } from '@angular/core';
import { ReviewModelRead } from '../ReviewModel/review-model-read';

@Injectable({
  providedIn: 'root',
})
export class ReviewState {
  review =signal<ReviewModelRead[]>([])
  
  setReview(review: ReviewModelRead[]){
    this.review.set(review)
  }
  createReview(review: ReviewModelRead){
    this.review.update((current) => [...current, review])
  }
  removeReview(id: number){
    this.review.update((current) => current.filter((review) => review.id !== id))
  }
  
}
