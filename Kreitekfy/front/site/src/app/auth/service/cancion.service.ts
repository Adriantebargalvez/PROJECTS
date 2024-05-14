import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Cancion } from 'src/app/common/cancion';
import { AuthService } from './auth.service';
import { Puntuacion } from 'src/app/common/puntuacion';



@Injectable({
  providedIn: 'root'
})
export class CancionService {

  private baseUrl = 'http://localhost:8080/api/canciones'; // URL base de tu API

  constructor(private http: HttpClient, private authService: AuthService) { }

   // Método para obtener todas las canciones
   getAllCanciones(): Observable<Cancion[]> {
    // Añade el token de autenticación a la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<Cancion[]>(this.baseUrl, { headers });
  }

  getUltimasCanciones(): Observable<Cancion[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<Cancion[]>(`${this.baseUrl}/ultimas-canciones`, { headers });
  }

  getCancionById(id: number): Observable<Cancion> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<Cancion>(`${this.baseUrl}/${id}`, { headers });
  }
  getUltimasCancionesPorEstilo(estilo: string): Observable<Cancion[]> {
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<Cancion[]>(`${this.baseUrl}/ultimas-canciones-por-estilo/${estilo}`, { headers });
}
getAll(page: number, size: number, sort: string, filters?: string): Observable<any> {
  let url = `${this.baseUrl}/page?page=${page}&size=${size}&sort=${sort}`;
  if (filters) {
    url += `&filter=${filters}`;
  }
  return this.http.get(url, {
    headers: {
      'Authorization': `Bearer ${this.authService.getToken()}`
    }
  });
}
reproducirCancion(id: number): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`
  });

  return this.http.post(`${this.baseUrl}/${id}/reproducir`, {}, { headers })
    .pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
}
getMasEscuchadas(): Observable<Cancion[]> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`
  });

  return this.http.get<Cancion[]>(`${this.baseUrl}/mas-escuchadas`, { headers });
}

getMasEscuchadasPorEstilo(estilo: string): Observable<Cancion[]> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`,
  });
  return this.http.get<Cancion[]>(`${this.baseUrl}/mas-escuchadas-por-estilo/${estilo}`, { headers });
}
getParaTi(): Observable<Cancion[]> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`
  });

  return this.http.get<Cancion[]>(`${this.baseUrl}/para-ti`, { headers });
}
valorarCancion(id: number, puntuacion: number): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`
  });

  return this.http.post(`${this.baseUrl}/${id}/puntuar?puntuacion=${puntuacion}`, {}, { headers });
}
 
}








