import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CancionService } from 'src/app/auth/service/cancion.service';
import { Cancion } from 'src/app/common/cancion';
import { PageResponse } from 'src/app/common/page-response';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit {
  readonly pageSize = 8;
  readonly sort = 'titulo,asc';

  message = 'Todo listo para seguir escuchando.';
  canciones: Cancion[] = [];
  page = 0;
  first = true;
  last = false;
  totalPages = 0;
  totalElements = 0;
  isLoading = false;

  nombreFilter = '';
  artistaFilter = '';
  albumFilter = '';
  estiloFilter = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cancionService: CancionService
  ) { }

  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      return;
    }

    this.loadWelcomeMessage();
    this.getLista();
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  get activeFiltersCount(): number {
    return [this.nombreFilter, this.artistaFilter, this.albumFilter, this.estiloFilter]
      .filter(value => value.trim().length > 0)
      .length;
  }

  get currentPage(): number {
    return this.page + 1;
  }

  get pageProgress(): number {
    if (!this.totalPages) {
      return 0;
    }

    return Math.round((this.currentPage / this.totalPages) * 100);
  }

  get hasSongs(): boolean {
    return this.canciones.length > 0;
  }

  get featuredSong(): Cancion | undefined {
    return this.canciones[0];
  }

  get highlightedSongs(): Cancion[] {
    return this.canciones.slice(0, 3);
  }

  get featuredGenres(): string[] {
    return [...new Set(this.canciones.map(cancion => cancion.estilo).filter(Boolean))].slice(0, 5);
  }

  trackBySongId(_: number, cancion: Cancion): number | string {
    return cancion.id ?? cancion.titulo;
  }

  nextPage(): void {
    if (!this.last) {
      this.page++;
      this.getLista();
    }
  }

  previusPage(): void {
    if (!this.first) {
      this.page--;
      this.getLista();
    }
  }

  searchByFilters(): void {
    this.page = 0;
    this.getLista();
  }

  clearFilters(): void {
    this.nombreFilter = '';
    this.artistaFilter = '';
    this.albumFilter = '';
    this.estiloFilter = '';
    this.page = 0;
    this.getLista();
  }

  private loadWelcomeMessage(): void {
    const token = this.authService.getToken();

    this.http.get<{ message?: string }>('http://localhost:8080/api/v1/hello', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        this.message = response.message || this.message;
      },
      error: (error) => {
        console.error('Error fetching hello message', error);
      }
    });
  }

  private getLista(): void {
    if (!this.isAuthenticated()) {
      return;
    }

    this.isLoading = true;

    const filters = this.buildFilters();
    this.cancionService.getAll(this.page, this.pageSize, this.sort, filters).subscribe({
      next: (data: PageResponse<Cancion>) => {
        this.canciones = data.content;
        this.first = data.first;
        this.last = data.last;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    });
  }

  private buildFilters(): string | undefined {
    const filters: string[] = [];

    if (this.nombreFilter) {
      filters.push(`titulo:MATCH:${this.nombreFilter}`);
    }
    if (this.artistaFilter) {
      filters.push(`artista:MATCH:${this.artistaFilter}`);
    }
    if (this.albumFilter) {
      filters.push(`album:MATCH:${this.albumFilter}`);
    }
    if (this.estiloFilter) {
      filters.push(`estilo:MATCH:${this.estiloFilter}`);
    }

    return filters.length ? filters.join(',') : undefined;
  }

  private handleError(error: unknown): void {
    console.error(error);
  }
}
