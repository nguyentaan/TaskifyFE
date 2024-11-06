// google-sign-in.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.scss'],
})
export class GoogleSignInComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Define the callback globally so it can be accessed by Google Identity Services
    (window as any).handleOauthResponse = this.handleOauthResponse.bind(this);
  }

  // Callback function to handle OAuth response from Google
  handleOauthResponse(response: any): void {
    const idToken = response.credential; // ID token from Google
    this.authService.googleSignIn(idToken).subscribe({
      next: () => {
        console.log('Google sign-in successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => console.error('Google sign-in error:', error),
    });
  }
}
