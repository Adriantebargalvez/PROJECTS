import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthAccount } from 'src/app/models/auth.models';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = 'admin@empresa.com';
  password = 'Admin123!';
  isSubmitting = false;

  readonly demoAccounts: AuthAccount[] = this.authService.demoUsers;

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  login(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const isValidLogin = this.authService.login(this.email, this.password);

    window.setTimeout(() => {
      this.isSubmitting = false;

      if (!isValidLogin) {
        this.toastService.error(
          'Credenciales incorrectas',
          'Revisa el email y la contraseña o usa una cuenta demo.'
        );
        return;
      }

      this.toastService.success('Bienvenido', 'Sesión iniciada correctamente.');
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/usuario/list';
      this.router.navigateByUrl(returnUrl);
    }, 550);
  }

  fillDemoAccount(account: AuthAccount): void {
    this.email = account.email;
    this.password = account.password;
  }
}
