import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit{
  userData: any;
  users: any[] = [];
  currentUser: any;
  constructor(private authService: AuthService, private router: Router, private firestore: AngularFirestore){}
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;// Asignar los datos de los usuarios a la propiedad users
    });
  }

  
  logout() {
    this.authService.logout()
      .then(() => console.log('Sesión cerrada exitosamente'))
      .catch(error => console.error('Error al cerrar sesión:', error));
  }
}


