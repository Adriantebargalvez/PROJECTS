import {Component, OnInit} from '@angular/core';
import {treasure} from "../components/treasure";
import {TreasureService} from "../../services/treasure.service";

@Component({
  selector: 'app-treasure',
  templateUrl: './treasure.component.html',
  styleUrls: ['./treasure.component.css']
})
export class TreasureComponent implements OnInit{
  treasure: treasure[]=[];
  constructor(private  TreasureService : TreasureService) {

  }
  ngOnInit(): void {
    this.cargarTreasure();
  }
  private  cargarTreasure() {
    this.TreasureService.gettreasure().subscribe(
      {
        next: value => {
          this.treasure= value.data
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
