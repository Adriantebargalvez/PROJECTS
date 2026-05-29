import { Component, OnInit } from '@angular/core';
import { materials } from '../components/materials';
import { MaterialsService } from '../../services/materials.service';


@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html'
})
export class MaterialsComponent implements OnInit {
  materials: materials[] = [];

  constructor(private materialsService: MaterialsService) {}

  ngOnInit(): void {
    this.cargarMaterials();
  }

  private cargarMaterials() {
    this.materialsService.getMaterials().subscribe(
      {
        next: value => {
          this.materials = value.data
        },
        error: err => {
          console.log(err);
        },
        complete: () => {
          console.log("Complete")
        }
      }
    )
  }
}
