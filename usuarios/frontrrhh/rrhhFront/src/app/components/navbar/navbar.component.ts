import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUser } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeMode, ThemeService } from 'src/app/services/theme.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  readonly currentUser$: Observable<AuthUser | null> = this.authService.currentUser$;
  readonly theme$: Observable<ThemeMode> = this.themeService.theme$;

  constructor(
    private readonly authService: AuthService,
    private readonly themeService: ThemeService,
    private readonly toastService: ToastService,
    private readonly router: Router
  ) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
    this.toastService.info('Sesión cerrada', 'Has salido del panel de administración.');
    this.router.navigate(['/login']);
  }

  get canManageUsers(): boolean {
    return this.authService.canManageUsers();
  }
}
