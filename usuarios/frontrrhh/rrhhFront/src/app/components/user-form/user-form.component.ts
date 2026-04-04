import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from 'src/app/models/auth.models';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from '../common/usuario';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  mode: 'NEW' | 'UPDATE' = 'NEW';
  userId?: number;
  usuario?: Usuario;
  isSaving = false;
  isLoading = true;

  readonly roleOptions: UserRole[] = ['ADMIN', 'RRHH', 'LECTOR'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly usuariosService: UsuariosService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    const entryParam = this.route.snapshot.paramMap.get('userId') ?? 'new';

    if (entryParam !== 'new') {
      this.userId = Number(this.route.snapshot.paramMap.get('userId'));
      this.mode = 'UPDATE';
      this.getUserById(this.userId);
      return;
    }

    this.mode = 'NEW';
    this.initializerItem();
    this.isLoading = false;
  }

  saveUser(): void {
    if (!this.usuario || this.isSaving) {
      return;
    }

    this.isSaving = true;

    if (this.mode === 'NEW') {
      this.insertUser();
      return;
    }

    this.updateUser();
  }

  private getUserById(userId: number): void {
    this.usuariosService.getUserById(userId).subscribe({
      next: (userRequest) => {
        this.usuario = userRequest;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private handleError(err: any): void {
    this.isSaving = false;
    this.isLoading = false;
    console.error('Error guardando usuario', err);

    if (err?.status === 409) {
      this.toastService.error(
        'Empleado duplicado',
        'Ya existe un usuario con ese email. Cambia el correo antes de guardar.'
      );
      return;
    }

    this.toastService.error(
      'No se ha podido guardar',
      'Revisa los datos y que el backend esté arrancado.'
    );
  }

  private initializerItem(): void {
    this.usuario = new Usuario(undefined, '', '', '', '');
  }

  private updateUser(): void {
    this.usuariosService.update(this.usuario!).subscribe({
      next: (userUpdate) => {
        this.isSaving = false;
        this.toastService.success('Usuario actualizado', 'Los cambios se han guardado correctamente.');
        this.router.navigate(['/usuario', 'detail', userUpdate.id]);
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private insertUser(): void {
    this.usuario!.id = undefined;

    this.usuariosService.insert(this.usuario!).subscribe({
      next: (userInserted) => {
        this.isSaving = false;
        this.toastService.success('Usuario creado', 'El nuevo usuario se ha registrado correctamente.');
        this.router.navigate(['/usuario', 'detail', userInserted.id]);
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }
}
