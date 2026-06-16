import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root',
})
export class ComplaintService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/complaints`;

  createComplaint(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
