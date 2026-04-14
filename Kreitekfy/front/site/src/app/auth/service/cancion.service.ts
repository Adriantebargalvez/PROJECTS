import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, expand, of, reduce, throwError } from 'rxjs';
import { Cancion } from 'src/app/common/cancion';
import { PageResponse } from 'src/app/common/page-response';
import { environment } from 'src/environments/environment';
import { AUDIO_CATALOG_SEED } from '../../audio/audio-catalog.data';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CancionService {
  private readonly baseUrl = `${environment.apiUrl}/api/canciones`;
  private readonly demoCatalogStorageKey = 'demo_catalogo';
  private readonly artworkUrl = 'assets/img/apps.10546.13571498826857201.6603a5e2-631f-4f29-9b08-f96589723808-removebg-preview.png';
  private demoCatalog: Cancion[] = this.restoreDemoCatalog();

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUltimasCanciones(): Observable<Cancion[]> {
    if (this.isDemoMode()) {
      return of(this.getDemoCatalogSnapshot().sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 5));
    }

    return this.http.get<Cancion[]>(`${this.baseUrl}/ultimas-canciones`, { headers: this.getAuthHeaders() });
  }

  getCancionById(id: number): Observable<Cancion> {
    if (this.isDemoMode()) {
      const song = this.demoCatalog.find(item => item.id === id);
      return song
        ? of({ ...song })
        : throwError(() => new Error(`No existe la cancion demo con id ${id}`));
    }

    return this.http.get<Cancion>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getUltimasCancionesPorEstilo(estilo: string): Observable<Cancion[]> {
    if (this.isDemoMode()) {
      return of(
        this.getDemoCatalogSnapshot()
          .filter(cancion => cancion.estilo === estilo)
          .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
          .slice(0, 5)
      );
    }

    return this.http.get<Cancion[]>(`${this.baseUrl}/ultimas-canciones-por-estilo/${estilo}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAll(page: number, size: number, sort: string, filters?: string): Observable<PageResponse<Cancion>> {
    if (this.isDemoMode()) {
      return of(this.getDemoPage(page, size, sort, filters));
    }

    let url = `${this.baseUrl}/page?page=${page}&size=${size}&sort=${sort}`;
    if (filters) {
      url += `&filter=${encodeURIComponent(filters)}`;
    }

    return this.http.get<PageResponse<Cancion>>(url, { headers: this.getAuthHeaders() });
  }

  getCatalogoCompleto(sort = 'titulo,asc', pageSize = 200): Observable<Cancion[]> {
    if (this.isDemoMode()) {
      return of(this.sortSongs(this.getDemoCatalogSnapshot(), sort).slice(0, Math.max(pageSize, this.demoCatalog.length)));
    }

    const fetchPage = (page: number) => this.getAll(page, pageSize, sort);

    return fetchPage(0).pipe(
      expand(response => response.last ? EMPTY : fetchPage(response.number + 1)),
      reduce((allSongs, response) => [...allSongs, ...response.content], [] as Cancion[])
    );
  }

  reproducirCancion(id: number): Observable<void> {
    if (this.isDemoMode()) {
      this.updateDemoCatalog(catalog => catalog.map(cancion => (
        cancion.id === id
          ? { ...cancion, reproducciones: cancion.reproducciones + 1 }
          : cancion
      )));
      return of(void 0);
    }

    return this.http.post<void>(`${this.baseUrl}/${id}/reproducir`, {}, { headers: this.getAuthHeaders() });
  }

  getMasEscuchadas(): Observable<Cancion[]> {
    if (this.isDemoMode()) {
      return of(this.getDemoCatalogSnapshot().sort((a, b) => b.reproducciones - a.reproducciones).slice(0, 5));
    }

    return this.http.get<Cancion[]>(`${this.baseUrl}/mas-escuchadas`, { headers: this.getAuthHeaders() });
  }

  getMasEscuchadasPorEstilo(estilo: string): Observable<Cancion[]> {
    if (this.isDemoMode()) {
      return of(
        this.getDemoCatalogSnapshot()
          .filter(cancion => cancion.estilo === estilo)
          .sort((a, b) => b.reproducciones - a.reproducciones)
          .slice(0, 5)
      );
    }

    return this.http.get<Cancion[]>(`${this.baseUrl}/mas-escuchadas-por-estilo/${estilo}`, {
      headers: this.getAuthHeaders()
    });
  }

  getParaTi(): Observable<Cancion[]> {
    if (this.isDemoMode()) {
      return of(
        this.getDemoCatalogSnapshot()
          .sort((a, b) => {
            if (b.puntuacion !== a.puntuacion) {
              return b.puntuacion - a.puntuacion;
            }

            return b.reproducciones - a.reproducciones;
          })
          .slice(0, 5)
      );
    }

    return this.http.get<Cancion[]>(`${this.baseUrl}/para-ti`, { headers: this.getAuthHeaders() });
  }

  valorarCancion(id: number, puntuacion: number): Observable<void> {
    if (this.isDemoMode()) {
      this.updateDemoCatalog(catalog => catalog.map(cancion => (
        cancion.id === id
          ? { ...cancion, puntuacion }
          : cancion
      )));
      return of(void 0);
    }

    return this.http.post<void>(`${this.baseUrl}/${id}/puntuar?puntuacion=${puntuacion}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  private isDemoMode(): boolean {
    return this.authService.isDemoSession();
  }

  private buildDemoCatalog(): Cancion[] {
    const estilos = ['Ambient', 'Lo-fi', 'Electronica', 'Cinematica', 'Chill'];
    const albums = ['Soft Motion', 'Paper Rooms', 'Solar Sessions', 'Mountain Archive', 'Late Echoes'];
    const duraciones = ['03:12', '02:54', '03:28', '04:01', '03:35'];
    const reproducciones = [128, 96, 174, 141, 117];
    const puntuaciones = [4, 3, 4, 4, 3];

    return AUDIO_CATALOG_SEED.map((track, index) => ({
      id: track.id,
      titulo: track.titulo,
      artista: track.artista,
      estilo: estilos[index % estilos.length],
      imagen: this.artworkUrl,
      album: albums[index % albums.length],
      duracion: duraciones[index % duraciones.length],
      reproducciones: reproducciones[index % reproducciones.length],
      puntuacion: puntuaciones[index % puntuaciones.length],
      previewUrl: track.audioUrl
    }));
  }

  private restoreDemoCatalog(): Cancion[] {
    const persistedCatalog = localStorage.getItem(this.demoCatalogStorageKey);
    if (!persistedCatalog) {
      return this.buildDemoCatalog();
    }

    try {
      const parsedCatalog = JSON.parse(persistedCatalog) as Cancion[];
      return parsedCatalog.length ? parsedCatalog : this.buildDemoCatalog();
    } catch {
      localStorage.removeItem(this.demoCatalogStorageKey);
      return this.buildDemoCatalog();
    }
  }

  private persistDemoCatalog(): void {
    localStorage.setItem(this.demoCatalogStorageKey, JSON.stringify(this.demoCatalog));
  }

  private updateDemoCatalog(updater: (catalog: Cancion[]) => Cancion[]): void {
    this.demoCatalog = updater(this.demoCatalog.map(cancion => ({ ...cancion })));
    this.persistDemoCatalog();
  }

  private getDemoCatalogSnapshot(): Cancion[] {
    return this.demoCatalog.map(cancion => ({ ...cancion }));
  }

  private getDemoPage(page: number, size: number, sort: string, filters?: string): PageResponse<Cancion> {
    const pageSize = Math.max(size || 0, 1);
    const filteredSongs = this.filterSongs(this.getDemoCatalogSnapshot(), filters);
    const sortedSongs = this.sortSongs(filteredSongs, sort);
    const totalElements = sortedSongs.length;
    const totalPages = totalElements ? Math.ceil(totalElements / pageSize) : 0;
    const start = page * pageSize;
    const content = sortedSongs.slice(start, start + pageSize);

    return {
      content,
      first: page === 0,
      last: totalPages === 0 ? true : page >= totalPages - 1,
      totalPages,
      totalElements,
      number: page,
      size: pageSize
    };
  }

  private filterSongs(canciones: Cancion[], filters?: string): Cancion[] {
    if (!filters?.trim()) {
      return canciones;
    }

    const predicates = filters.split(',').map(filter => {
      const [field, operator, ...rawValue] = filter.split(':');
      return {
        field,
        operator,
        value: rawValue.join(':')
      };
    });

    return canciones.filter(cancion => predicates.every(predicate => {
      if (predicate.operator !== 'MATCH') {
        return true;
      }

      const fieldValue = this.getSongFieldValue(cancion, predicate.field);
      return this.normalizeValue(fieldValue).includes(this.normalizeValue(predicate.value));
    }));
  }

  private sortSongs(canciones: Cancion[], sort: string): Cancion[] {
    const [field = 'titulo', direction = 'asc'] = sort.split(',');
    const multiplier = direction.toLowerCase() === 'desc' ? -1 : 1;

    return [...canciones].sort((firstSong, secondSong) => {
      const firstValue = this.getSongFieldValue(firstSong, field);
      const secondValue = this.getSongFieldValue(secondSong, field);

      if (typeof firstValue === 'number' && typeof secondValue === 'number') {
        return (firstValue - secondValue) * multiplier;
      }

      return `${firstValue}`.localeCompare(`${secondValue}`) * multiplier;
    });
  }

  private getSongFieldValue(cancion: Cancion, field: string): string | number {
    switch (field) {
      case 'artista':
        return cancion.artista;
      case 'album':
        return cancion.album;
      case 'estilo':
        return cancion.estilo;
      case 'reproducciones':
        return cancion.reproducciones;
      case 'puntuacion':
        return cancion.puntuacion;
      case 'id':
        return cancion.id ?? 0;
      case 'titulo':
      default:
        return cancion.titulo;
    }
  }

  private normalizeValue(value: string | number): string {
    return `${value}`
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private getAuthHeaders(): HttpHeaders {
    if (this.authService.isDemoSession()) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken() ?? ''}`
    });
  }
}
