import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CancionService } from '../auth/service/cancion.service';
import { Cancion } from '../common/cancion';
import { Puntuacion } from '../common/puntuacion';
 // Importa el servicio CancionService

@Component({
  selector: 'app-page-inv',
  templateUrl: './page-inv.component.html',
  styleUrls: ['./page-inv.component.css']
})
export class PageInvComponent implements OnInit {

  cancion: Cancion | undefined;
  user: any;
  puntuacion: Puntuacion | null = null;
 
  constructor(
    private route: ActivatedRoute,
    private cancionService: CancionService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cancionService.getCancionById(Number(id)).subscribe(
        (data: Cancion) => {
          this.cancion = data;
         
        },
        (error) => {
          console.error('Error al obtener los detalles de la canción:', error);
        }
      );
    }
  }
  reproducirCancion() {
    if (this.cancion && this.cancion.id) {
      this.cancionService.reproducirCancion(this.cancion.id).subscribe(
        () => {
          if (this.cancion) {
            this.cancion.reproducciones++;
          }
        },
        (error) => {
          console.error("Error al reproducir la canción:", error);
        }
      );
    }
  }
  valorarCancion(puntuacion: number) {
    if (this.cancion && this.cancion.id) {
      this.cancionService.valorarCancion(this.cancion.id, puntuacion).subscribe(
        () => {
          if (this.cancion) {
            this.cancion.puntuacion = puntuacion;
          }
        },
        (error) => {
          console.error("Error al valorar la canción:", error);
        }
      );
    }
  }
  
}


