import {Component, OnInit} from '@angular/core';
import {materials} from "../components/materials";
import {MaterialsService} from "../../services/materials.service";


@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {
  materials: materials[] = [];

  constructor(private MaterialsService: MaterialsService) {

  }

  ngOnInit(): void {
    this.cargarMaterials();
  }

  private cargarMaterials() {
    this.MaterialsService.gematerials().subscribe(
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
