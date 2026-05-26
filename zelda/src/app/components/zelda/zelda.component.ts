import {Component, OnInit} from '@angular/core';
import {ZeldaService} from "../../services/zelda.service";
import {zelda} from "../components/zelda";

@Component({
  selector: 'app-zelda',
  templateUrl: './zelda.component.html',
  styleUrls: ['./zelda.component.css']
})
export class ZeldaComponent implements OnInit{
  zelda: zelda[]=[];
  constructor(private  ZeldaService : ZeldaService) {

  }
  ngOnInit(): void {
    this.cargarZelda();
  }
  private  cargarZelda() {
    this.ZeldaService.getzelda().subscribe(
      {
        next: value => {
          this.zelda= value.data
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
