// pedido.component.ts

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Root2 } from 'src/app/common/ropa';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  novedades: Root2[] = [];
  pedidosFirebase: Observable<Root2[]> | undefined;
  precioTotalFirebase: Observable<number> | undefined;
  isAuthenticated: boolean = false;
  allowNavigation: boolean = false; 
  constructor(private afs: AngularFirestore, private authService: AuthService,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.authService.isUserAuthenticatedInFirebase().then(authenticated => {
      this.isAuthenticated = authenticated;
      if (authenticated) {
        this.cargarPedidos();
      }
    });
  }

  cargarPedidos() {
    // Obtener el ID del usuario actual
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const userId = user.uid;
        // Obtener los pedidos del usuario actual desde Firebase
        this.pedidosFirebase = this.afs.collection<Root2>(`users/${userId}/pedidos`).valueChanges();
        // Calcular el precio total de los pedidos del usuario
        this.precioTotalFirebase = this.pedidosFirebase.pipe(
          map(pedidos => pedidos.reduce((total, articulo) => total + (articulo.oferta || articulo.price), 0))
        );
        this.pedidosFirebase.subscribe(pedidos => {
          this.allowNavigation = pedidos.length > 0;
        })
      }
    });
  }
  showNotification() {
    // Verificar si el array de pedidos está vacío
    this.pedidosFirebase?.subscribe(pedidos => {
      if (pedidos.length === 0) {
        this.snackBar.open('Debes añadir algún producto', 'Cerrar', {
          duration: 3000,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
        this.disableButton();
      }
    });
  }
  disableButton() {
    this.isAuthenticated = false;
}
  buyDisabled() {
     
    return !this.isAuthenticated;
    
  }
  
  
  confirmarEliminacion(articulo: Root2) {
    if (confirm('¿Seguro que quieres eliminar este artículo del pedido?')) {
      this.eliminarDelPedido(articulo);
    }
  }

  eliminarDelPedido(articulo: Root2) {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const userId = user.uid;
        // Obtén el ID del pedido que corresponde al artículo
        this.afs.collection(`users/${userId}/pedidos`, ref => ref.where('_id', '==', articulo._id))
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
