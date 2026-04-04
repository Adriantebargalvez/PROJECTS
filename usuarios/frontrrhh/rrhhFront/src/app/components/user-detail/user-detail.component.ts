import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from '../common/usuario';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  usuario?: Usuario;
  isLoading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly usuariosService: UsuariosService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) {}

  get canManageUsers(): boolean {
    return this.authService.canManageUsers();
  }

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('userId'));

    this.usuariosService.getUserById(userId).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Usuario no encontrado', 'No se ha podido cargar el detalle del usuario.');
        this.router.navigate(['/usuario', 'list']);
      }
    });
  }

  getInitials(usuario: Usuario): string {
    return `${usuario.nombre?.charAt(0) ?? ''}${usuario.apellidos?.charAt(0) ?? ''}`.toUpperCase();
  }

  getRoleClass(role: string): string {
    const normalizedRole = role?.toUpperCase() ?? '';

    if (normalizedRole === 'ADMIN') {
      return 'role-badge--admin';
    }

    if (normalizedRole === 'RRHH') {
      return 'role-badge--hr';
    }

    return 'role-badge--reader';
  }
}
