import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SessionService } from './session.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  
  // Skip adding Authorization header for login requests
  const isLoginRequest = req.url.includes('/auth/signin');
  
  console.log('Interceptor - Request URL:', req.url);
  console.log('Interceptor - Is login request:', isLoginRequest);
  console.log('Interceptor - Has token:', !!sessionService.token);
  
  let clonedReq = req;
  
  if (sessionService.token && !isLoginRequest) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${sessionService.token}`
      }
    });
    console.log('Interceptor - Adding Authorization header');
  } else {
    console.log('Interceptor - Passing request without Authorization header');
  }
  
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401 && isBrowser) {
        console.log('Interceptor - 401 Unauthorized, redirecting to login');
        
        // Clear session and localStorage
        sessionService.token = '';
        sessionService.role = '';
        
        if (isBrowser) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
        
        // Redirect to login page
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};

