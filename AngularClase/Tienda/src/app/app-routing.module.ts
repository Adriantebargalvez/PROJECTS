import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { RopahombreComponent } from './components/ropahombre/ropahombre.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

import { ArticuloinvComponent } from './components/articuloinv/articuloinv.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { BuyComponent } from './components/buy/buy.component';
import { UsersComponent } from './components/users/users.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { FavoriteComponent } from './components/favorite/favorite.component';




const routes: Routes = [
{
  path:'',
  redirectTo:'/inicio',
  pathMatch:'full'
},
{
  path:'inicio',
  component: InicioComponent
},
{
  path:'articuloinv/:id',
  component: ArticuloinvComponent
},
{
  path:'ropahombre',
  component: RopahombreComponent
},
{
  path:'pedido',
  component: PedidoComponent
},
{
  path:'navbar',
  component: NavbarComponent
},
{
  path:'buy',
  component: BuyComponent
},
{
  path:'users',
  component: UsersComponent
},
{
  path:'favorite',
  component: FavoriteComponent
},
{
  path:'perfil',
  component: PerfilComponent
},
{
  path:'footer',
  component: FooterComponent
},
{
  path:'nosotros',
  component: NosotrosComponent
},
{
  path:'**',
  redirectTo:'Tienda',
  pathMatch:'full'
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
