import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/service/auth.service';
import { CancionService } from 'src/app/auth/service/cancion.service';
import { Cancion } from 'src/app/common/cancion';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent implements OnInit {
  message = '';
  canciones: Cancion[] = [];
  page: number = 0;
  size: number = 4;
  sort: string = "";
  first: boolean = false;
  last: boolean = false;
  totalPages: number = 0;
  totalElements: number = 0;

  nombreFilter?: string;
  artistaFilter?: string;
  albumFilter?: string;
  estiloFilter?: string;
  constructor(private http: HttpClient, private authService: AuthService, private cancionService: CancionService) { }

  ngOnInit(): void {
    const token = this.authService.getToken();
    this.http.get<any>('http://localhost:8080/api/v1/hello', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        this.message = response.message;
        this.getLista();
      },
      error: (error) => {
        console.error('Error fetching hello message', error);
      }
    });
    this.getLista();
  }
  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }
  public nextPage(): void {
    if (!this.last) {
      this.page++;
      this.getLista();
    }
  }

  public previusPage(): void {
    if (!this.first) {
      this.page--;
      this.getLista();
    }
  }

  public searchByFilters(): void {
    this.page = 0; 
    this.getLista();
  }

  private getLista(): void {
    const filters: string | undefined = this.buildFilters();
    this.cancionService.getAll(this.page, this.size, this.sort, filters).subscribe({
      next: (data: any) => {
        this.canciones = data.content;
        this.first = data.first;
        this.last = data.last;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
      },
      error: (err) => { this.handleError(err); }
    });
  }

  private buildFilters(): string | undefined {
    const filters: string[] = [];
    if (this.nombreFilter) {
      filters.push("titulo:MATCH:" + this.nombreFilter);
    }
    if (this.artistaFilter) {
      filters.push("artista:MATCH:" + this.artistaFilter);
    }
    if (this.albumFilter) {
      filters.push("album:MATCH:" + this.albumFilter);
    }
    if (this.estiloFilter) {
      filters.push("estilo:MATCH:" + this.estiloFilter);
    }
    
    if (filters.length > 0) {
      return filters.join(",");
    } else {
      return undefined;
    }
  }

  private handleError(error: any): void {
    console.log(error);
  }
}
