import { Component, OnInit } from '@angular/core';
import { treasure } from '../components/treasure';
import { TreasureService } from '../../services/treasure.service';

@Component({
  selector: 'app-treasure',
  templateUrl: './treasure.component.html'
})
export class TreasureComponent implements OnInit {
  treasure: treasure[] = [];
  constructor(private treasureService: TreasureService) {}

  ngOnInit(): void {
    this.cargarTreasure();
  }

  private cargarTreasure() {
    this.treasureService.getTreasure().subscribe(
      {
        next: value => {
          this.treasure = value.data
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
