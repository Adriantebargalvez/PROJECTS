import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Introduce tu usuario y contraseña para continuar.';
      return;
    }

    this.isSubmitting = true;
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.errorMessage = '';
        this.authService.saveSession(response.token, {
          username: this.credentials.username
        });
        this.router.navigate(['/hello']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Login failed', error);
        this.errorMessage = 'Error en la autenticación. Revisa tus credenciales e inténtalo de nuevo.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/hello']);
  }
}
