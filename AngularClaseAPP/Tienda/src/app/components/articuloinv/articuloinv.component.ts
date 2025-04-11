import { Component, OnInit } from '@angular/core';
import { RopahombreService } from 'src/app/services/ropahombre.service';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Root2 } from 'src/app/common/ropa';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/common/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidators } from 'src/app/validators/FormValidators';

@Component({
  selector: 'app-articuloinv',
  templateUrl: './articuloinv.component.html',
  styleUrls: ['./articuloinv.component.css']
})
export class ArticuloinvComponent implements OnInit {
  
  paginatedArticulosHombre: Root2[] = [];
  articulo!: Root2;
  currentUser: User | null = null;
  newComment: string = ''; 
  mediaClasificaciones: number = 0;
  mediaCalificaciones: number = 0;
  comentarios: { displayName: string, comentario: string, fecha: string }[] = [];

  allTallas = ['4XL', '2XL', 'XS', '2XS', '3XS', 'SM', 'XL', 'MD', '3XL'];
  allTallasZapato = ['36', '38', '40', '42', '44'];
  formSport: FormGroup  = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(5), FormValidators.notOnlyWhitespace]],
    price: ['0', [Validators.required, Validators.min(0)]],
    tallasDisponibles: [this.allTallas],
    tallasDisponiblesZapato: [this.allTallasZapato],
    favorite: [false],
    oferta: ['0', [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required, Validators.minLength(3), FormValidators.notOnlyWhitespace]],
    imagen: ['', [Validators.required]],
    imagenLado:['', [Validators.required]],
    imagenDetras:['', [Validators.required]],
    descripcion: ['',[Validators.required, FormValidators.notsex]],
    rating: [0]
  });

  constructor( private formBuilder: FormBuilder,private router: Router,
    private arou: ActivatedRoute,private ropahombreService: RopahombreService, private ar: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadropa();
    this.loadSport();
  }
  

  private loadropa() {
    const id = this.ar.snapshot.params['id'];

    this.ropahombreService.getOne(id).subscribe({
      next: value => {
        this.articulo = value;
        this.cargarcomentario();
        this.calcularPromedioCalificaciones();
        this.authService.calcularMediaCalificaciones(this.articulo._id).subscribe(media => {
          this.mediaCalificaciones = media;
        });
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        console.log("Complete");
      }
    });
  }
  isAdrianLoggedIn(): boolean {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    return currentUserEmail === 'adrian@gmail.com';
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
   // Método para eliminar una talla del array de tallas disponibles
 toggleTalla(talla: string, controlName: string) {
  const tallas = this.formSport.get(controlName)?.value as string[];
  const index = tallas.indexOf(talla);
  if (index !== -1) {
    // Si la talla ya está presente, quítala
    tallas.splice(index, 1);
  } else {
    // Si no está presente, agrégala
    tallas.push(talla);
  }
  this.formSport.get(controlName)?.setValue(tallas);
}

  // Métodos para acceder a los controles del formulario
  get name() {
    return this.formSport.get('name');
  }

  get price() {
    return this.formSport.get('price');
  }

  get tallasDisponibles() {
    return this.formSport.get('tallasDisponibles');
  }

  get tallasDisponiblesZapato() {
    return this.formSport.get('tallasDisponiblesZapato');
  }

  get oferta() {
    return this.formSport.get('oferta');
  }

  get category() {
    return this.formSport.get('category');
  }

  get imagen() {
    return this.formSport.get('imagen');
  }
  get imagenLado() {
    return this.formSport.get('imagenLado');
  }
  get imagenDetras() {
    return this.formSport.get('imagenDetras');
  }
  get descripcion() {
    return this.formSport.get('descripcion');
  }

  get rating() {
    return this.formSport.get('rating');
  }

  private loadSport() {
    const id = this.arou.snapshot.params['id'];
    this.ropahombreService.getOne(id).subscribe({
      next: value => {
        this.formSport.patchValue(value);
      },
      error: err => {
        console.error(err);
      }
    });
  }

  updateSport() {
    const ropaForm = this.formSport.value;
    if (this.articulo._id) {
      this.ropahombreService.updateRopahombre(this.articulo._id, ropaForm).subscribe({
        next: (response) => {
          console.log("Producto actualizado:", response);
          this.router.navigate(['/ropa-list']);
        },
        error: (err) => {
          console.error("Error al actualizar el producto:", err);
        }
      });
    } else {
      this.ropahombreService.addRopahombre(ropaForm).subscribe({
        next: (response) => {
          console.log("Producto agregado:", response);
          this.router.navigate(['/ropa-list']);
        },
        error: (err) => {
          console.error("Error al agregar el producto:", err);
        }
      });
    }
  }
}