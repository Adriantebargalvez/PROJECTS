import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { FooterComponent } from './components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserFormComponent } from './components/user-form/user-form.component';
import { LoginComponent } from './components/login/login.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { ToastContainerComponent } from './components/shared/toast-container/toast-container.component';
import { AuthRoleInterceptor } from './services/auth-role.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UsuarioListComponent,
    FooterComponent,
    UserFormComponent,
    LoginComponent,
    UserDetailComponent,
    ToastContainerComponent,
  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
  HttpClientModule,
  FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthRoleInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
