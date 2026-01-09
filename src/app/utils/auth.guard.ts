import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  
  // If not in browser (SSR), allow navigation
  if (!isBrowser) {
    return true;
  }
  
  // Check if user has a valid token
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  
  if (token) {
    return true;
  }
  
  // No token found, redirect to login
  console.log('Auth Guard - No token found, redirecting to login');
  router.navigate(['/login']);
  return false;
};

