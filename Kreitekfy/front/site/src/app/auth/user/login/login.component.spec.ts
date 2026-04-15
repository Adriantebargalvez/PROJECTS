import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../service/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getGoogleAuthConfig', 'login', 'loginAsGuest', 'loginWithGoogle', 'saveSession']);
    authServiceSpy.getGoogleAuthConfig.and.returnValue(of({ enabled: false, clientId: '' }));

    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
