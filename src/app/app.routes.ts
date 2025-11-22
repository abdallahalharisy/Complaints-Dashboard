import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { AgencyComponent } from './agency/agency.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'complaints',
    component: ComplaintsComponent
  },
  {
    path: 'agencies',
    component: AgencyComponent
  }
];
