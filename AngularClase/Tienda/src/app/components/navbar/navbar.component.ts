import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RopahombreService } from 'src/app/services/ropahombre.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  AlertPedidos: boolean = false; 
  AlertFavoritos: boolean = false; 

  constructor(private authService: AuthService, private router: Router, private ropahombreService: RopahombreService,private afs: AngularFirestore ){

  }
  ngOnInit(): void {
   
  }

 
  
  isAdrianLoggedIn(): boolean {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    return currentUserEmail === 'adrian@gmail.com';
  }
  goToFavorite() {
    // Verificar si el usuario está autenticado
    this.authService.isUserAuthenticatedInFirebase().then(authenticated => {
      if (authenticated) {
        // Si está autenticado, dirigir al usuario a la página de pedidos
        this.router.navigate(['/favorite']);
      } else {
        // Si no está autenticado, dirigir al usuario a la página de inicio de sesión
        this.router.navigate(['/users']);
        this.AlertFavoritos = true;
      }
    }).catch(error => {
      console.error("Error al verificar la autenticación del usuario en Firebase:", error);
    });
  }

  goToPedido() {
    // Verificar si el usuario está autenticado
    this.authService.isUserAuthenticatedInFirebase().then(authenticated => {
      if (authenticated) {
        // Si está autenticado, dirigir al usuario a la página de pedidos
        this.router.navigate(['/pedido']);
      } else {
        // Si no está autenticado, dirigir al usuario a la página de inicio de sesión
        this.router.navigate(['/users']);
        this.AlertPedidos = true;
      }
    }).catch(error => {
      console.error("Error al verificar la autenticación del usuario en Firebase:", error);
    });
  }
 
  goToUsersOrProfile() {
    this.authService.isUserAuthenticatedInFirebase().then(authenticated => {
      if (authenticated) {
        this.navigateToProfile(); // Si está autenticado, redirige al perfil
      } else {
        this.navigateToLogin(); // Si no está autenticado, redirige a la página de inicio de sesión
      }
    }).catch(error => {
      console.error("Error al verificar la autenticación del usuario en Firebase:", error);
    });
  }

  // Función para redirigir al perfil
  private navigateToProfile() {
    this.router.navigate(['/perfil']);
  }

  // Función para redirigir a la página de inicio de sesión
  private navigateToLogin() {
    this.router.navigate(['/users']);
  }
  scrollToNovedades() {
    // Primero navega a la página de inicio
    this.ropahombreService.scrollToNovedades();
  }
  scrollToCategory() {
    // Primero navega a la página de inicio
    this.ropahombreService.scrollToCategory();
  }
  closePedidos() {
    this.AlertPedidos = false;
  }
  closeFavoritos() {
    this.AlertFavoritos = false;
  }
 
}


