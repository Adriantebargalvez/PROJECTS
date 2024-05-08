import { Component, OnInit } from '@angular/core';
import { RopahombreService } from 'src/app/services/ropahombre.service';
import { Root2 } from 'src/app/common/ropa';

@Component({
  selector: 'app-ropahombre',
  templateUrl: './ropahombre.component.html',
  styleUrls: ['./ropahombre.component.css']
})
export class RopahombreComponent implements OnInit {
 
  articulos: Root2[] = [];
  pageSize: number = 8;
  currentPageHombre: number = 1;
  currentPageMujer: number = 1;
  totalPagesHombre: number = 0;
  totalPagesMujer: number = 0;
  filteredArticulosHombre: Root2[] = [];
  filteredArticulosMujer: Root2[] = [];
  paginatedArticulosHombre: Root2[] = [];
  paginatedArticulosMujer: Root2[] = [];

  constructor(private ropahombreService: RopahombreService){}

  ngOnInit(): void {
    this.loadRopa();
  }

  private loadRopa(): void {
    this.ropahombreService.getAll().subscribe({
      next: value =>{
        this.articulos = value;
        this.filteredArticulosHombre = this.articulos.filter(articulo => articulo.category === 'Ropa Hombre');
        this.filteredArticulosMujer = this.articulos.filter(articulo => articulo.category === 'Ropa Mujer');
        this.updatePaginatedArticulosHombre();
        this.updatePaginatedArticulosMujer();
      },
      error: err =>{
        console.error(err);
      },
      complete: () => {
        console.log('done');
      }
    });
  }

  filterArticulos(event: any): void {
    const searchTerm = event.target.value.toLowerCase().trim();

    // Filtrar artículos de hombre
    this.filteredArticulosHombre = this.articulos
      .filter(articulo => articulo.category === 'Ropa Hombre')
      .filter(articulo =>
        articulo.name.toLowerCase().includes(searchTerm)
      );
    this.currentPageHombre = 1; // Reiniciar a la primera página después de aplicar un filtro
    this.updatePaginatedArticulosHombre();

    // Filtrar artículos de mujer
    this.filteredArticulosMujer = this.articulos
      .filter(articulo => articulo.category === 'Ropa Mujer')
      .filter(articulo =>
        articulo.name.toLowerCase().includes(searchTerm)
      );
    this.currentPageMujer = 1; // Reiniciar a la primera página después de aplicar un filtro
    this.updatePaginatedArticulosMujer();
  }

  toggleFavorite(articulo: Root2): void {
    articulo.favorite = !articulo.favorite;
    if (articulo.favorite) {
      this.ropahombreService.addRopaToFavoritos(articulo);
    } else {
      this.ropahombreService.removeRopaFromFavoritos(articulo);
    }
  }

  previousPageHombre(): void {
    if (this.currentPageHombre > 1) {
      this.currentPageHombre--;
      this.updatePaginatedArticulosHombre();
    }
  }

  nextPageHombre(): void {
    if (this.currentPageHombre < this.totalPagesHombre) {
      this.currentPageHombre++;
      this.updatePaginatedArticulosHombre();
    }
  }

  previousPageMujer(): void {
    if (this.currentPageMujer > 1) {
      this.currentPageMujer--;
      this.updatePaginatedArticulosMujer();
    }
  }

  nextPageMujer(): void {
    if (this.currentPageMujer < this.totalPagesMujer) {
      this.currentPageMujer++;
      this.updatePaginatedArticulosMujer();
    }
  }

  private updatePaginatedArticulosHombre(): void {
    const startIndex = (this.currentPageHombre - 1) * this.pageSize;
    this.paginatedArticulosHombre = this.filteredArticulosHombre.slice(startIndex, startIndex + this.pageSize);
    this.totalPagesHombre = Math.ceil(this.filteredArticulosHombre.length / this.pageSize);
  }

  private updatePaginatedArticulosMujer(): void {
    const startIndex = (this.currentPageMujer - 1) * this.pageSize;
    this.paginatedArticulosMujer = this.filteredArticulosMujer.slice(startIndex, startIndex + this.pageSize);
    this.totalPagesMujer = Math.ceil(this.filteredArticulosMujer.length / this.pageSize);
  }
}
