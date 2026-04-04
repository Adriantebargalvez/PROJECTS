import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'rrhh-theme';
  private readonly themeSubject = new BehaviorSubject<ThemeMode>(this.readStoredTheme());

  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  get currentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    const nextTheme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.themeSubject.next(nextTheme);
    this.applyTheme(nextTheme);
    localStorage.setItem(this.storageKey, nextTheme);
  }

  private readStoredTheme(): ThemeMode {
    const storedTheme = localStorage.getItem(this.storageKey);
    return storedTheme === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: ThemeMode): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
