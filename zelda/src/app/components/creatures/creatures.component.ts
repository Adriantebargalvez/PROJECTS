import {Component, OnInit} from '@angular/core';
import {creatures} from "../components/creatures";
import {CreaturesService} from "../../services/creatures.service";

@Component({
  selector: 'app-creatures',
  templateUrl: './creatures.component.html',
  styleUrls: ['./creatures.component.css']
})
export class CreaturesComponent implements OnInit{
creatures: creatures[]=[];
  constructor(private  CreaturesService : CreaturesService) {

  }

  ngOnInit(): void {
    this.cargarCreatures();
  }
private  cargarCreatures(){
    this.CreaturesService.getcreatures().subscribe(
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
