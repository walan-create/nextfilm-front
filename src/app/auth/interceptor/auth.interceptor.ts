import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
// import { AuthService } from '@auth/services/auth.service';
import { Observable, tap } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const token = inject(AuthService).token();
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  return next(newReq);
}
