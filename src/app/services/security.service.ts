import {inject, Injectable} from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {SecurityController} from '../controllers/security.controller';
import {RegisterRequestDto} from '../dto/request/auth/register-request.dto';
import {LoginRequestDto} from '../dto/request/auth/login-request.dto';
import {AuthResponseDto} from '../dto/response/auth/auth-response.dto';
import {WebSocketService} from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly securityController = inject(SecurityController);
  private readonly webSocketService = inject(WebSocketService);
  private readonly router = inject(Router);

  private currentTokenSubject = new BehaviorSubject<string | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserEmailSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    // Check for existing token in localStorage on service initialization
    this.checkExistingToken();
  }

  login(data: LoginRequestDto): Observable<AuthResponseDto> {
    return this.securityController.login(data).pipe(
      tap((response: AuthResponseDto) => {
        // Store the token and user info
        this.setAuthenticationData(response.token, data.email);

        // Automatically connect to WebSocket
        this.connectToWebSocket(response.token);

        // Redirect to app after successful login
        setTimeout(() => {
          this.router.navigate(['/app']);
        }, 1500);
      })
    );
  }

  register(data: RegisterRequestDto): Observable<AuthResponseDto> {
    return this.securityController.register(data).pipe(
      tap((response: AuthResponseDto) => {
        // Store the token and user info
        this.setAuthenticationData(response.token, data.email);

        // Automatically connect to WebSocket
        this.connectToWebSocket(response.token);

        // Redirect to app after successful registration
        setTimeout(() => {
          this.router.navigate(['/app']);
        }, 1500);
      })
    );
  }

  /**
   * Set authentication data and update observables
   */
  private setAuthenticationData(token: string, email: string): void {
    // Store in localStorage for persistence
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_email', email);

    // Update observables
    this.currentTokenSubject.next(token);
    this.currentUserEmailSubject.next(email);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Connect to WebSocket with current token
   */
  private async connectToWebSocket(token: string): Promise<void> {
    try {
      await this.webSocketService.connect(token);
      console.log('WebSocket connected successfully after login');
    } catch (error) {
      console.error('Failed to connect WebSocket after login:', error);
    }
  }

  /**
   * Check for existing token on service initialization
   */
  private checkExistingToken(): void {
    const token = localStorage.getItem('jwt_token');
    const email = localStorage.getItem('user_email');

    if (token && email) {
      this.currentTokenSubject.next(token);
      this.currentUserEmailSubject.next(email);
      this.isAuthenticatedSubject.next(true);

      // Automatically reconnect WebSocket if token exists
      this.connectToWebSocket(token);
    }
  }

  /**
   * Logout user and disconnect WebSocket
   */
  logout(): void {
    // Clear localStorage
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');

    // Update observables
    this.currentTokenSubject.next(null);
    this.currentUserEmailSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Disconnect WebSocket
    this.webSocketService.disconnect();

    // Redirect to sign-in page
    this.router.navigate(['/sign-in']);
  }

  /**
   * Get current token
   */
  getCurrentToken(): string | null {
    return this.currentTokenSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Force refresh WebSocket connection with current token
   */
  refreshWebSocketConnection(): void {
    const token = this.getCurrentToken();
    if (token) {
      this.webSocketService.disconnect();
      this.connectToWebSocket(token);
    }
  }
}
