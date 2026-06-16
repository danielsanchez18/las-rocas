import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import { API_URL } from '@core/utils/api';
import { ReviewRequest, ReviewResponse } from '@core/interfaces/reviews/review.interface';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/reviews`;

  create(request: ReviewRequest): Observable<ApiResponse<ReviewResponse>> {
    return this.http.post<ApiResponse<ReviewResponse>>(this.apiUrl, request);
  }

  getByOrderId(orderId: string): Observable<ApiResponse<ReviewResponse>> {
    return this.http.get<ApiResponse<ReviewResponse>>(`${this.apiUrl}/order/${orderId}`);
  }
}
