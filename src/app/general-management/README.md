# General Management (Analytics Dashboard) Module

## Overview
The General Management module provides a comprehensive analytics dashboard for the Complaints Management System. It integrates with the backend API to display real-time statistics, charts, and insights about complaint data.

## Features

### 1. **Performance Statistics**
- Total complaints count
- Resolved complaints count
- Pending complaints count
- Resolution rate percentage
- Average resolution time in days

### 2. **Analytics Visualizations**
- **Complaints by Status**: Bar chart showing distribution across different statuses (Pending, In Progress, Resolved, Rejected, Closed)
- **Complaints by Type**: Bar chart displaying complaint types and their counts
- **Complaints by Agency**: Top 10 agencies ranked by complaint volume
- **Resolution Time Statistics**: Detailed metrics including average, median, min, and max resolution times

### 3. **Date Range Filtering**
- Filter all analytics by custom date ranges
- Start date and end date inputs
- Clear filters functionality
- Real-time data updates based on selected filters

### 4. **PDF Report Generation**
- Download comprehensive analytics reports as PDF
- Reports include all visualizations and statistics
- Automatically named with date range in filename

## File Structure

```
general-management/
├── models/
│   └── analytics.interface.ts       # TypeScript interfaces for analytics data
├── general-management.component.ts  # Main component logic
├── general-management.component.html # Template with visualizations
├── general-management.component.css # Styling for the dashboard
├── general-management.service.ts    # HTTP service for API calls
└── README.md                        # This documentation
```

## API Endpoints

The module connects to the following backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/general-managment/performance-stats` | GET | Fetch overall performance statistics |
| `/general-managment/analytics/complaints-by-status` | GET | Get complaints grouped by status |
| `/general-managment/analytics/complaints-by-agency` | GET | Get complaints grouped by agency |
| `/general-managment/analytics/complaints-by-type` | GET | Get complaints grouped by type |
| `/general-managment/analytics/resolution-time-stats` | GET | Get resolution time metrics |
| `/general-managment/analytics/pdf-report` | GET | Download PDF report |

All endpoints support optional query parameters:
- `startDate`: ISO 8601 formatted date string
- `endDate`: ISO 8601 formatted date string

## Usage

### Navigation
Access the Analytics Dashboard through:
- URL: `/analytics`
- Sidebar: Click on "Analytics" menu item (chart icon)

### Filtering Data
1. Select a **Start Date** using the date picker
2. Select an **End Date** using the date picker
3. Click **Apply Filters** to refresh all analytics
4. Click **Clear** to reset filters and show all-time data

### Downloading Reports
1. Optionally set date filters
2. Click **📥 Download PDF Report** button
3. PDF file will be automatically downloaded with naming format: `analytics-report-{startDate}-to-{endDate}.pdf`

## Interfaces

### PerformanceStats
```typescript
interface PerformanceStats {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  averageResolutionTime: number;
  resolutionRate: number;
}
```

### ComplaintsByStatus
```typescript
interface ComplaintsByStatus {
  data: StatusData[];
}

interface StatusData {
  status: string;
  count: number;
}
```

### ComplaintsByAgency
```typescript
interface ComplaintsByAgency {
  data: AgencyData[];
}

interface AgencyData {
  agencyId: string;
  agencyName: string;
  count: number;
}
```

### ComplaintsByType
```typescript
interface ComplaintsByType {
  data: TypeData[];
}

interface TypeData {
  type: string;
  count: number;
}
```

### ResolutionTimeStats
```typescript
interface ResolutionTimeStats {
  averageTimeInDays: number;
  medianTimeInDays: number;
  minTimeInDays: number;
  maxTimeInDays: number;
  totalResolved: number;
}
```

## Service Methods

### GeneralManagementService

```typescript
// Get performance statistics
getPerformanceStats(queryParams?: AnalyticsQueryParams): Observable<PerformanceStats>

// Get complaints by status
getComplaintsByStatus(queryParams?: AnalyticsQueryParams): Observable<ComplaintsByStatus>

// Get complaints by agency
getComplaintsByAgency(queryParams?: AnalyticsQueryParams): Observable<ComplaintsByAgency>

// Get complaints by type
getComplaintsByType(queryParams?: AnalyticsQueryParams): Observable<ComplaintsByType>

// Get resolution time statistics
getResolutionTimeStats(queryParams?: AnalyticsQueryParams): Observable<ResolutionTimeStats>

// Download PDF report
downloadPdfReport(queryParams?: AnalyticsQueryParams): Observable<Blob>
```

## Styling & Design

### Color Scheme
- **Primary Blue**: #3498db (Apply Filters button, In Progress status)
- **Success Green**: #27ae60 (Resolved status, Download button, Agency charts)
- **Warning Orange**: #f59e0b (Pending status)
- **Danger Red**: #ef4444 (Rejected status)
- **Gray**: #6b7280 (Closed status, Clear button)

### Responsive Design
The dashboard is fully responsive with breakpoints at:
- Desktop: > 768px (multi-column grid layout)
- Mobile: ≤ 768px (single column layout, full-width elements)

### Animations
- Smooth bar chart animations on data load
- Card hover effects with elevation
- Button hover states with color transitions
- Spinner animation for loading state

## Error Handling

The component handles errors gracefully:
- Network errors display user-friendly error messages
- Failed API calls are logged to console for debugging
- Individual chart failures don't break the entire dashboard
- Loading states prevent user confusion during data fetching

## Authentication

All API calls include JWT authentication headers:
- Token retrieved from `localStorage` (keys: `accessToken` or `token`)
- Automatically added to request headers via the service
- Uses the centralized `auth.interceptor.ts` if configured

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features
- CSS Grid and Flexbox for layouts
- Date input type for date pickers

## Future Enhancements

Potential improvements:
- Interactive charts with drill-down capabilities
- Export data to CSV/Excel formats
- Scheduled report generation
- Email report delivery
- Custom dashboard widgets
- Real-time updates using WebSockets
- Comparison between different date ranges
- Predictive analytics and trends

## Troubleshooting

### Data not loading
1. Check browser console for API errors
2. Verify authentication token is valid
3. Ensure backend server is running
4. Check network connectivity

### PDF download failing
1. Verify blob handling in browser
2. Check popup blocker settings
3. Ensure sufficient permissions for file downloads
4. Check backend PDF generation service

### Charts not displaying
1. Verify data structure matches interfaces
2. Check for null/undefined data
3. Ensure CSS is loaded properly
4. Inspect browser console for rendering errors

## Support

For issues or questions:
1. Check this README documentation
2. Review backend API documentation
3. Inspect browser developer console
4. Contact development team

