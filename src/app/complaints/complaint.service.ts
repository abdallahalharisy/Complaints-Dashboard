import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint } from './models/complaint.interface';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = '/api'; // Change to your backend URL

  constructor(private http: HttpClient) {}

  getComplaints(): Observable<Complaint[]> {
    const token =  localStorage.getItem('token');
    console.log('Getting complaints from:', `${localStorage.getItem('token')}`);
    return this.http.get<Complaint[]>(`${this.apiUrl}/complaints`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}

