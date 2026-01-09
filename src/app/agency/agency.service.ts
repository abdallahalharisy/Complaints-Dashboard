import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agency } from './models/agency.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private apiUrl = environment.apiUrl;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getAuthHeaders() {
    const token = this.isBrowser 
      ? (localStorage.getItem('accessToken') || localStorage.getItem('token'))
      : null;
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

