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
import { CreateComponent } from './components/create/create.component';
import { RopamujerComponent } from './components/ropamujer/ropamujer.component';
import { FiltroybottonesComponent } from './components/filtroybottones/filtroybottones.component';
import { CamisetasComponent } from './components/camisetas/camisetas.component';




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
  path:'ropamujer',
  component: RopamujerComponent
},
{
  path:'filtroybottones',
  component: FiltroybottonesComponent
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
  path:'create',
  component: CreateComponent
},
{
  path:'nosotros',
  component: NosotrosComponent
},

  { path: 'camisetas', component: CamisetasComponent, data: { category: 'Camiseta Hombre' } },
  { path: 'vestidos-mujer', component: CamisetasComponent, data: { category: 'Vestido Mujer' } },
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
