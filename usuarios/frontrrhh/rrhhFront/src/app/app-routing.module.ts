import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { WriteAccessGuard } from './guards/write-access.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'LoginPage' }
  },
  {
    path:'',
    redirectTo:'usuario/list',
    pathMatch:'full'
  },
  {
    path:'usuario/list',
    component: UsuarioListComponent,
    canActivate: [AuthGuard],
    data: { animation: 'UsersListPage' }
  },
  {
    path:'usuario/new',
    component: UserFormComponent,
    canActivate: [AuthGuard, WriteAccessGuard],
    data: { animation: 'UserFormPage' }
  },
  {
    path: 'usuario/detail/:userId',
    component: UserDetailComponent,
    canActivate: [AuthGuard],
    data: { animation: 'UserDetailPage' }
  },
  {
    path:'usuario/:userId',
    component: UserFormComponent,
    canActivate: [AuthGuard, WriteAccessGuard],
    data: { animation: 'UserFormPage' }
  },
  {
    path:'**',
    redirectTo:'usuario/list',
    pathMatch:'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
