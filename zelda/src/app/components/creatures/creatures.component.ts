import { Component, OnInit } from '@angular/core';
import { creatures } from '../components/creatures';
import { CreaturesService } from '../../services/creatures.service';

@Component({
  selector: 'app-creatures',
  templateUrl: './creatures.component.html'
})
export class CreaturesComponent implements OnInit {
  creatures: creatures[] = [];
  constructor(private creaturesService: CreaturesService) {}

  ngOnInit(): void {
    this.cargarCreatures();
  }

  private cargarCreatures() {
    this.creaturesService.getCreatures().subscribe(
      {
        next: value => {
          this.creatures = value.data
        },
        error:err => {
          console.log(err);
        },
        complete: () => {
          console.log("Complete")
        }
      }
    )
  }
}
