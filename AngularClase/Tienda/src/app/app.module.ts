import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InicioComponent } from './components/inicio/inicio.component';
import { RopahombreComponent } from './components/ropahombre/ropahombre.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ArticuloinvComponent } from './components/articuloinv/articuloinv.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { BuyComponent } from './components/buy/buy.component';
import { UsersComponent } from './components/users/users.component';
import { enviroment } from 'src/enviroment/enviroment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { PerfilComponent } from './components/perfil/perfil.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FavoriteComponent } from './components/favorite/favorite.component';







@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    RopahombreComponent,
    NavbarComponent,
    FooterComponent,
    ArticuloinvComponent,
    NosotrosComponent,
    PedidoComponent,
    BuyComponent,
    UsersComponent,
    PerfilComponent,
    FavoriteComponent,
  
   
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    AngularFireModule.initializeApp(enviroment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    BrowserAnimationsModule 
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }