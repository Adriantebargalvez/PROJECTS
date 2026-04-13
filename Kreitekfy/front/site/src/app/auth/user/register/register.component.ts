import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from '../../service/auth.models';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'USER'
  };
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  register(): void {
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.role || !this.user.password || !this.user.username) {
      this.errorMessage = 'Completa todos los datos para crear tu cuenta.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    this.authService.register(this.user).subscribe({
      next: (response: AuthResponse) => {
        this.isSubmitting = false;
        this.authService.saveSession(response.token, response.user ?? { ...this.user });
        this.router.navigate(['/hello']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Register failed', error);
        this.errorMessage = 'No hemos podido crear la cuenta. Revisa la informacion e intentalo de nuevo.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/hello']);
  }
}
