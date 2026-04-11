import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/common/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly tokenKey = 'auth_token';
  private readonly userStorageKey = 'auth_user';

  private readonly userSubject = new BehaviorSubject<Partial<User>>(this.restoreUser());
  private readonly usernameSubject = new BehaviorSubject<string>(this.restoreUsername());
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) { }

  register(user: Partial<User> & { password?: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedInSubject.next(true);
  }

  saveSession(token: string, user?: Partial<User>): void {
    this.saveToken(token);
    if (user) {
      this.setUser(user);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): Observable<any> {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userStorageKey);
    this.userSubject.next({});
    this.usernameSubject.next('');
    this.isLoggedInSubject.next(false);

    return this.http.post(`${this.baseUrl}/auth/logout`, {});
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  setUser(user: Partial<User>): void {
    const mergedUser = { ...this.userSubject.value, ...user };

    this.userSubject.next(mergedUser);
    this.usernameSubject.next(mergedUser.username ?? '');
    localStorage.setItem(this.userStorageKey, JSON.stringify(mergedUser));
  }

  getUser(): Observable<Partial<User>> {
    return this.userSubject.asObservable();
  }

  getUsername(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  updateUsername(username: string): void {
    this.setUser({ username });
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

  private restoreUsername(): string {
    return this.restoreUser().username ?? '';
  }
}
