import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, CreateUserDto, CreateStaffDto, UpdateUserDto, QueryUserDto, PaginatedResponse } from './models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  private getAuthHeadersFormData() {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  // Get current user
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get all users with query params
  getAll(query?: QueryUserDto): Observable<PaginatedResponse<User>> {
    let params = new HttpParams();
    if (query) {
      if (query.role) params = params.set('role', query.role);
      if (query.isVerified !== undefined) params = params.set('isVerified', query.isVerified.toString());
      if (query.isActive !== undefined) params = params.set('isActive', query.isActive.toString());
      if (query.page) params = params.set('page', query.page.toString());
      if (query.limit) params = params.set('limit', query.limit.toString());
      if (query.search) params = params.set('search', query.search);
      if (query.orderBy) params = params.set('orderBy', query.orderBy);
    }
    
    return this.http.get<PaginatedResponse<User>>(`${this.apiUrl}/user`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  // Get one user by ID
  getOne(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Create regular user
  createUser(dto: CreateUserDto, profilePicture?: File): Observable<any> {
    const formData = new FormData();
    
    Object.keys(dto).forEach(key => {
      const value = dto[key as keyof CreateUserDto];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    return this.http.post(`${this.apiUrl}/user`, formData, {
      headers: this.getAuthHeadersFormData()
    });
  }

  // Create staff (requires ADMIN or STAFF_ADMIN role)
  createStaff(dto: CreateStaffDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/staff`, dto, {
      headers: this.getAuthHeaders()
    });
  }

  // Update user profile
  updateProfile(dto: UpdateUserDto, profilePicture?: File): Observable<User> {
    const formData = new FormData();
    
    Object.keys(dto).forEach(key => {
      const value = dto[key as keyof UpdateUserDto];
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    return this.http.patch<User>(`${this.apiUrl}/user/me`, formData, {
      headers: this.getAuthHeadersFormData()
    });
  }

  // Delete user (requires ADMIN role for deleting by ID)
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete current user
  deleteMe(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/me`, {
      headers: this.getAuthHeaders()
    });
  }
}

