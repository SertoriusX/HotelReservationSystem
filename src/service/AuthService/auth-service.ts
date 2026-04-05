import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { RegisterModel } from '../../model/AuthModel/register-model';
import { LoginModel } from '../../model/AuthModel/login-model';
import { AuthResponseModel } from '../../model/AuthResponseModel/auth-response-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private backUrl = "http://localhost:5009/api/Auth"
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient){}

  register(dto: RegisterModel): Observable<AuthResponseModel>{
    return this.http.post<AuthResponseModel>(`${this.backUrl}/register`, dto)
  }

  login(dto: LoginModel): Observable<AuthResponseModel>{
    return this.http.post<AuthResponseModel>(`${this.backUrl}/login`, dto)
  }

  getToken(): string | null{
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("token")
    }
    return null;
  }

  getRole(): string | null{
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("role")
    }
    return null;
  }

  getUserId(): number | null{
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem("userId");
      return userId ? +userId : null;
    }
    return null;
  }

  saveToken(token: string, roles: string, userId?: number){
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("token", token)
      localStorage.setItem("role", roles)
      if (userId) {
        localStorage.setItem("userId", userId.toString())
      }
    }
  }

  logout(): void{
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      localStorage.removeItem("userId")
    }
  }
  getUsername(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("username");
    }
    return null;
  }
}
