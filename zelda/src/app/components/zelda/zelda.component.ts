import { Component, OnInit } from '@angular/core';
import { ZeldaService } from '../../services/zelda.service';
import { zelda } from '../components/zelda';

@Component({
  selector: 'app-zelda',
  templateUrl: './zelda.component.html'
})
export class ZeldaComponent implements OnInit {
  zelda: zelda[] = [];

  constructor(private zeldaService: ZeldaService) {}

  ngOnInit(): void {
    this.cargarZelda();
  }

  private cargarZelda() {
    this.zeldaService.getZelda().subscribe(
      {
        next: value => {
          this.zelda = value.data
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
