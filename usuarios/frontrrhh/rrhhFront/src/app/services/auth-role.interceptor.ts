import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthRoleInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const user = this.authService.currentUser;

    if (!user) {
      return next.handle(request);
    }

    const requestWithRole = request.clone({
      setHeaders: {
        'X-User-Role': user.role,
        'X-User-Email': user.email
      }
    });

    return next.handle(requestWithRole);
  }
}
