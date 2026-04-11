import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { User } from '../common/user';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: Partial<User> = {};

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.authService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  get displayName(): string {
    const fullName = `${this.user.firstName ?? ''} ${this.user.lastName ?? ''}`.trim();
    return fullName || this.user.username || 'Invitado';
  }

  get completionPercent(): number {
    const fields = [
      this.user.username,
      this.user.firstName,
      this.user.lastName,
      this.user.email,
      this.user.role
    ].filter(Boolean).length;

    return Math.round((fields / 5) * 100);
  }
}
