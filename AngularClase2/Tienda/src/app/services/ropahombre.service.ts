import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, map } from 'rxjs';
import { Root2 } from '../common/ropa';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class RopahombreService {
private URI ='http://10.0.2.2:3000/api/ropahombre/'
favoritos: BehaviorSubject<Root2[]> = new BehaviorSubject<Root2[]>([]);
carrito: BehaviorSubject<Root2[]> = new BehaviorSubject<Root2[]>([]);
preciocarrito: BehaviorSubject<number>=new BehaviorSubject<number>(0);
 // obtenerCalificaciones: any;

  constructor(private http: HttpClient, private authService: AuthService,private afs: AngularFirestore, private router: Router) { 
    
  }
  updateRopahombre(id: string, root2: Root2): Observable<Root2> {
    return this.http.patch<Root2>(`${this.URI}update/${id}`, root2);
  }
  addRopahombre(root2: Root2): Observable<Root2> {
    return this.http.post<Root2>(this.URI + 'insertar', root2);
  }
  deleteRopahombre(id: string): Observable<any> {
    return this.http.delete<any>(`${this.URI}delete/${id}`);
  }
  
  getCalificacionPromedio(articuloId: string): Observable<number> {
    return this.afs.collection(`articulos/${articuloId}/calificaciones`).valueChanges().pipe(
      map((calificaciones: any[]) => {
        const sum = calificaciones.reduce((total, current) => total + current.rating, 0);
        return calificaciones.length > 0 ? sum / calificaciones.length : 0;
      })
    );
  }

  scrollToNovedades() {
    // Busca el elemento con la clase 'titulo' que contiene la palabra 'NOVEDADES'
    const novedadesElement = document.querySelector('.titulo') as HTMLElement;
    // Si se encuentra el elemento, realiza el desplazamiento
    if (novedadesElement) {
      novedadesElement.scrollIntoView({ behavior: 'smooth' });
    }
  
  }
  scrollToCategory() {
    // Busca el elemento con la clase 'titulo' que contiene la palabra 'Shop by Gategory'
    const categoryElement = document.querySelector('.titulo-category') as HTMLElement;
    // Si se encuentra el elemento, realiza el desplazamiento
    if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: 'smooth' });
    }
}

addRopaToCarrito(root2:Root2){
  const miCarrito = this.carrito.value
  miCarrito.push(root2);
  this.carrito.next(miCarrito);
  this.preciocarrito.next(this.preciocarrito.value+root2.price);
  localStorage.setItem('favoritos', JSON.stringify(miCarrito));
}
addRopaToCarritoUsuario(articulo: Root2) {
  this.authService.getCurrentUser().subscribe(user => {
    if (user) {
      const userId = user.uid;
      this.afs.collection(`users/${userId}/pedidos`).add(articulo);
    }
  });
}
addRopaToPedidoUsuario(userId: string, producto: Root2) {
  // Agrega el producto al pedido del usuario actual
  this.afs.collection(`users/${userId}/pedidos`).add(producto);
}

addRopaToFavoritos(articulo: Root2) {
  this.authService.getCurrentUser().subscribe(user => {
    if (user) {
      const userId = user.uid;
      this.afs.collection(`users/${userId}/favorito`).add(articulo);
    }
  });
}

  removeRopaFromFavoritos(articulo: Root2): void {
    const favoritos = this.favoritos.value;
    const index = favoritos.findIndex(item => item._id === articulo._id);
    if (index !== -1) {
      favoritos.splice(index, 1);
      this.favoritos.next(favoritos);
    }
  }
    getAll(): Observable<Root2[]> {
 return this.http.get<Root2[]>(this.URI);
   }
   getOne(id: string): Observable<Root2> {
    
    return this.http.get<Root2>(this.URI+id);
  }
  
 
}
      

