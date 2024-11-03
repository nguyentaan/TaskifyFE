import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/register-request.model';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}
  onRegister() {
    this.isLoading = true;
    this.errorMessage = '';
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.isLoading = false;
      return;
    }
    // Create the registration request object
    const registerRequest: RegisterRequest = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.authService.register(registerRequest).subscribe(
      () => {
        this.isLoading = false;
        this.snackbar.showSuccess(
          'Registration successful. Please login to continue.'
        );
        this.router.navigate(['/login']);
      },
      (error) => {
        this.isLoading = false;
        // Handle error messages based on the response from the server
        if (error.error && error.error.length) {
          this.errorMessage = error.error
            .map((err: { description: string }) => err.description)
            .join(', ');
          this.errorMessage =
            this.errorMessage.charAt(0).toUpperCase() +
            this.errorMessage.slice(1);
          this.snackbar.showError(this.errorMessage);
        } else {
          this.errorMessage = 'Registration failed. Please try again.'; // Generic error message

          this.snackbar.showError(this.errorMessage);
        }
      }
    );
  }

  passwordValidation(): boolean {
    const passwordPattern =
      /^(?=.*[0-9])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{6,}$/;
    return this.password ? passwordPattern.test(this.password) : false;
  }

  passWordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }
}
