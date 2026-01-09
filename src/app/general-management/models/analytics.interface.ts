export interface PerformanceStats {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  averageResolutionTime: number;
  resolutionRate: number;
}

export interface ComplaintsByStatus {
  data: StatusData[];
}

export interface StatusData {
  status: string;
  count: number;
}

export interface ComplaintsByAgency {
  data: AgencyData[];
}

export interface AgencyData {
  agencyId: string;
  agencyName: string;
  count: number;
}

export interface ComplaintsByType {
  data: TypeData[];
}

export interface TypeData {
  type: string;
  count: number;
}

export interface ResolutionTimeStats {
  averageTimeInDays: number;
  medianTimeInDays: number;
  minTimeInDays: number;
  maxTimeInDays: number;
  totalResolved: number;
}

export interface AnalyticsQueryParams {
  startDate?: string;
  endDate?: string;
}

