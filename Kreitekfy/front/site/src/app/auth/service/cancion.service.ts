import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, expand, reduce } from 'rxjs';
import { Cancion } from 'src/app/common/cancion';
import { PageResponse } from 'src/app/common/page-response';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CancionService {
  private readonly baseUrl = `${environment.apiUrl}/api/canciones`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUltimasCanciones(): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(`${this.baseUrl}/ultimas-canciones`, { headers: this.getAuthHeaders() });
  }

  getCancionById(id: number): Observable<Cancion> {
    return this.http.get<Cancion>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getUltimasCancionesPorEstilo(estilo: string): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(`${this.baseUrl}/ultimas-canciones-por-estilo/${estilo}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAll(page: number, size: number, sort: string, filters?: string): Observable<PageResponse<Cancion>> {
    let url = `${this.baseUrl}/page?page=${page}&size=${size}&sort=${sort}`;
    if (filters) {
      url += `&filter=${encodeURIComponent(filters)}`;
    }

    return this.http.get<PageResponse<Cancion>>(url, { headers: this.getAuthHeaders() });
  }

  getCatalogoCompleto(sort = 'titulo,asc', pageSize = 200): Observable<Cancion[]> {
    const fetchPage = (page: number) => this.getAll(page, pageSize, sort);

    return fetchPage(0).pipe(
      expand(response => response.last ? EMPTY : fetchPage(response.number + 1)),
      reduce((allSongs, response) => [...allSongs, ...response.content], [] as Cancion[])
    );
  }

  reproducirCancion(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/reproducir`, {}, { headers: this.getAuthHeaders() });
  }

  getMasEscuchadas(): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(`${this.baseUrl}/mas-escuchadas`, { headers: this.getAuthHeaders() });
  }

  getMasEscuchadasPorEstilo(estilo: string): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(`${this.baseUrl}/mas-escuchadas-por-estilo/${estilo}`, {
      headers: this.getAuthHeaders()
    });
  }

  getParaTi(): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(`${this.baseUrl}/para-ti`, { headers: this.getAuthHeaders() });
  }

  valorarCancion(id: number, puntuacion: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/puntuar?puntuacion=${puntuacion}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken() ?? ''}`
    });
  }
}
