import { Component, OnInit } from '@angular/core';
import { equipament } from '../components/equipament';
import { EquipmentService } from '../../services/equipment.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html'
})
export class EquipmentComponent implements OnInit {
  equipaments: equipament[] = [];
  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.cargarEquipament();
  }

  private cargarEquipament() {
    this.equipmentService.getEquipment().subscribe(
      {
        next: value => {
          this.equipaments = value.data
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
