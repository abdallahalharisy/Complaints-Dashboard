import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PerformanceStats,
  ComplaintsByStatus,
  ComplaintsByAgency,
  ComplaintsByType,
  ResolutionTimeStats,
  AnalyticsQueryParams
} from './models/analytics.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralManagementService {
  private apiUrl = `${environment.apiUrl}/general-managment`;
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

  private buildParams(queryParams?: AnalyticsQueryParams): HttpParams {
    let params = new HttpParams();
    if (queryParams?.startDate) {
      params = params.set('startDate', queryParams.startDate);
    }
    if (queryParams?.endDate) {
      params = params.set('endDate', queryParams.endDate);
    }
    return params;
  }

  getPerformanceStats(queryParams?: AnalyticsQueryParams): Observable<PerformanceStats> {
    return this.http.get<PerformanceStats>(`${this.apiUrl}/performance-stats`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(queryParams)
    });
  }

  getComplaintsByStatus(queryParams?: AnalyticsQueryParams): Observable<ComplaintsByStatus> {
    return this.http.get<ComplaintsByStatus>(`${this.apiUrl}/analytics/complaints-by-status`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(queryParams)
    });
  }

  getComplaintsByAgency(queryParams?: AnalyticsQueryParams): Observable<ComplaintsByAgency> {
    return this.http.get<ComplaintsByAgency>(`${this.apiUrl}/analytics/complaints-by-agency`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(queryParams)
    });
  }

  getComplaintsByType(queryParams?: AnalyticsQueryParams): Observable<ComplaintsByType> {
    return this.http.get<ComplaintsByType>(`${this.apiUrl}/analytics/complaints-by-type`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(queryParams)
    });
  }

  getResolutionTimeStats(queryParams?: AnalyticsQueryParams): Observable<ResolutionTimeStats> {
    return this.http.get<ResolutionTimeStats>(`${this.apiUrl}/analytics/resolution-time-stats`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(queryParams)
    });
  }

  downloadPdfReport(queryParams?: AnalyticsQueryParams): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/analytics/pdf-report`, {
      headers: this.getAuthHeaders(),
      params: this.buildParams(queryParams),
      responseType: 'blob'
    });
  }
}

