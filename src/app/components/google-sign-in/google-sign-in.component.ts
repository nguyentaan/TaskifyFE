import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.scss'],
})
export class GoogleSignInComponent implements OnInit {
  @Input() isLoading: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    // Define the callback on the global window object
    if (typeof window !== 'undefined') {
      console.log('Google Sign-In script loaded.');
      (window as any).handleOauthResponse = this.handleOauthResponse.bind(this);
    }
  }

  ngOnDestroy(): void {
    // Clean up the global callback to prevent memory leaks
    if (typeof window !== 'undefined' && (window as any).handleOauthResponse) {
      delete (window as any).handleOauthResponse;
    }
  }

  // Callback function to handle OAuth response from Google
  handleOauthResponse(response: any): void {
    this.isLoading = true;
    const idToken = response.credential; // ID token from Google

    if (!idToken) {
      console.error('No ID token received from Google.');
      this.snackbar.showError('Google sign-in failed: No ID token received.');
      this.isLoading = false;
      return;
    }

    this.authService.googleSignIn(idToken).subscribe({
      next: () => {
        console.log('Google sign-in successful!');
        this.snackbar.showSuccess('Google sign-in successful');
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Google sign-in error:', error);
        this.snackbar.showError('Google sign-in failed');
        this.isLoading = false;
      },
    });
  }
}
