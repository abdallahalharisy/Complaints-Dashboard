export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  password?: string;
}

export interface CreateStaffDto {
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  targetRole: 'staff_admin' | 'complaint_staff';
  agencyId?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface QueryUserDto {
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first?: string;
    last?: string;
    previous?: string;
    next?: string;
  };
}

