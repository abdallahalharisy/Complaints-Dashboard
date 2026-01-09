import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint, PaginatedResponse } from './models/complaint.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
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

  private getAuthHeadersFormData() {
    const token = this.isBrowser 
      ? (localStorage.getItem('accessToken') || localStorage.getItem('token'))
      : null;
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  getComplaints(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Complaint>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<PaginatedResponse<Complaint>>(`${this.apiUrl}/complaints`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  // Get authenticated URL for file access
  getAuthenticatedFileUrl(fileUrl: string): string {
    if (!this.isBrowser) return fileUrl;
    
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (!token) return fileUrl;
    
    // Check if URL already has query parameters
    const separator = fileUrl.includes('?') ? '&' : '?';
    return `${fileUrl}${separator}token=${encodeURIComponent(token)}`;
  }

  getComplaintById(id: string, lock: boolean = false): Observable<Complaint> {
    let params = new HttpParams();
    if (lock) {
      params = params.set('lock', 'true');
    }
    
    return this.http.get<Complaint>(`${this.apiUrl}/complaints/${id}`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  addNote(complaintId: string, content: string): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.apiUrl}/complaints/${complaintId}/notes`, 
      { content },
      { headers: this.getAuthHeaders() }
    );
  }

  changeStatus(complaintId: string, status: string): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.apiUrl}/complaints/${complaintId}/status`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }
}

