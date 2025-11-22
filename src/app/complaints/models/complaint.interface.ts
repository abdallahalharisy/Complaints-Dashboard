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
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export interface ComplaintFile {
  link: string;
  mimeType: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  userId: string;
  agencyId: string;
  type: ComplaintType;
  location: string;
  files: ComplaintFile[];
  status: ComplaintStatus;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

