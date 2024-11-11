import {
  Component,
  EventEmitter,
  Output,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.scss'],
})
export class GoogleSignInComponent {
  @Output() loadingChange = new EventEmitter<boolean>();
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleSignIn();
    }
  }

  loadGoogleSignIn() {
    if (typeof google === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => this.initGoogleSignIn();
      document.head.appendChild(script);
    } else {
      this.initGoogleSignIn();
    }
  }

  initGoogleSignIn() {
    google.accounts.id.initialize({
      client_id:
        '949928109687-ualg36c3l1v73dtqmudotboi79f7pvds.apps.googleusercontent.com',
      callback: this.handleOauthResponse.bind(this),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'), // Provide a DOM element for the button
      { theme: 'outline', size: 'large' }
    );

    google.accounts.id.prompt(); // Optional: Prompt the user to log in if not already signed in
  }

  handleOauthResponse(response: any): void {
    this.setLoading(true);
    const idToken = response.credential;

    if (!idToken) {
      console.error('No ID token received from Google.');
      this.snackbar.showError('Google sign-in failed: No ID token received.');
      this.setLoading(false);
      return;
    }

    this.authService.googleSignIn(idToken).subscribe({
      next: () => {
        console.log('Google sign-in successful!');
        this.snackbar.showSuccess('Google sign-in successful');
        this.router.navigate(['/dashboard']);
        this.setLoading(false);
      },
      error: (error) => {
        console.error('Google sign-in error:', error);
        this.snackbar.showError('Google sign-in failed');
        this.setLoading(false);
      },
    });
  }

  private setLoading(state: boolean): void {
    this.isLoading = state;
    this.loadingChange.emit(state);
  }
}
