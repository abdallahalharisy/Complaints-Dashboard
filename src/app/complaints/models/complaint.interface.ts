export enum ComplaintType {
  ENVIRONMENTAL = "environmental",
  PUBLIC_HEALTH = "public_health",
  TRANSPORTATION = "transportation",
  WATER_AND_SANITATION = "water_and_sanitation",
  OTHER = "other",
}

export enum ComplaintStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  AWAITING_INFO = 'awaiting_info',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export interface ComplaintFile {
  link: string;
  mimeType: string;
}

export interface ComplaintTypeObject {
  id: string;
  name: string;
}

export interface Agency {
  id: string;
  name: string;
  complaintTypes?: ComplaintTypeObject[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  userId: string;
  agencyId: string;
  type: ComplaintType | ComplaintTypeObject;
  location: string;
  files: ComplaintFile[];
  status: ComplaintStatus;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  agency?: Agency;
  user?: User;
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

