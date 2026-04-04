import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from '../common/usuario';

type SortField = 'nombre' | 'email' | 'rol';
type SortDirection = 'asc' | 'desc';

interface UsersDashboardStats {
  totalUsers: number;
  adminUsers: number;
  hrUsers: number;
  readerUsers: number;
}

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  usuario: Usuario[] = [];
  allUsuarios: Usuario[] = [];
  userIdDelete?: number;

  page = 0;
  size = 5;
  sortField: SortField = 'nombre';
  sortDirection: SortDirection = 'asc';

  first = false;
  last = false;
  totalPages = 0;
  totalElements = 0;
  isLoading = false;

  searchText = '';
  nombreFilter = '';
  apellidosFilter = '';
  emailFilter = '';
  rolFilter = '';

  availableRoles: string[] = [];
  dashboardStats: UsersDashboardStats = {
    totalUsers: 0,
    adminUsers: 0,
    hrUsers: 0,
    readerUsers: 0
  };

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) {}

  get canManageUsers(): boolean {
    return this.authService.canManageUsers();
  }

  ngOnInit(): void {
    this.refreshUsers();
  }

  nextPage(): void {
    this.page += 1;
    this.getLista();
  }

  previusPage(): void {
    this.page -= 1;
    this.getLista();
  }

  searchByFliters(): void {
    this.page = 0;
    this.getLista();
  }

  clearFilters(): void {
    this.searchText = '';
    this.nombreFilter = '';
    this.apellidosFilter = '';
    this.emailFilter = '';
    this.rolFilter = '';
    this.page = 0;
    this.getLista();
  }

  changeSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.getLista();
  }

  getSortIcon(field: SortField): string {
    if (this.sortField !== field) {
      return 'bi-arrow-down-up';
    }

    return this.sortDirection === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up';
  }

  getInitials(usuarios: Usuario): string {
    return `${usuarios.nombre?.charAt(0) ?? ''}${usuarios.apellidos?.charAt(0) ?? ''}`.toUpperCase();
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

  prepareUserDelete(usuarioid: number): void {
    this.userIdDelete = usuarioid;
  }

  deleteUser(): void {
    if (this.userIdDelete === undefined) {
      return;
    }

    this.usuariosService.deleteUser(this.userIdDelete).subscribe({
      next: () => {
        if (this.usuario.length === 1 && this.page > 0) {
          this.page -= 1;
        }

        this.toastService.success('Usuario eliminado', 'El registro se ha eliminado correctamente.');
        this.userIdDelete = undefined;
        this.refreshUsers();
      },
      error: () => {
        this.toastService.error('Error al eliminar', 'No se ha podido borrar el usuario seleccionado.');
      }
    });
  }

  private refreshUsers(): void {
    this.loadDashboardData();
    this.getLista();
  }

  private buildFilters(): string | undefined {
    const filters: string[] = [];

    if (this.nombreFilter.trim()) {
      filters.push('nombre:MATCH:' + this.nombreFilter.trim());
    }

    if (this.apellidosFilter.trim()) {
      filters.push('apellidos:MATCH:' + this.apellidosFilter.trim());
    }

    if (this.emailFilter.trim()) {
      filters.push('email:MATCH:' + this.emailFilter.trim());
    }

    if (this.rolFilter.trim()) {
      filters.push('rol:MATCH:' + this.rolFilter.trim());
    }

    return filters.length > 0 ? filters.join(',') : undefined;
  }

  private getLista(): void {
    this.isLoading = true;
    const filters = this.buildFilters();
    const sort = `${this.sortField},${this.sortDirection}`;

    this.usuariosService.getAll(
      this.page,
      this.size,
      sort,
      filters,
      this.searchText
    ).subscribe({
      next: (data) => {
        this.usuario = data.content;
        this.first = data.first;
        this.last = data.last;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private loadDashboardData(): void {
    this.usuariosService.getAllUsuarios().subscribe({
      next: (usuarios) => {
        this.allUsuarios = usuarios;
        this.availableRoles = [...new Set(usuarios.map((item) => item.rol).filter(Boolean))].sort();
        this.dashboardStats = {
          totalUsers: usuarios.length,
          adminUsers: usuarios.filter((item) => item.rol?.toUpperCase() === 'ADMIN').length,
          hrUsers: usuarios.filter((item) => item.rol?.toUpperCase() === 'RRHH').length,
          readerUsers: usuarios.filter((item) => item.rol?.toUpperCase() === 'LECTOR').length
        };
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private handleError(error: any): void {
    this.isLoading = false;
    console.error(error);
    this.toastService.error('Error de carga', 'No se han podido cargar los usuarios.');
  }
}
