import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Root2 } from 'src/app/common/ropa';
import { RopahombreService } from 'src/app/services/ropahombre.service';
import { FormValidators } from 'src/app/validators/FormValidators';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent  {
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
    imagenLado: ['', [Validators.required]],
    imagenDetras: ['', [Validators.required]],
    descripcion: ['',[Validators.required, FormValidators.notsex]],
    rating: [0],
    
  });
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private arou: ActivatedRoute,
    private ropahombreService: RopahombreService
  ) {     this.loadSport();}

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

  update() {
    if (this.formSport.invalid) {
      this.formSport.markAllAsTouched();
      return;
    }
    this.ropahombreService.addRopahombre(this.formSport.getRawValue()).subscribe({
      next: value => {
        alert(value.name + ' Insertado');
        this.router.navigateByUrl('sportList');
      },
      error: err => {
        console.error(err);
      }
    });
  }
  

}
