import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class WriteAccessGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.canManageUsers()) {
      return true;
    }

    this.toastService.error(
      'Permiso insuficiente',
      'Tu rol solo permite consultar usuarios, no modificar datos.'
    );
    return this.router.createUrlTree(['/usuario', 'list']);
  }
}
