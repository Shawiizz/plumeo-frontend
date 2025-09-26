import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {SecurityService} from '../services/security.service';
import {catchError, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const securityService = inject(SecurityService);
  
  // Get the current token
  const token = securityService.getCurrentToken();
  
  // Clone the request and add the Authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(authReq).pipe(
    catchError((error) => {
      // If we get a 401, the token might be expired - logout the user
      if (error.status === 401) {
        console.log('Received 401 error, logging out user');
        securityService.logout();
      }
      
      // Re-throw the error so other interceptors can handle it
      return throwError(() => error);
    })
  );
};