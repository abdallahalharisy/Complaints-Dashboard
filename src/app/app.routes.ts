import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { AgencyComponent } from './agency/agency.component';
import { UsersComponent } from './users/users.component';
import { GeneralManagementComponent } from './general-management/general-management.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/analytics',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthComponent
  },
  {
    path: 'analytics',
    component: GeneralManagementComponent
  },
  {
    path: 'complaints',
    component: ComplaintsComponent
  },
  {
    path: 'agencies',
    component: AgencyComponent
  },
  {
    path: 'users',
    component: UsersComponent
  }
];
