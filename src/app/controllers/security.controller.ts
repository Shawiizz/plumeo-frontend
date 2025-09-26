import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LoginRequestDto} from '../dto/request/auth/login-request.dto';
import {RegisterRequestDto} from '../dto/request/auth/register-request.dto';
import {AuthResponseDto} from '../dto/response/auth/auth-response.dto';

@Injectable({
  providedIn: 'root'
})
export class SecurityController {
    private readonly http = inject(HttpClient)
    private readonly baseUrl = `${environment.apiEndpoint}/api/auth/`;

    login(data: LoginRequestDto) {
        return this.http.post<AuthResponseDto>(`${this.baseUrl}login`, data);
    }

    register(data: RegisterRequestDto) {
        return this.http.post<AuthResponseDto>(`${this.baseUrl}register`, data);
    }
}
