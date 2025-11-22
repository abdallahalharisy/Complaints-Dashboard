import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from './session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);
  
  // Skip adding Authorization header for login requests
  const isLoginRequest = req.url.includes('/auth/signin');
  
  console.log('Interceptor - Request URL:', req.url);
  console.log('Interceptor - Is login request:', isLoginRequest);
  console.log('Interceptor - Has token:', !!sessionService.token);
  
  if (sessionService.token && !isLoginRequest) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${sessionService.token}`
      }
    });
    console.log('Interceptor - Adding Authorization header');
    return next(clonedReq);
  }
  
  console.log('Interceptor - Passing request without Authorization header');
  return next(req);
};

