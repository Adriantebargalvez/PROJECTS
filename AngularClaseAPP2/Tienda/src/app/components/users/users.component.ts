import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  registerUser: any ={
    email:'',
    password:''
   
  }
  loginUser: any ={
    email:'',
    password:''
  }
  //mensaje cuando se registra 
   registrationMessage: string = '';
   
 // Definir variables para los elementos del DOM
 private x: any;
 private y: any;
 private z: any;

 constructor(private authService: AuthService, private router: Router) {}
 login(loginUser:any){
  this.authService.login(loginUser.email, loginUser.password)
  .then(() => {
    // Redirigir al usuario a la página de inicio
    this.router.navigate(['/inicio']);
  })
  .catch(() => {
    // Manejar error en caso de inicio de sesión fallido
  });
 }
 register(registerUser:any){
  this.authService.register(registerUser.email, registerUser.password)
      .then(() => {
        // Registro exitoso, establecer el mensaje de confirmación
        this.registrationMessage = `Te has registrado con el correo ${registerUser.email}`;
      })
      .catch(() => {
        // Manejar error en caso de registro fallido
      });
  }

 // Método que se ejecuta cuando se inicia el componente
 ngOnInit() {

   // Inicializar las variables con los elementos del DOM
   this.x = document.getElementById("login");
   this.y = document.getElementById("register");
   this.z = document.getElementById("elegir");
 }

 // Función para mostrar el formulario de inicio de sesión
 onLoginClick() {
   this.x.style.left = "130px";
   this.y.style.left = "550px";
   this.z.style.left = "0px";
 }

 // Función para mostrar el formulario de registro
 onRegisterClick() {
   this.x.style.left = "-500px";
   this.y.style.left = "130px";
   this.z.style.left = "120px"; // Ajuste para que el botón toggle permanezca en la posición correcta
 }

}


