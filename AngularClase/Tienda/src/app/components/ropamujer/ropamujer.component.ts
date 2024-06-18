import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, map } from 'rxjs';
import { Root2 } from 'src/app/common/ropa';
import { AuthService } from 'src/app/services/auth.service';
import { RopahombreService } from 'src/app/services/ropahombre.service';

@Component({
  selector: 'app-ropamujer',
  templateUrl: './ropamujer.component.html',
  styleUrls: ['./ropamujer.component.css']
})
export class RopamujerComponent implements OnInit{

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
  favoritos: Root2[] = [];
  highestRatedArticuloId: string | null = null;

  constructor(private ropahombreService: RopahombreService, private authService: AuthService,private afs: AngularFirestore){}

  ngOnInit(): void {
    this.loadRopa();
    this.loadFavoritos();
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
  isAdrianLoggedIn(): boolean {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    return currentUserEmail === 'adrian@gmail.com';
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
              isHot: rating >= 4 && rating <= 5  // Definir qué rating se considera "Hot"
            }))
          )
        );
  
        combineLatest(ratingObservables).subscribe(articulosConRating => {
          this.articulos = articulosConRating;
          this.setHighestRatedArticulo();
          this.filteredArticulosHombre = this.articulos.filter(articulo => articulo.category === 'Ropa Hombre');
          this.filteredArticulosMujer = this.articulos.filter(articulo => articulo.category === 'Ropa Mujer');
          this.updateFavoriteStatus();
          this.updatePaginatedArticulosHombre();
          this.updatePaginatedArticulosMujer();
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
        .filter(articulo => articulo.rating > 0)  // Filtrar artículos con rating mayor que 0
        .reduce((prev, current) => (prev.rating > current.rating) ? prev : current, { rating: 0 } as Root2);
      this.highestRatedArticuloId = highestRatedArticulo.rating > 0 ? highestRatedArticulo._id : null;
    }
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
  addToPedido(articulo: Root2) {
    this.ropahombreService.addRopaToCarritoUsuario(articulo);
  }

  private loadFavoritos(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.afs.collection<Root2>(`users/${userId}/favorito`).valueChanges().subscribe(favoritos => {
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
    this.updatePaginatedArticulosHombre();
  }
    confirmarFavorito(articulo: Root2) {
      if (articulo.favorite) {
        if (confirm('¿Seguro que quieres eliminar este artículo de Favorito?')) {
          this.eliminarDelFavorito(articulo);
        }
      } else {
  
}
    }

  eliminarDelFavorito(articulo: Root2) {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const userId = user.uid;
        // Obtén el ID del pedido que corresponde al artículo
        this.afs.collection(`users/${userId}/favorito`, ref => ref.where('_id', '==', articulo._id))
          .get()
          .subscribe(querySnapshot => {
            querySnapshot.forEach(doc => {
              // Elimina el artículo del pedido
              doc.ref.delete();
            });
          });
      }
    });
  }
  truncateName(name: string): string {
    return name.length > 19 ? name.substring(0,19 ) + '...' : name;
  }
}
