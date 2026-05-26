import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ZeldaComponent } from './components/zelda/zelda.component';
import { CreaturesComponent } from './components/creatures/creatures.component';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { MonstersComponent } from './components/monsters/monsters.component';
import { TreasureComponent } from './components/treasure/treasure.component';
import { InicioComponent } from './components/inicio/inicio.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ZeldaComponent,
    CreaturesComponent,
    EquipmentComponent,
    MaterialsComponent,
    MonstersComponent,
    TreasureComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
