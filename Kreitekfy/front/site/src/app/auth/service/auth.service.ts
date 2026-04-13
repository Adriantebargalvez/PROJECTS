import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/common/user';
import { environment } from 'src/environments/environment';
import { AuthResponse, GoogleAuthConfigResponse } from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;
  private readonly tokenKey = 'auth_token';
  private readonly userStorageKey = 'auth_user';

  private readonly userSubject = new BehaviorSubject<Partial<User>>(this.restoreUser());
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) { }

  register(user: Partial<User> & { password?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, user);
  }

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials);
  }

  loginWithGoogle(credential: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/google`, { credential });
  }

  getGoogleAuthConfig(): Observable<GoogleAuthConfigResponse> {
    return this.http.get<GoogleAuthConfigResponse>(`${this.baseUrl}/auth/google/config`);
  }

  saveSession(token: string, user?: Partial<User>): void {
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedInSubject.next(true);

    if (user) {
      const mergedUser = { ...this.userSubject.value, ...user };

      this.userSubject.next(mergedUser);
      localStorage.setItem(this.userStorageKey, JSON.stringify(mergedUser));
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): Observable<void> {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userStorageKey);
    this.userSubject.next({});
    this.isLoggedInSubject.next(false);

    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {});
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUser(): Observable<Partial<User>> {
    return this.userSubject.asObservable();
  }

  private restoreUser(): Partial<User> {
    const persistedUser = localStorage.getItem(this.userStorageKey);
    if (!persistedUser) {
      return {};
    }

    try {
      return JSON.parse(persistedUser) as Partial<User>;
    } catch {
      localStorage.removeItem(this.userStorageKey);
      return {};
    }
  }
}
