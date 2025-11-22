import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintService } from './complaint.service';
import { Complaint, ComplaintStatus, ComplaintType } from './models/complaint.interface';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.loading = true;
    this.error = '';
    
    this.complaintService.getComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load complaints';
        this.loading = false;
        console.error('Error loading complaints:', err);
      }
    });
  }

  getStatusClass(status: ComplaintStatus): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getTypeLabel(type: ComplaintType): string {
    const typeLabels: { [key: string]: string } = {
      'environmental': 'Environmental',
      'public_health': 'Public Health',
      'transportation': 'Transportation',
      'water_and_sanitation': 'Water & Sanitation',
      'other': 'Other'
    };
    return typeLabels[type] || type;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

