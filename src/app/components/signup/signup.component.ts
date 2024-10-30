import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/register-request.model';
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

  constructor(private authService: AuthService, private router: Router) {}
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
    console.log(registerRequest);

    this.authService.register(registerRequest).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      (error) => {
        this.isLoading = false;
        // Handle error messages based on the response from the server
        if (error.error && error.error.length) {
          this.errorMessage = error.error
            .map((err: { description: string }) => err.description)
            .join(', ');
        } else {
          this.errorMessage = 'Registration failed. Please try again.'; // Generic error message
        }
      }
    );
  }
}
