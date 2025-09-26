import {inject, Injectable} from '@angular/core';
import {SecurityController} from '../controllers/security.controller';
import {RegisterRequestDto} from '../dto/request/auth/register-request.dto';
import {LoginRequestDto} from '../dto/request/auth/login-request.dto';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly securityController = inject(SecurityController);

  login(data: LoginRequestDto) {
    return this.securityController.login(data);
  }

  register(data: RegisterRequestDto) {
    return this.securityController.register(data);
  }
}
