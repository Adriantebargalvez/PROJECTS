import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthAccount, AuthUser } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'rrhh-auth-user';

  private readonly demoAccounts: AuthAccount[] = [
    {
      email: 'admin@empresa.com',
      password: 'Admin123!',
      name: 'Administrador',
      role: 'ADMIN'
    },
    {
      email: 'rrhh@empresa.com',
      password: 'Rrhh123!',
      name: 'Equipo RRHH',
      role: 'RRHH'
    },
    {
      email: 'lector@empresa.com',
      password: 'Lector123!',
      name: 'Usuario lector',
      role: 'LECTOR'
    }
  ];

  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(this.readStoredSession());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get demoUsers(): AuthAccount[] {
    return [...this.demoAccounts];
  }

  login(email: string, password: string): boolean {
    const account = this.demoAccounts.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
    );

    if (!account) {
      return false;
    }

    const sessionUser: AuthUser = {
      email: account.email,
      name: account.name,
      role: account.role
    };

    localStorage.setItem(this.storageKey, JSON.stringify(sessionUser));
    this.currentUserSubject.next(sessionUser);
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }

  canManageUsers(): boolean {
    const role = this.currentUser?.role;
    return role === 'ADMIN' || role === 'RRHH';
  }

  private readStoredSession(): AuthUser | null {
    const rawValue = localStorage.getItem(this.storageKey);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as AuthUser;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
