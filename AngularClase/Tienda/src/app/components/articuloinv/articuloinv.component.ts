import { Component, OnInit } from '@angular/core';
import { RopahombreService } from 'src/app/services/ropahombre.service';
import { ActivatedRoute, ActivationEnd } from '@angular/router';
import { Root2 } from 'src/app/common/ropa';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/common/user';

@Component({
  selector: 'app-articuloinv',
  templateUrl: './articuloinv.component.html',
  styleUrls: ['./articuloinv.component.css']
})
export class ArticuloinvComponent implements OnInit {
  articulo!: Root2;
  currentUser: User | null = null;
  newComment: string = ''; 
  mediaClasificaciones: number = 0;
  comentarios: { displayName: string, comentario: string, fecha: string }[] = [];

  constructor(private ropahombreService: RopahombreService, private ar: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadropa();
   
  }

  private loadropa() {
    const id = this.ar.snapshot.params['id'];

    this.ropahombreService.getOne(id).subscribe({
      next: value => {
        this.articulo = value;
        this.cargarcomentario();
        this.calcularPromedioCalificaciones();
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        console.log("Complete");
      }
    });
  }
  addToPedido(articulo: Root2) {
    this.ropahombreService.addRopaToCarritoUsuario(articulo);
  }
  cargarcomentario() {
    this.authService.obtenerComentarios(this.articulo._id).subscribe(comments => {
      // Mapear los comentarios para mostrar el nombre del usuario en lugar del userId
      this.comentarios = comments.map(comment => {
        // Obtener la fecha como un objeto Date
        const commentDate = new Date(comment.fecha);
        // Obtener la hora y los minutos
        const hours = commentDate.getHours();
        const minutes = commentDate.getMinutes();
        // Formatear la hora y los minutos
        const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        
        return {
          displayName: comment.displayName,
          comentario: comment.comentario,
          fecha: formattedTime // Usar la hora y los minutos formateados
        };
      }).sort((a, b) => {
        // Ordenar los comentarios por hora descendente
        const timeA = a.fecha.split(':').map(Number);
        const timeB = b.fecha.split(':').map(Number);
        return (timeB[0] * 60 + timeB[1]) - (timeA[0] * 60 + timeA[1]);
      });
    });
  }
  // Método para agregar un nuevo comentario
  agregarComentario() {
    if (this.newComment.trim() !== '') {
      this.authService.guardarComentario(this.articulo._id, this.newComment).then(() => {
        // Después de guardar el comentario, volver a cargar los comentarios
        this.cargarcomentario();
        // Limpiar el campo de comentario después de agregarlo
        this.newComment = '';
      }).catch(error => {
        console.error('Error al guardar el comentario:', error);
      });
    }
  }
  

  calificarProducto(rating: number) {
    this.articulo.rating = rating;

    this.authService.guardarCalificacion(this.articulo._id, rating).then(() => {
      this.calcularPromedioCalificaciones();
    }).catch(error => {
      console.error('Error al guardar la calificación:', error);
    });
  }

  calcularPromedioCalificaciones() {
    this.authService.obtenerTodasCalificaciones().subscribe(ratings => {
      if (ratings.length > 0) {
        const sum = ratings.reduce((total, current) => total + current.rating, 0);
        this.mediaClasificaciones = Math.floor(sum / ratings.length); // Redondear hacia abajo
      } else {
        this.mediaClasificaciones = 0;
      }
    });
  }
}