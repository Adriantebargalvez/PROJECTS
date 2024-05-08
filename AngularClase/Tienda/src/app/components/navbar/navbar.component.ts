import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RopahombreService } from 'src/app/services/ropahombre.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
 
  constructor(private authService: AuthService, private router: Router, private ropahombreService: RopahombreService){

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
}


