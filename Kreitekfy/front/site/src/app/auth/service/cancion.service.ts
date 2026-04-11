import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Cancion } from 'src/app/common/cancion';
import { PageResponse } from 'src/app/common/page-response';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CancionService {
  private readonly baseUrl = 'http://localhost:8080/api/canciones';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllCanciones(): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

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

  reproducirCancion(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/reproducir`, {}, { headers: this.getAuthHeaders() }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
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

  valorarCancion(id: number, puntuacion: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/puntuar?puntuacion=${puntuacion}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken() ?? ''}`
    });
  }
}
