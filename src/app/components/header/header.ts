import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private readonly securityService = inject(SecurityService);

  logout(): void {
    this.securityService.logout();
    // Redirection now handled by SecurityService
  }
}
