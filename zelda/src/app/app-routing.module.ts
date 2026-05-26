import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ZeldaComponent} from "./components/zelda/zelda.component";
import {CreaturesComponent} from "./components/creatures/creatures.component";
import {EquipmentComponent} from "./components/equipment/equipment.component";
import {MaterialsComponent} from "./components/materials/materials.component";
import {MonstersComponent} from "./components/monsters/monsters.component";
import {TreasureComponent} from "./components/treasure/treasure.component";
import {InicioComponent} from "./components/inicio/inicio.component";



const routes: Routes = [
  {
    path:'',
    pathMatch: 'full',
    redirectTo: 'inicio'
  },
  {
    path:'inicio',
    component:InicioComponent
  },
  {
    path:'zelda',
    component:ZeldaComponent
  },
  {
    path:'creatures',
    component:CreaturesComponent

  },
  {
    path:'equipment',
    component:EquipmentComponent
  },
  {
    path:'materials',
    component:MaterialsComponent
  },
  {
    path:'monsters',
    component:MonstersComponent
  },
  {
    path:'treasure',
    component:TreasureComponent
  },
  {
    path:'**',
    redirectTo:'inicio'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
