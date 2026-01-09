import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralManagementService } from './general-management.service';
import {
  PerformanceStats,
  ComplaintsByStatus,
  ComplaintsByAgency,
  ComplaintsByType,
  ResolutionTimeStats,
  AnalyticsQueryParams
} from './models/analytics.interface';

@Component({
  selector: 'app-general-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general-management.component.html',
  styleUrl: './general-management.component.css'
})
export class GeneralManagementComponent implements OnInit {
  loading = false;
  error: string | null = null;

  // Date filters
  startDate: string = '';
  endDate: string = '';

  // Analytics data
  performanceStats: PerformanceStats | null = null;
  complaintsByStatus: ComplaintsByStatus | null = null;
  complaintsByAgency: ComplaintsByAgency | null = null;
  complaintsByType: ComplaintsByType | null = null;
  resolutionTimeStats: ResolutionTimeStats | null = null;

  // Chart data for visualization
  statusChartData: { label: string; value: number; color: string }[] = [];
  agencyChartData: { label: string; value: number }[] = [];
  typeChartData: { label: string; value: number }[] = [];

  constructor(private generalManagementService: GeneralManagementService) {}

  ngOnInit(): void {
    this.loadAllAnalytics();
  }

  loadAllAnalytics(): void {
    this.loading = true;
    this.error = null;

    const queryParams = this.buildQueryParams();

    // Load all analytics data
    this.loadPerformanceStats(queryParams);
    this.loadComplaintsByStatus(queryParams);
    this.loadComplaintsByAgency(queryParams);
    this.loadComplaintsByType(queryParams);
    this.loadResolutionTimeStats(queryParams);
  }

  private buildQueryParams(): AnalyticsQueryParams {
    const params: AnalyticsQueryParams = {};
    if (this.startDate) {
      params.startDate = new Date(this.startDate).toISOString();
    }
    if (this.endDate) {
      params.endDate = new Date(this.endDate).toISOString();
    }
    return params;
  }

  loadPerformanceStats(queryParams: AnalyticsQueryParams): void {
    this.generalManagementService.getPerformanceStats(queryParams).subscribe({
      next: (data) => {
        this.performanceStats = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load performance statistics';
        this.loading = false;
        console.error('Error loading performance stats:', err);
      }
    });
  }

  loadComplaintsByStatus(queryParams: AnalyticsQueryParams): void {
    this.generalManagementService.getComplaintsByStatus(queryParams).subscribe({
      next: (data) => {
        this.complaintsByStatus = data;
        this.prepareStatusChartData();
      },
      error: (err) => {
        console.error('Error loading complaints by status:', err);
      }
    });
  }

  loadComplaintsByAgency(queryParams: AnalyticsQueryParams): void {
    this.generalManagementService.getComplaintsByAgency(queryParams).subscribe({
      next: (data) => {
        this.complaintsByAgency = data;
        this.prepareAgencyChartData();
      },
      error: (err) => {
        console.error('Error loading complaints by agency:', err);
      }
    });
  }

  loadComplaintsByType(queryParams: AnalyticsQueryParams): void {
    this.generalManagementService.getComplaintsByType(queryParams).subscribe({
      next: (data) => {
        this.complaintsByType = data;
        this.prepareTypeChartData();
      },
      error: (err) => {
        console.error('Error loading complaints by type:', err);
      }
    });
  }

  loadResolutionTimeStats(queryParams: AnalyticsQueryParams): void {
    this.generalManagementService.getResolutionTimeStats(queryParams).subscribe({
      next: (data) => {
        this.resolutionTimeStats = data;
      },
      error: (err) => {
        console.error('Error loading resolution time stats:', err);
      }
    });
  }

  prepareStatusChartData(): void {
    if (!this.complaintsByStatus) return;

    const statusColors: { [key: string]: string } = {
      'PENDING': '#f59e0b',
      'IN_PROGRESS': '#3b82f6',
      'RESOLVED': '#10b981',
      'REJECTED': '#ef4444',
      'CLOSED': '#6b7280'
    };

    this.statusChartData = this.complaintsByStatus.data.map(item => ({
      label: this.formatStatusLabel(item.status),
      value: item.count,
      color: statusColors[item.status] || '#6b7280'
    }));
  }

  prepareAgencyChartData(): void {
    if (!this.complaintsByAgency) return;

    this.agencyChartData = this.complaintsByAgency.data
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 agencies
      .map(item => ({
        label: item.agencyName,
        value: item.count
      }));
  }

  prepareTypeChartData(): void {
    if (!this.complaintsByType) return;

    this.typeChartData = this.complaintsByType.data
      .sort((a, b) => b.count - a.count)
      .map(item => ({
        label: item.type,
        value: item.count
      }));
  }

  formatStatusLabel(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  getBarWidth(value: number, maxValue: number): string {
    if (maxValue === 0) return '0%';
    return `${(value / maxValue) * 100}%`;
  }

  getMaxValue(data: { value: number }[]): number {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map(item => item.value));
  }

  clearDateFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.loadAllAnalytics();
  }

  downloadPdfReport(): void {
    const queryParams = this.buildQueryParams();
    this.generalManagementService.downloadPdfReport(queryParams).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const startDateStr = this.startDate ? this.startDate : 'all';
        const endDateStr = this.endDate ? this.endDate : 'all';
        link.download = `analytics-report-${startDateStr}-to-${endDateStr}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = 'Failed to download PDF report';
        console.error('Error downloading PDF report:', err);
      }
    });
  }

  getTotalStatusCount(): number {
    if (!this.statusChartData) return 0;
    return this.statusChartData.reduce((sum, item) => sum + item.value, 0);
  }

  getStatusPercentage(count: number): number {
    const total = this.getTotalStatusCount();
    if (total === 0) return 0;
    return (count / total) * 100;
  }
}

