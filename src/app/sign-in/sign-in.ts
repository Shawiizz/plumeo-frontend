import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {Divider} from 'primeng/divider';
import {SecurityService} from '../services/security.service';
import {ToastService} from '../services/toast.service';
import {TranslocoService, TranslocoPipe} from '@jsverse/transloco';

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

  email: string = "";
  username: string = "";
  password: string = "";
  isRegistering: boolean = false;

  authenticate() {
    // Field validation
    if (!this.email || !this.password) {
      this.toastService.showWarn(
        this.translocoService.translate('auth.validation.fieldsRequired'),
        this.translocoService.translate('auth.validation.fillAllFields')
      );
      return;
    }

    if (this.isRegistering && !this.username) {
      this.toastService.showWarn(
        this.translocoService.translate('auth.validation.usernameRequired'),
        this.translocoService.translate('auth.validation.enterUsername')
      );
      return;
    }

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

          this.isRegistering = false;
          this.clearForm();
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

          // Handle successful login, e.g., store token, redirect, etc.
          this.clearForm();
        }
      });
    }
  }

  private clearForm(): void {
    this.email = '';
    this.username = '';
    this.password = '';
  }
}
