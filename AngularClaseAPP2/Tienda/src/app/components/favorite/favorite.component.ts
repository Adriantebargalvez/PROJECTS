import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { Root2 } from 'src/app/common/ropa';
import { Observable } from 'rxjs';
import { RopahombreService } from 'src/app/services/ropahombre.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  favoritosFirebase: Observable<Root2[]> | undefined;
  isAuthenticated: boolean = false;

  constructor(private afs: AngularFirestore, private authService: AuthService,private ropahombreService: RopahombreService) {}

  ngOnInit(): void {
    this.authService.isUserAuthenticatedInFirebase().then(authenticated => {
      this.isAuthenticated = authenticated;
      if (authenticated) {
        this.cargarFavoritos();
      }
    });
  }

  cargarFavoritos() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.favoritosFirebase = this.afs.collection<Root2>(`users/${userId}/favorito`).valueChanges();
      }
    });
  }
  
  confirmarFavorito(articulo: Root2) {
    if (confirm('¿Seguro que quieres eliminar este artículo de Favorito?')) {
      this.eliminarDelFavorito(articulo);
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
}
