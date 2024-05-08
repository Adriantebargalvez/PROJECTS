import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserFormComponent } from './components/user-form/user-form.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'usuario/list',
    pathMatch:'full'
  },
  {
    path:'usuario/list',
    component: UsuarioListComponent
  },
  {
    path:'usuario/new',
    component: UserFormComponent
  },
  {
    path:'usuario/:userId',
    component: UserFormComponent
  },

  {
    path:'navbar',
    component: NavbarComponent
  },
  {
    path:'footer',
    component: FooterComponent
  },

  {
    path:'**',
    redirectTo:'rrhhFront',
    pathMatch:'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
