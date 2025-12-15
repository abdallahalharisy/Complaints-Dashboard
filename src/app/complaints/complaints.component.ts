import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from './complaint.service';
import { Complaint, ComplaintStatus, ComplaintType } from './models/complaint.interface';
import { LoadingComponent } from '../shared/loading/loading.component';
import { UserService } from '../users/user.service';
import { User } from '../users/models/user.interface';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  loading: boolean = true;
  error: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  totalItems: number = 0;
  hasMore: boolean = true;
  loadingMore: boolean = false;

  // Form states
  editingComplaintId: string | null = null;
  lockedComplaints: Set<string> = new Set();
  showAddNoteForm: string | null = null;
  showChangeStatusForm: string | null = null;

  // Form data
  noteContent: string = '';
  selectedStatus: Map<string, string> = new Map();

  isSubmitting: boolean = false;
  currentUserRole: string = '';
  usersCache: Map<string, User> = new Map();

  constructor(
    private complaintService: ComplaintService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUserRole();
    this.loadComplaints();
  }

  loadCurrentUserRole(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserRole = user.role || '';
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
  }

  loadComplaints(reset: boolean = false): void {
    if (reset) {
      this.currentPage = 1;
      this.complaints = [];
      this.loading = true;
    } else {
      this.loadingMore = true;
    }
    this.error = '';
    
    this.complaintService.getComplaints(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        const complaints = response.items || [];
        
        if (reset) {
          this.complaints = complaints;
        } else {
          this.complaints = [...this.complaints, ...complaints];
        }
        
        // Load user information for complaints that don't have it
        this.loadUsersForComplaints(complaints);
        
        this.totalPages = response.meta?.totalPages || 1;
        this.totalItems = response.meta?.totalItems || 0;
        this.currentPage = response.meta?.currentPage || 1;
        this.hasMore = this.currentPage < this.totalPages;
        
        this.loading = false;
        this.loadingMore = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load complaints';
        this.loading = false;
        this.loadingMore = false;
        console.error('Error loading complaints:', err);
      }
    });
  }

  loadUsersForComplaints(complaints: Complaint[]): void {
    const userIdsToLoad = complaints
      .filter(c => !c.user && c.userId && !this.usersCache.has(c.userId))
      .map(c => c.userId)
      .filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates

    userIdsToLoad.forEach(userId => {
      this.userService.getOne(userId).subscribe({
        next: (user) => {
          this.usersCache.set(userId, user);
          // Update the complaint with user info
          const complaint = this.complaints.find(c => c.userId === userId);
          if (complaint) {
            complaint.user = user;
          }
        },
        error: (err) => {
          console.error(`Error loading user ${userId}:`, err);
        }
      });
    });
  }

  onScroll(): void {
    if (!this.loadingMore && this.hasMore && !this.loading) {
      this.currentPage++;
      this.loadComplaints(false);
    }
  }

  getAuthenticatedFileUrl(fileUrl: string): string {
    return this.complaintService.getAuthenticatedFileUrl(fileUrl);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }

  // Lock complaint
  private lockComplaint(complaintId: string): void {
    if (this.lockedComplaints.has(complaintId)) {
      return; // Already locked
    }

    this.complaintService.getComplaintById(complaintId, true).subscribe({
      next: (complaint) => {
        this.lockedComplaints.add(complaintId);
        this.editingComplaintId = complaintId;
        // Lock expires after 5 minutes (300000ms)
        setTimeout(() => {
          this.lockedComplaints.delete(complaintId);
          if (this.editingComplaintId === complaintId) {
            this.editingComplaintId = null;
          }
        }, 300000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to lock complaint';
        console.error('Error locking complaint:', err);
      }
    });
  }

  // Release lock
  private releaseLock(complaintId: string): void {
    this.lockedComplaints.delete(complaintId);
    if (this.editingComplaintId === complaintId) {
      this.editingComplaintId = null;
    }
  }

  toggleAddNote(complaintId: string): void {
    if (this.showAddNoteForm === complaintId) {
      // Cancel - release lock
      this.releaseLock(complaintId);
      this.showAddNoteForm = null;
      this.noteContent = '';
    } else {
      // Open form - lock complaint
      this.lockComplaint(complaintId);
      this.showAddNoteForm = complaintId;
      this.showChangeStatusForm = null;
      this.noteContent = '';
    }
  }

  toggleChangeStatus(complaintId: string): void {
    if (this.showChangeStatusForm === complaintId) {
      // Cancel - release lock
      this.releaseLock(complaintId);
      this.showChangeStatusForm = null;
      this.selectedStatus.delete(complaintId);
    } else {
      // Open form - lock complaint
      this.lockComplaint(complaintId);
      this.showChangeStatusForm = complaintId;
      this.showAddNoteForm = null;
      // Set current status as default
      const complaint = this.complaints.find(c => c.id === complaintId);
      if (complaint) {
        this.selectedStatus.set(complaintId, complaint.status);
      }
    }
  }

  getSelectedStatus(complaintId: string): string {
    return this.selectedStatus.get(complaintId) || '';
  }

  setSelectedStatus(complaintId: string, status: string): void {
    this.selectedStatus.set(complaintId, status);
  }

  addNote(complaintId: string): void {
    if (!this.noteContent.trim() || this.noteContent.length < 5) {
      this.error = 'Note must be at least 5 characters long';
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    this.complaintService.addNote(complaintId, this.noteContent).subscribe({
      next: (updatedComplaint) => {
        // Update the complaint in the list
        const index = this.complaints.findIndex(c => c.id === complaintId);
        if (index !== -1) {
          this.complaints[index] = updatedComplaint;
        }
        // Release lock after successful submission
        this.releaseLock(complaintId);
        this.showAddNoteForm = null;
        this.noteContent = '';
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to add note';
        this.isSubmitting = false;
        console.error('Error adding note:', err);
      }
    });
  }

  changeStatus(complaintId: string): void {
    const status = this.selectedStatus.get(complaintId);
    if (!status) {
      this.error = 'Please select a status';
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    this.complaintService.changeStatus(complaintId, status).subscribe({
      next: (updatedComplaint) => {
        // Update the complaint in the list
        const index = this.complaints.findIndex(c => c.id === complaintId);
        if (index !== -1) {
          this.complaints[index] = updatedComplaint;
        }
        // Release lock after successful submission
        this.releaseLock(complaintId);
        this.showChangeStatusForm = null;
        this.selectedStatus.delete(complaintId);
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to change status';
        this.isSubmitting = false;
        console.error('Error changing status:', err);
      }
    });
  }

  isLocked(complaintId: string): boolean {
    return this.lockedComplaints.has(complaintId);
  }

  canEdit(): boolean {
    return this.currentUserRole === 'admin' || this.currentUserRole === 'complaint_staff' || this.currentUserRole === 'staff_admin';
  }

  canAddNote(): boolean {
    return this.currentUserRole === 'admin' || this.currentUserRole === 'complaint_staff' || this.currentUserRole === 'staff_admin';
  }

  canChangeStatus(): boolean {
    return this.currentUserRole === 'admin' || this.currentUserRole === 'complaint_staff' || this.currentUserRole === 'staff_admin';
  }

  getStatusClass(status: ComplaintStatus): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'status-pending',
      'in_progress': 'status-in-progress',
      'awaiting_info': 'status-awaiting-info',
      'resolved': 'status-resolved',
      'rejected': 'status-rejected'
    };
    return statusClasses[status] || 'status-default';
  }

  getStatusLabel(status: ComplaintStatus): string {
    const statusLabels: { [key: string]: string } = {
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'awaiting_info': 'Awaiting Info',
      'resolved': 'Resolved',
      'rejected': 'Rejected'
    };
    return statusLabels[status] || status;
  }

  getStatusLabelForOption(status: string): string {
    return this.getStatusLabel(status as ComplaintStatus);
  }

  getTypeLabel(type: ComplaintType | any): string {
    // Handle if type is an object with name property
    if (typeof type === 'object' && type !== null && type.name) {
      return type.name;
    }
    
    // Handle if type is a string (enum)
    const typeLabels: { [key: string]: string } = {
      'environmental': 'Environmental',
      'public_health': 'Public Health',
      'transportation': 'Transportation',
      'water_and_sanitation': 'Water & Sanitation',
      'other': 'Other'
    };
    return typeLabels[type] || type;
  }

  getAgencyName(complaint: Complaint): string {
    return complaint.agency?.name || 'Unknown Agency';
  }

  getUserName(complaint: Complaint): string {
    // Check if user info is in complaint
    if (complaint.user) {
      if (complaint.user.firstName && complaint.user.lastName) {
        return `${complaint.user.firstName} ${complaint.user.lastName}`;
      }
      return complaint.user.email || complaint.userId;
    }
    
    // Check cache
    const cachedUser = this.usersCache.get(complaint.userId);
    if (cachedUser) {
      if (cachedUser.firstName && cachedUser.lastName) {
        return `${cachedUser.firstName} ${cachedUser.lastName}`;
      }
      return cachedUser.email || complaint.userId;
    }
    
    // Fallback to userId
    return complaint.userId || 'Unknown User';
  }

  getStatusOptions(): string[] {
    return Object.values(ComplaintStatus);
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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    // Check if user scrolled near the bottom (within 200px)
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollPosition >= documentHeight - 200) {
      this.onScroll();
    }
  }
}


