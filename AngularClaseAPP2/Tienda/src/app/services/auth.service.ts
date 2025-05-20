
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore , AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '../common/user';
import { Observable, map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
userData:any;
  getUserID: any;
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth,private router: Router,private firestore: AngularFirestore) { this.afAuth.authState.subscribe(user=>{
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  })}
  getCurrentUserEmail(): string {
    return this.userData ? this.userData.email : '';
  }
  getCurrentUser(): Observable<any> {
    return this.afAuth.authState;
  }
setUserData(user:any){
  
const userRef: AngularFirestoreDocument<any> = this.afs.doc(
  `user/${user.uid}`
);
const userData: User = {
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
  comentarios: user.comentarios,
  clasificaciones: user.calificaciones
};
return userRef.set(userData,{
  merge:true
})

}

login(email: string, password: string) {
  return this.afAuth.signInWithEmailAndPassword(email, password)
    .then(result => {
      this.setUserData(result.user);
      this.router.navigate(['/inicio']); // Redirigir a la página de inicio después de iniciar sesión
    }).catch(() => { })
}
register(email: string, password: string) {
  return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(result => {
      const name = email.split('@')[0]; // Extraer el nombre antes del símbolo "@" del correo electrónico
      result.user?.updateProfile({ displayName: name }); // Actualizar el nombre de usuario en Firebase
      result.user?.sendEmailVerification();
      this.setUserData(result.user);
    }).catch(() => {})
}
isUserAuthenticatedInFirebase(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        resolve(true); // Usuario autenticado en Firebase
      } else {
        resolve(false); // Usuario no autenticado en Firebase
      }
    }, error => {
      reject(error);
    });
  });
}

logout(): Promise<void> {
  return this.afAuth.signOut()
    .then(() => {
      // Limpiar datos de usuario almacenados localmente
      localStorage.removeItem('user');
      // Redirigir al usuario a la página de inicio
      this.router.navigate(['/']);
    })
    .catch(error => {
      console.error('Error al cerrar sesión en Firebase:', error);
    });
}
guardarComentario(articuloId: string, comentario: string) {
  const comentarioData = {
    userId: this.userData.uid, // ID del usuario que escribió el comentario
    displayName: this.userData.displayName, // Nombre del usuario que escribió el comentario
    comentario: comentario,
    fecha: new Date().toISOString()
  };

  // Guardar el comentario en la colección de comentarios del artículo en Firebase
  return this.afs.collection(`articulos/${articuloId}/comentarios`).add(comentarioData);
}

// Método para obtener los comentarios de un artículo específico desde Firebase
obtenerComentarios(articuloId: string): Observable<any[]> {
  return this.afs.collection(`articulos/${articuloId}/comentarios`).valueChanges();
}
// Función para guardar la calificación de un artículo por parte de un usuario
guardarCalificacion(articuloId: string, rating: number) {
  return this.afs.collection(`articulos/${articuloId}/calificaciones`).add({
    userId: this.userData.uid,
    rating: rating,
    
  });
}

obtenerCalificaciones(articuloId: string): Observable<any[]> {
  return this.afs.collection(`articulos/${articuloId}/calificaciones`).valueChanges();
}

obtenerTodasCalificaciones(): Observable<any[]> {
  return this.afs.collectionGroup('calificaciones').valueChanges();
}
calcularMediaCalificaciones(articuloId: string): Observable<number> {
  return this.obtenerCalificaciones(articuloId).pipe(
    map(calificaciones => {
      if (calificaciones.length > 0) {
        const sum = calificaciones.reduce((total, current) => total + current.rating, 0);
        return sum / calificaciones.length;
      } else {
        return 0;
      }
    })
  );
}
}
