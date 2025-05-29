import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {

  const authService = inject(AuthService);

  const router = inject(Router);


  await firstValueFrom(authService.checkStatus());

  const isAdmin =  authService.user()?.isAdmin;

  console.log('isAdmin', isAdmin);

  if(isAdmin) {

    router.navigateByUrl('/');
    return false;
  }

  return true;
}
