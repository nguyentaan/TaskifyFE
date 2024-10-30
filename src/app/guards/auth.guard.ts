import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(public router: Router) {}

  isAuthenticated(): boolean {
    // Check for `window` to ensure it's a browser environment
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');
      return !!token; // Return true if the token exists, false otherwise
    }
    return false; // Return false if not in a browser environment
  }
}

// Define the CanActivate function
export const authGuard: CanActivateFn = (route, state) => {
  const authGuard = inject(AuthGuard); // Use Angular's DI to get an instance
  const isAuthenticated = authGuard.isAuthenticated();

  if (isAuthenticated) {
    return true; // Allow access if authenticated
  } else {
    authGuard.router.navigate(['/login']); // Redirect to login if not authenticated
    return false; // Deny access
  }
};
