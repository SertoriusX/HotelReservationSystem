import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rating">
      @for(star of stars; track $index) {
        <span 
          class="star" 
          [class.filled]="star <= (hovered() || rating())"
          (mouseenter)="hovered.set(star)"
          (mouseleave)="hovered.set(0)"
          (click)="onRate(star)"
        >★</span>
      }
      @if (showValue) {
        <span class="rating-value">{{ rating().toFixed(1) }}</span>
      }
    </div>
  `,
  styles: [`
    .rating {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
    .star {
      font-size: 1.5rem;
      color: #d1d5db;
      cursor: pointer;
      transition: color 0.2s;
    }
    .star.filled {
      color: #f59e0b;
    }
    .star:hover {
      color: #f59e0b;
    }
    .rating-value {
      margin-left: 8px;
      font-weight: 600;
      color: #374151;
    }
  `]
})
export class Rating {
  @Input() set maxStars(value: number) {
    this.stars = Array.from({length: value}, (_, i) => i + 1);
  }
  @Input() set rate(value: number) {
    this.rating.set(value);
  }
  @Input() showValue = true;
  @Input() readonly = false;

  stars: number[] = [1,2,3,4,5];
  rating = signal<number>(0);
  hovered = signal<number>(0);

  onRate(value: number) {
    if (!this.readonly) {
      this.rating.set(value);
    }
  }
}
