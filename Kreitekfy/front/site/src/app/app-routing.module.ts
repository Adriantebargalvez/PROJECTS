import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/user/login/login.component';
import { RegisterComponent } from './auth/user/register/register.component';
import { HelloComponent } from './features/hello/hello.component';
import { NovedadesComponent } from './novedades/novedades.component';
import { PageInvComponent } from './page-inv/page-inv.component';
import { PerfilComponent } from './perfil/perfil.component';


const routes: Routes = [
  { path: '', redirectTo: '/hello', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'hello', component: HelloComponent },
  { path: 'novedades', component: NovedadesComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'cancion/:id', component: PageInvComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
