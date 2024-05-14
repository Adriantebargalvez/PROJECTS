import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.authService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  updateUser(): void {
    this.authService.updateUser(this.user).subscribe(() => {
      alert('Perfil actualizado correctamente');
    });
  }
}