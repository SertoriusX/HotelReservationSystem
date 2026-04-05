import { Component, Input, OnInit, OnChanges, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../service/ReviewService/review-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ReviewModelRead } from '../../../model/ReviewModel/review-model-read';
import { ReviewModelCreate } from '../../../model/ReviewModel/review-model-create';
import { AuthService } from '../../../service/AuthService/auth-service';

@Component({
  selector: 'app-review-components',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-components.html',
  styleUrl: './review-components.css',
})
export class ReviewComponents implements OnInit, OnChanges {

  @Input() hotelId!: number;
  @Input() roomId!: number;
  selectedRating = signal<number>(0);
  currentUserId: number | null = null;
  
  reviews = signal<ReviewModelRead[]>([]);

  constructor(
    private reviewServ: ReviewService,
    private authServ: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authServ.getUserId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roomId'] && this.roomId) {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.reviews.set([]);
    this.reviewServ.getAllReview(this.roomId).subscribe({
      next: (res) => {
        const filtered = res.filter(r => r.roomId === this.roomId);
        this.reviews.set(filtered);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  setRating(rating: number) {
    this.selectedRating.set(rating);
  }

  createReview(form: NgForm) {
    if (this.selectedRating() === 0) {
      alert('Please select a rating');
      return;
    }

    const dto: ReviewModelCreate = {
      comment: form.value.comment,
      rating: this.selectedRating(),
      roomId: this.roomId || 0
    };

    this.reviewServ.createReview(dto, this.roomId).subscribe({
      next: (res) => {
        this.reviews.update(current => [...current, res]);
        form.reset();
        this.selectedRating.set(0);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  canDelete(review: ReviewModelRead): boolean {
    if (!this.currentUserId) return false;
    return review.userId === this.currentUserId;
  }

  deleteReview(id: number) {
    this.reviewServ.deleteReview(id).subscribe({
      next: () => {
        this.reviews.update(current => current.filter(r => r.id !== id));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
