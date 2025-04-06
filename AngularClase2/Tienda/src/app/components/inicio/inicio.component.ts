import { Component, OnInit } from '@angular/core';
import { Root2 } from 'src/app/common/ropa';
import { AuthService } from 'src/app/services/auth.service';
import { RopahombreService } from 'src/app/services/ropahombre.service';




@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit  {
  novedades: Root2[] = [];
  sliders = [1, 2, 3, 4, 5, 6, 7];
  slides = [
    { id: 1, src: '../../../assets/img/hombre.png' },
    { id: 2, src: '../../../assets/img/mujer.png' },
    { id: 3, src: '../../../assets/img/hombre.png' },
    { id: 4, src: '../../../assets/img/mujer.png' },
   
  ];


  constructor(private ropahombreService: RopahombreService,private authService: AuthService){ }

  
  ngOnInit(): void {
    // Llama al servicio para obtener todos los productos
    this.ropahombreService.getAll().subscribe(data => {
      // Filtra los productos por la categoría "Men's Shoe"
      this.novedades = data.filter(producto => producto.category === "Men's Shoe");
    });
  }

  addToPedido(articulo: Root2) {
    this.ropahombreService.addRopaToCarritoUsuario(articulo);
  }
}