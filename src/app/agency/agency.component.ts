import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgencyService } from './agency.service';
import { Agency } from './models/agency.interface';
import { LoadingComponent } from '../shared/loading/loading.component';

@Component({
  selector: 'app-agency',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  templateUrl: './agency.component.html',
  styleUrl: './agency.component.css'
})
export class AgencyComponent implements OnInit {
  agencies: Agency[] = [];
  loading: boolean = true;
  error: string = '';
  showAddForm: boolean = false;
  newAgencyName: string = '';
  isSubmitting: boolean = false;

  constructor(private agencyService: AgencyService) {}

  ngOnInit(): void {
    this.loadAgencies();
  }

  loadAgencies(): void {
    this.loading = true;
    this.error = '';
    
    this.agencyService.getAll().subscribe({
      next: (data) => {
        this.agencies = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load agencies';
        this.loading = false;
        console.error('Error loading agencies:', err);
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newAgencyName = '';
      this.error = '';
    }
  }

  addAgency(): void {
    if (!this.newAgencyName.trim()) {
      this.error = 'Agency name is required';
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    this.agencyService.create(this.newAgencyName.trim()).subscribe({
      next: (newAgency) => {
        this.agencies.push(newAgency);
        this.newAgencyName = '';
        this.showAddForm = false;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create agency';
        this.isSubmitting = false;
        console.error('Error creating agency:', err);
      }
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

