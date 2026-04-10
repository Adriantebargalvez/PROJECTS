import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../components/common/usuario';
import { environment } from 'src/environments/environment';

export interface PaginatedUsuariosResponse {
  content: Usuario[];
  first: boolean;
  last: boolean;
  totalPages: number;
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }
 public deleteUser(userIdDelete: number): Observable<any> {
  return this.http.delete<any>(this.baseUrl + "/" + userIdDelete);
  }
  public getUserById(userId: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.baseUrl+ "/"+ userId);
  }
  public insert(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl ,usuario);
  }
  public update(usuario: Usuario): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.baseUrl}/${usuario.id}`, usuario);
  }
  getAll(
    page: number,
    size: number,
    sort?: string,
    filters?: string,
    quickSearch?: string
  ): Observable<PaginatedUsuariosResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (sort) {
      params = params.set('sort', sort);
    }

    if (filters){
      params = params.set('filter', filters);
    }

    if (quickSearch?.trim()) {
      params = params.set('quickSearch', quickSearch.trim());
    }

    return this.http.get<PaginatedUsuariosResponse>(`${this.baseUrl}/page`, { params });
  }
}
