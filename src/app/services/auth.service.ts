import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { RegisterRequest } from '../models/register-request.model';
import { RegisterResponse } from '../models/register-response.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Import the jwt-decode library
// import {
//   SocialAuthService,
//   GoogleLoginProvider,
// } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    // private socialAuthService: SocialAuthService
  ) {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/api/auth/login`, loginRequest)
      .pipe(
        tap((response: LoginResponse) => {
          const token = response.token; // Assuming response contains the token
          localStorage.setItem('token', response.token);
        })
      );
  }

  getUserDataFromToken(): any {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(
        `${this.apiUrl}/api/auth/register`,
        registerRequest
      )
      .pipe(
        catchError((error) => {
          console.error('Registration error:', error);
          return throwError(
            () => new Error('Registration failed. Please try again.')
          );
        })
      );
  }

  googleSignIn(idToken: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/api/auth/google-signin`, { idToken })
      .pipe(
        tap((response: any) => {
          const token = response.token;          
          localStorage.setItem('token', token);
        }),
        catchError((error) => {
          console.error('Google sign-in error:', error);
          return throwError(() => new Error('Google sign-in failed.'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token'); // Remove token from localStorage
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
