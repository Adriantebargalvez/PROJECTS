import {Component, OnInit} from '@angular/core';
import {equipament} from "../components/equipament";
import {EquipmentService} from "../../services/equipment.service";

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit{
  equipaments: equipament[]=[];
  constructor(private  EquipamentService : EquipmentService) {

  }

  ngOnInit(): void {
    this.cargarEquipament();
  }

  private  cargarEquipament() {
    this.EquipamentService.getcreatures().subscribe(
      {
        next: value => {
          this.equipaments= value.data
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
