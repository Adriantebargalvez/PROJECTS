// authService.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from 'src/app/common/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080';
  private tokenKey = 'auth_token';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private userSubject = new BehaviorSubject<any>({});
   // Nuevo BehaviorSubject para el nombre de usuario
   private usernameSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedInSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): Observable<any> {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
    return this.http.post(`${this.baseUrl}/auth/logout`, {});
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  setUser(user: any): void {
    this.userSubject.next(user);
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }
 // Método para obtener el nombre de usuario
 getUsername(): Observable<string> {
  return this.usernameSubject.asObservable();
}


// Método para actualizar el nombre de usuario
 updateUsername(username: string): void {
    const fullName = `${username}`; // Combina nombre y apellido
    this.usernameSubject.next(fullName);
  }
  
  getUserr(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/profile`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/profile`, user);
  }
}

