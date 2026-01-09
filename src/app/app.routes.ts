import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { AgencyComponent } from './agency/agency.component';
import { UsersComponent } from './users/users.component';
import { GeneralManagementComponent } from './general-management/general-management.component';
import { authGuard } from './utils/auth.guard';

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
    component: GeneralManagementComponent,
    canActivate: [authGuard]
  },
  {
    path: 'complaints',
    component: ComplaintsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'agencies',
    component: AgencyComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard]
  }
];
