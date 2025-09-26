import {inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

export interface ToastMessage {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail?: string;
  life?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly messageService = inject(MessageService);

  /**
   * Displays a success toast
   */
  showSuccess(summary: string, detail?: string, life: number = 5000): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life
    });
  }

  /**
   * Displays an error toast
   */
  showError(summary: string, detail?: string, life: number = 8000): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life
    });
  }

  /**
   * Displays an info toast
   */
  showInfo(summary: string, detail?: string, life: number = 5000): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life
    });
  }

  /**
   * Displays a warning toast
   */
  showWarn(summary: string, detail?: string, life: number = 6000): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life
    });
  }

  /**
   * Displays a custom toast
   */
  showCustom(message: ToastMessage): void {
    this.messageService.add({
      severity: message.severity,
      summary: message.summary,
      detail: message.detail,
      life: message.life || 5000
    });
  }

  /**
   * Clears all toasts
   */
  clear(): void {
    this.messageService.clear();
  }

  /**
   * Clears a specific toast by key
   */
  clearByKey(key: string): void {
    this.messageService.clear(key);
  }
}
