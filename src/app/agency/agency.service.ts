import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agency } from './models/agency.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  getAll(): Observable<Agency[]> {
    return this.http.get<Agency[]>(`${this.apiUrl}/agencies`, {
      headers: this.getAuthHeaders()
    });
  }

  getOne(id: string): Observable<Agency> {
    return this.http.get<Agency>(`${this.apiUrl}/agencies/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  create(name: string): Observable<Agency> {
    return this.http.post<Agency>(`${this.apiUrl}/agencies`, { name }, {
      headers: this.getAuthHeaders()
    });
  }
}

