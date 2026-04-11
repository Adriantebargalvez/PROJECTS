import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
      this.errorMessage = 'Completa todos los campos para crear la cuenta.';
      return;
    }

    this.isSubmitting = true;
    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.errorMessage = '';
        this.authService.saveSession(response.token, {
          username: this.user.username,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          role: this.user.role
        });
        this.router.navigate(['/hello']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('There was an error!', error);
        this.errorMessage = 'No se pudo completar el registro. Revisa los datos e inténtalo de nuevo.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/hello']);
  }
}
