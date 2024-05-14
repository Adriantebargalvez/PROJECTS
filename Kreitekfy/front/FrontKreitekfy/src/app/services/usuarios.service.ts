import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../components/common/usuario';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
 
 
  private baseUrl = 'http://localhost:8080/rrhh/usuario'; 

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
  getAll(page: number, size: number,sort: string, filters?: string): Observable<Usuario[]> {
    let urlEndPoint: string = "http://localhost:8080/rrhh/usuario/page?page="+page+"&size="+size + "&sort="+ sort;
    if (filters){
      urlEndPoint= urlEndPoint + "&filter=" + filters;
    }
    return this.http.get<Usuario[]>(urlEndPoint);
  }
}

