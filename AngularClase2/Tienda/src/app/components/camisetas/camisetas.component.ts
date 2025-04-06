import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, map } from 'rxjs';
import { Root2 } from 'src/app/common/ropa';
import { AuthService } from 'src/app/services/auth.service';
import { RopahombreService } from 'src/app/services/ropahombre.service';

@Component({
  selector: 'app-camisetas',
  templateUrl: './camisetas.component.html',
  styleUrls: ['./camisetas.component.css']
})
export class CamisetasComponent implements OnInit {
  articulos: Root2[] = [];
  pageSize: number = 8;
  currentPage: number = 1;
  totalPages: number = 0;
  filteredArticulos: Root2[] = [];
  paginatedArticulos: Root2[] = [];
  favoritos: Root2[] = [];
  highestRatedArticuloId: string | null = null;
  category: string = '';

  constructor(
    private route: ActivatedRoute,
    private ropahombreService: RopahombreService,
    private authService: AuthService,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.category = this.route.snapshot.data['category'];
    this.loadRopa();
    this.loadFavoritos();
  }

  private loadRopa(): void {
    this.ropahombreService.getAll().subscribe({
      next: value => {
        this.articulos = value;
        const ratingObservables = this.articulos.map(articulo =>
          this.ropahombreService.getCalificacionPromedio(articulo._id).pipe(
            map(rating => ({
              ...articulo,
              rating,
              isHot: rating >= 4 && rating <= 5 // Definir qué rating se considera "Hot"
            }))
          )
        );

        combineLatest(ratingObservables).subscribe(articulosConRating => {
          this.articulos = articulosConRating;
          this.setHighestRatedArticulo();
          // Filtrar solo artículos de la categoría seleccionada
          this.filteredArticulos = this.articulos.filter(
            articulo => articulo.category === this.category
          );
          this.updateFavoriteStatus();
          this.updatePaginatedArticulos();
        });
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        console.log('done');
      }
    });
  }

  private setHighestRatedArticulo(): void {
    if (this.articulos.length > 0) {
      const highestRatedArticulo = this.articulos
        .filter(articulo => articulo.rating > 0) // Filtrar artículos con rating mayor que 0
        .reduce((prev, current) =>
          prev.rating > current.rating ? prev : current,
          { rating: 0 } as Root2
        );
      this.highestRatedArticuloId =
        highestRatedArticulo.rating > 0 ? highestRatedArticulo._id : null;
    }
  }

  filterArticulos(event: any): void {
    const searchTerm = event.target.value.toLowerCase().trim();

    // Filtrar artículos por el término de búsqueda y la categoría seleccionada
    this.filteredArticulos = this.articulos
      .filter(articulo => articulo.category === this.category)
      .filter(articulo => articulo.name.toLowerCase().includes(searchTerm));
    this.currentPage = 1; // Reiniciar a la primera página después de aplicar un filtro
    this.updatePaginatedArticulos();
  }

  toggleFavorite(articulo: Root2): void {
    articulo.favorite = !articulo.favorite;
    if (articulo.favorite) {
      this.ropahombreService.addRopaToFavoritos(articulo);
    } else {
      this.ropahombreService.removeRopaFromFavoritos(articulo);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedArticulos();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedArticulos();
    }
  }

  private updatePaginatedArticulos(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedArticulos = this.filteredArticulos.slice(
      startIndex,
      startIndex + this.pageSize
    );
    this.totalPages = Math.ceil(
      this.filteredArticulos.length / this.pageSize
    );
  }

  addToPedido(articulo: Root2) {
    this.ropahombreService.addRopaToCarritoUsuario(articulo);
  }

  private loadFavoritos(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.afs
          .collection<Root2>(`users/${userId}/favorito`)
          .valueChanges()
          .subscribe(favoritos => {
            this.favoritos = favoritos;
            this.updateFavoriteStatus();
          });
      }
    });
  }

  private updateFavoriteStatus(): void {
    this.articulos.forEach(articulo => {
      articulo.favorite = this.favoritos.some(fav => fav._id === articulo._id);
    });
    this.updatePaginatedArticulos();
  }

  confirmarFavorito(articulo: Root2) {
    if (articulo.favorite) {
      if (confirm('¿Seguro que quieres eliminar este artículo de Favorito?')) {
        this.eliminarDelFavorito(articulo);
      }
    }
  }
  truncateName(name: string): string {
    return name.length > 19 ? name.substring(0,19 ) + '...' : name;
  }
  isAdrianLoggedIn(): boolean {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    return currentUserEmail === 'adrian@gmail.com';
  }
  eliminarArticulo(id: string): void {
    if (confirm('¿Seguro que quieres eliminar este artículo?')) {
      this.ropahombreService.deleteRopahombre(id).subscribe({
        next: response => {
          console.log(response);
          // Recargar los datos después de la eliminación
          this.loadRopa();
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }
  eliminarDelFavorito(articulo: Root2) {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.afs
          .collection(`users/${userId}/favorito`, ref =>
            ref.where('_id', '==', articulo._id)
          )
          .get()
          .subscribe(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.delete();
            });
          });
      }
    });
  }
}
