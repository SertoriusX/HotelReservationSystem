import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewModelRead } from '../../model/ReviewModel/review-model-read';
import { ReviewModelCreate } from '../../model/ReviewModel/review-model-create';
import { ReviewModelUpdate } from '../../model/ReviewModel/review-model-update';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private backUrl="http://localhost:5009/api/Review"
  constructor(private http: HttpClient){}
  getAllReview(roomId: number): Observable<ReviewModelRead[]>{
    return this.http.get<ReviewModelRead[]>(`${this.backUrl}/room/all/${roomId}`  )
  }
  getByIdReview(id: number): Observable<ReviewModelRead>{
    return this.http.get<ReviewModelRead>(`${this.backUrl}/${id}`)
  }
  createReview(review: ReviewModelCreate,roomId: number): Observable<ReviewModelRead>{
    return this.http.post<ReviewModelRead>(`${this.backUrl}/${roomId}`, review)
  }
  updateReview(id: number, review: ReviewModelUpdate): Observable<ReviewModelUpdate>{
    return this.http.put<ReviewModelUpdate>(`${this.backUrl}/${id}`, review)
  }
  deleteReview(id: number): Observable<void>{
    return this.http.delete<void>(`${this.backUrl}/${id}`)
  }
}
