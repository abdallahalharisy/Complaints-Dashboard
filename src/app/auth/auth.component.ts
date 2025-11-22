import { Component } from '@angular/core';
import { AuthStates } from './auth_states';
import { Session } from '../utils/session';
import { SessionService } from '../utils/session.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})

export class AuthComponent {
  public AuthStates = AuthStates; // هذه هي الخطوة الأساسية
  email:  string = '';
  password: string = '';
  state : AuthStates = AuthStates.Success;
  error: string = '';
  constructor(
    private session: SessionService, // ✅ Inject the singleton session
    private router: Router, private authService: AuthService ) {
    console.log('AuthComponent constructor called');
    console.log('Initial state:', this.state);
    // Initialize state to Success (not Loading) so form is ready
    this.state = AuthStates.Success;
  }

  login(event?: Event) {
    // Prevent default form submission
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('=== LOGIN FUNCTION CALLED ===');
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('State:', this.state);
    
    // Validate input
    if (this.email.length < 3 || !this.email.includes(".com")) {
      this.state = AuthStates.Failure;
      this.error = "Invalid Email";
      return;
    }

    if (this.password.length < 8) {
      this.state = AuthStates.Failure;
      this.error = "Incorrect password";
      return;
    }

    // Prevent duplicate login attempts
    if (this.state === AuthStates.Loading) {
      return;
    }

    this.state = AuthStates.Loading;
    console.log('Starting login request...');
    
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('=== LOGIN RESPONSE RECEIVED ===');
        console.log('Full response:', response);
        
        // Check if response has accessToken (support both accessToken and accesToken)
        const accessToken = response?.accessToken || response?.accesToken;
        
        if (response && accessToken) {
          console.log('Access token found:', accessToken);
          console.log('User role:', response.user?.role);
          
          // Store access token in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('token', accessToken); // Keep for backward compatibility
          
          // Store refresh token if available
          if (response.refreshToken) {
            if (typeof response.refreshToken === 'string') {
              localStorage.setItem('refreshToken', response.refreshToken);
            } else if (response.refreshToken.token) {
              localStorage.setItem('refreshToken', response.refreshToken.token);
            }
          }
          
          // Store the complete user data
          localStorage.setItem('user', JSON.stringify(response.user || response));

          // Store session data - accessToken is directly in response, role is in user object
          this.session.token = accessToken;
          this.session.role = response.user?.role || 'user';

          // Update state
          this.state = AuthStates.Success;
          console.log('Login successful! Access token saved to localStorage');
          console.log('Navigating to complaints...');
          
          // Navigate after successful login
          setTimeout(() => {
            console.log('Attempting navigation to /complaints');
            this.router.navigate(['/complaints']).then(
              (success) => console.log('Navigation successful:', success),
              (error) => console.error('Navigation failed:', error)
            );
          }, 100);
        } else {
          console.error('Login failed - no accessToken in response');
          this.state = AuthStates.Failure;
          this.error = response?.message || "Login failed - invalid response";
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error details:', err.error);
        
        this.state = AuthStates.Failure;
        this.error = err.error?.message || err.message || "Login failed";
      }
    });
  }
}
