import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { ToastService } from '../services/toast.service';
import { TranslocoService } from '@jsverse/transloco';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const securityService = inject(SecurityService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  const translocoService = inject(TranslocoService);

  if (securityService.isAuthenticated()) {
    return true;
  }

  translocoService.selectTranslate('auth.guard.accessDenied')
    .pipe(take(1))
    .subscribe(() => {
      toastService.showWarn(
        translocoService.translate('auth.guard.accessDenied'),
        translocoService.translate('auth.guard.loginRequired')
      );
    });

  // Redirect to sign-in page if not authenticated
  router.navigate(['/sign-in']);
  return false;
};