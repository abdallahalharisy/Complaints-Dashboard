import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { User, CreateUserDto, CreateStaffDto } from './models/user.interface';
import { LoadingComponent } from '../shared/loading/loading.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error: string = '';
  
  // Form states
  showAddUserForm: boolean = false;
  showAddAdminForm: boolean = false;
  editingUser: User | null = null;
  
  // Form data
  newUser: CreateUserDto = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  };
  
  newAdmin: CreateStaffDto = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    targetRole: 'staff_admin',
    agencyId: ''
  };
  
  selectedProfilePicture: File | null = null;
  profilePicturePreview: string | null = null;
  
  isSubmitting: boolean = false;
  
  // Current user info
  currentUser: User | null = null;
  currentUserRole: string = '';
  
  // Filters
  searchTerm: string = '';
  roleFilter: string = '';
  activeFilter: string = '';
  
  private isBrowser: boolean;

  constructor(
    private userService: UserService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUsers();
  }

  loadCurrentUser(): void {
    this.userService.getMe().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.currentUserRole = user.role;
      },
      error: (err) => {
        console.error('Error loading current user:', err);
        // Try to get role from localStorage (only in browser)
        if (this.isBrowser) {
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
      }
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    
    const query: any = {};
    if (this.roleFilter) query.role = this.roleFilter;
    if (this.activeFilter) query.isActive = this.activeFilter === 'true';
    if (this.searchTerm) query.search = this.searchTerm;

    this.userService.getAll(query).subscribe({
      next: (response) => {
        this.users = response.items || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  // Check if user can add admins (only ADMIN role)
  canAddAdmins(): boolean {
    return this.currentUserRole === 'admin';
  }

  // Check if user can add regular users (ADMIN or STAFF_ADMIN)
  canAddUsers(): boolean {
    return this.currentUserRole === 'admin' || this.currentUserRole === 'staff_admin';
  }

  toggleAddUserForm(): void {
    this.showAddUserForm = !this.showAddUserForm;
    if (!this.showAddUserForm) {
      this.resetUserForm();
    }
    this.showAddAdminForm = false;
  }

  toggleAddAdminForm(): void {
    this.showAddAdminForm = !this.showAddAdminForm;
    if (!this.showAddAdminForm) {
      this.resetAdminForm();
    }
    this.showAddUserForm = false;
  }

  resetUserForm(): void {
    this.newUser = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: ''
    };
    this.selectedProfilePicture = null;
    this.profilePicturePreview = null;
    this.error = '';
  }

  resetAdminForm(): void {
    this.newAdmin = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      targetRole: 'staff_admin',
      agencyId: ''
    };
    this.error = '';
  }

  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedProfilePicture = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicturePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedProfilePicture);
    }
  }

  removeProfilePicture(): void {
    this.selectedProfilePicture = null;
    this.profilePicturePreview = null;
    // Reset the file input
    const fileInput = document.getElementById('userProfilePicture') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  addUser(): void {
    if (!this.newUser.email || !this.newUser.phone) {
      this.error = 'Email and phone are required';
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    this.userService.createUser(this.newUser, this.selectedProfilePicture || undefined).subscribe({
      next: (response) => {
        this.loadUsers();
        this.resetUserForm();
        this.showAddUserForm = false;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.message || err.error?.error || 'Failed to create user';
        this.isSubmitting = false;
        console.error('Error creating user:', err);
      }
    });
  }

  addAdmin(): void {
    if (!this.newAdmin.email || !this.newAdmin.phone || !this.newAdmin.targetRole) {
      this.error = 'Email, phone, and target role are required';
      return;
    }

    // Validate: Staff Admin can only create Complaint Staff
    if (this.currentUserRole === 'staff_admin' && this.newAdmin.targetRole === 'staff_admin') {
      this.error = 'Staff admins can only create complaint staff';
      return;
    }

    // Validate: Complaint Staff requires agencyId
    if (this.newAdmin.targetRole === 'complaint_staff' && !this.newAdmin.agencyId) {
      this.error = 'Agency ID is required for complaint staff';
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    this.userService.createStaff(this.newAdmin).subscribe({
      next: (newStaff) => {
        this.loadUsers();
        this.resetAdminForm();
        this.showAddAdminForm = false;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.message || err.error?.error || 'Failed to create staff';
        this.isSubmitting = false;
        console.error('Error creating staff:', err);
      }
    });
  }

  // Check if agencyId field should be shown
  shouldShowAgencyId(): boolean {
    return this.newAdmin.targetRole === 'complaint_staff';
  }

  // Get available target roles based on current user role
  getAvailableTargetRoles(): { value: string; label: string }[] {
    if (this.currentUserRole === 'admin') {
      return [
        { value: 'staff_admin', label: 'Staff Admin' },
        { value: 'complaint_staff', label: 'Complaint Staff' }
      ];
    } else if (this.currentUserRole === 'staff_admin') {
      return [
        { value: 'complaint_staff', label: 'Complaint Staff' }
      ];
    }
    return [];
  }

  deleteUser(user: User): void {
    if (!confirm(`Are you sure you want to delete ${user.email}?`)) {
      return;
    }

    if (user.role === 'admin') {
      this.error = 'Cannot delete admin user';
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete user';
        console.error('Error deleting user:', err);
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'badge-admin',
      'staff_admin': 'badge-staff-admin',
      'complaint_staff': 'badge-staff',
      'user': 'badge-user'
    };
    return roleMap[role] || 'badge-default';
  }

  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'Admin',
      'staff_admin': 'Staff Admin',
      'complaint_staff': 'Complaint Staff',
      'user': 'User'
    };
    return roleMap[role] || role;
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  applyFilters(): void {
    this.loadUsers();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.roleFilter = '';
    this.activeFilter = '';
    this.loadUsers();
  }
}

