import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { AuthResponse } from '../../service/auth.models';
import { AuthService } from '../../service/auth.service';

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleButtonConfiguration {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number;
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: 'signin' | 'signup' | 'use';
    use_fedcm_for_prompt?: boolean;
  }): void;
  renderButton(parent: HTMLElement, options: GoogleButtonConfiguration): void;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsId;
      };
    };
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('googleButtonHost') googleButtonHost?: ElementRef<HTMLDivElement>;

  credentials = {
    username: '',
    password: ''
  };
  errorMessage = '';
  googleMessage = 'Cargando acceso con Google...';
  isSubmitting = false;
  isGoogleSubmitting = false;
  isGoogleEnabled = false;

  private googleClientId = '';
  private renderTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadGoogleConfiguration();
  }

  ngAfterViewInit(): void {
    this.renderGoogleButton();
  }

  ngOnDestroy(): void {
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }
  }

  login(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Introduce tu usuario y tu contrasena para acceder.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.completeAuthentication(response, {
          username: this.credentials.username
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Login failed', error);
        this.errorMessage = 'No hemos podido validar tu acceso. Revisa tus credenciales e intentalo de nuevo.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/hello']);
  }

  private loadGoogleConfiguration(): void {
    this.authService.getGoogleAuthConfig().subscribe({
      next: (config) => {
        this.isGoogleEnabled = config.enabled;
        this.googleClientId = config.clientId;
        this.googleMessage = config.enabled
          ? 'Selecciona Google para continuar con una cuenta autorizada.'
          : 'Configura GOOGLE_CLIENT_ID en la API para habilitar el acceso con Google.';
        this.renderGoogleButton();
      },
      error: (error) => {
        console.error('Google config failed', error);
        this.googleMessage = 'No ha sido posible cargar el acceso con Google.';
      }
    });
  }

  private renderGoogleButton(attempt = 0): void {
    if (!this.isGoogleEnabled || !this.googleClientId || !this.googleButtonHost?.nativeElement) {
      return;
    }

    const googleAccounts = window.google?.accounts?.id;
    if (!googleAccounts) {
      if (attempt >= 30) {
        this.googleMessage = 'Google Sign-In no esta disponible en este momento.';
        return;
      }

      this.renderTimeout = setTimeout(() => this.renderGoogleButton(attempt + 1), 250);
      return;
    }

    const host = this.googleButtonHost.nativeElement;
    const width = Math.max(220, Math.min(420, Math.round(host.getBoundingClientRect().width || 320)));

    host.innerHTML = '';
    googleAccounts.initialize({
      client_id: this.googleClientId,
      callback: ({ credential }) => this.loginWithGoogle(credential),
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin',
      use_fedcm_for_prompt: true
    });
    googleAccounts.renderButton(host, {
      theme: 'filled_black',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      logo_alignment: 'left',
      width
    });
  }

  private loginWithGoogle(credential: string): void {
    this.errorMessage = '';
    this.isGoogleSubmitting = true;
    this.googleMessage = 'Validando cuenta de Google...';

    this.authService.loginWithGoogle(credential).subscribe({
      next: (response) => {
        this.isGoogleSubmitting = false;
        this.completeAuthentication(response, response.user);
      },
      error: (error) => {
        this.isGoogleSubmitting = false;
        console.error('Google login failed', error);
        this.googleMessage = 'No hemos podido completar el acceso con Google.';
      }
    });
  }

  private completeAuthentication(response: AuthResponse, fallbackUser?: Partial<User>): void {
    this.authService.saveSession(response.token, response.user ?? fallbackUser);
    this.router.navigate(['/hello']);
  }
}
