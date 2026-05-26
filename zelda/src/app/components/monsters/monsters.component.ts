import {Component, OnInit} from '@angular/core';
import {monster} from "../components/mosters";
import {MonstersService} from "../../services/monsters.service";

@Component({
  selector: 'app-monsters',
  templateUrl: './monsters.component.html',
  styleUrls: ['./monsters.component.css']
})
export class MonstersComponent implements OnInit{

 monsters: monster[]=[];
  constructor(private  MonstersService : MonstersService) {

  }

  ngOnInit(): void {
    this.cargarMonsters();
  }
  private  cargarMonsters() {
    this.MonstersService.getmonsters().subscribe(
      {
        next: value => {
          this.monsters= value.data
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


