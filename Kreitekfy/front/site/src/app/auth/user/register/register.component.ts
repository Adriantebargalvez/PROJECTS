import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: any = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'USER'
  };

  constructor(private authService: AuthService,
    private router: Router) { }

    register(): void {
      if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.role || !this.user.password || !this.user.username) {
        console.error('First name and last name are required.');
        return;
      }
    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }
}
