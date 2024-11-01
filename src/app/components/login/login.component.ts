import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading=false;

  constructor(private authService: AuthService, private router: Router, private snackbar: SnackbarService) {}

  onLogin() {
    this.isLoading=true;
    const loginRequest: LoginRequest = {
      email: this.email,
      password: this.password,
    };
    this.authService.login(loginRequest).subscribe(
      (response) => {
        // console.log('Login successful', response);
        this.isLoading=false;
        this.snackbar.showSuccess('Login successful');
        this.router.navigate(['/dashboard']);
        // Add navigation or additional actions upon successful login
      },
      (error) => {
        console.error('Error:', error);
        this.snackbar.showError('Login failed, Please Try Again');
        this.isLoading=false;
        // Display error message to user if needed
      }
    );
  }
}
