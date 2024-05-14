import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: any = {};
  errorMessage: string = '';

  constructor(private authService: AuthService,
              private router: Router
  ) { }

  login(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.errorMessage = '';
        this.authService.saveToken(response.token);
        this.authService.updateUsername(this.credentials.username);
        this.router.navigate(['/hello']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Error en la autenticación. Por favor, revisa tus credenciales e intenta de nuevo.';
      }
    });
  }
  cancel(): void {
    this.router.navigate(['/hello']);
  }
}
