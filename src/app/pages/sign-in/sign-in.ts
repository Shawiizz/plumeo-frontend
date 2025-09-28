import {Component, inject, OnInit, effect} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {toObservable} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {Button} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {Divider} from 'primeng/divider';
import {SecurityService} from '../../services/security.service';
import {ToastService} from '../../services/toast.service';
import {TranslocoService, TranslocoPipe} from '@jsverse/transloco';
import {WebSocketService} from '../../services/websocket.service';
import {distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-sign-in',
  imports: [
    Button,
    FormsModule,
    InputText,
    Password,
    Divider,
    TranslocoPipe
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss'
})
export class SignIn {
  private readonly securityService = inject(SecurityService);
  private readonly toastService = inject(ToastService);
  private readonly translocoService = inject(TranslocoService);
  private readonly webSocketService = inject(WebSocketService);
  private readonly router = inject(Router);

  email: string = "";
  username: string = "";
  password: string = "";
  isRegistering: boolean = false;
  isLoading: boolean = false;
  
  // Validation states
  emailInvalid: boolean = false;
  usernameInvalid: boolean = false;
  passwordInvalid: boolean = false;

  constructor() {
    // Redirect if user is already authenticated
    if (this.securityService.isAuthenticated()) {
      this.router.navigate(['/app']);
      return;
    }

    this.webSocketService.on('test-topic')
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (message) => {
          console.log(message);
          this.toastService.showInfo(message);
        }
      });
  }

  authenticate() {
    // Reset validation states
    this.emailInvalid = false;
    this.usernameInvalid = false;
    this.passwordInvalid = false;
    
    // Field validation
    if (!this.email) {
      this.emailInvalid = true;
    } else if (!this.isValidEmail(this.email)) {
      this.emailInvalid = true;
      return;
    }

    if (!this.password) {
      this.passwordInvalid = true;
    }

    if (this.isRegistering && !this.username) {
      this.usernameInvalid = true;
    }

    if (this.emailInvalid || this.passwordInvalid || (this.isRegistering && this.usernameInvalid)) {
      return;
    }

    this.isLoading = true;

    if (this.isRegistering) {
      this.securityService.register({
        email: this.email,
        username: this.username,
        password: this.password
      }).subscribe({
        next: (response) => {
          console.log("Registration successful:", response);
          this.toastService.showSuccess(
            this.translocoService.translate('auth.register.success'),
            this.translocoService.translate('auth.register.message')
          );

          this.clearForm();
          // Redirection now handled by SecurityService
        },
        error: (error) => {
          console.error("Registration failed:", error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.securityService.login({
        email: this.email,
        password: this.password
      }).subscribe({
        next: (response) => {
          console.log("Login successful:", response);
          this.toastService.showSuccess(
            this.translocoService.translate('auth.login.success'),
            this.translocoService.translate('auth.login.welcome', { name: this.username || this.email })
          );

          this.clearForm();
          // WebSocket connection and redirection now handled by SecurityService
        },
        error: (error) => {
          console.error("Login failed:", error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private clearForm(): void {
    this.email = '';
    this.username = '';
    this.password = '';
    // Reset validation states
    this.emailInvalid = false;
    this.usernameInvalid = false;
    this.passwordInvalid = false;
  }
}
