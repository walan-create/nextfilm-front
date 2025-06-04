import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormErrorLabelComponent } from '../../../components/form-error-label/form-error-label.component';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  router = inject(Router);

  cambiado = signal(false);


  private authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  checkStatusResource = rxResource({
    loader: () => this.authService.checkStatus(),
  });

  private mostrarError() {
    this.hasError.set(true);
    setTimeout(() => {
      this.hasError.set(false);
    }, 2000);
    return;
  }

  onSubmit() {
    const isValid = this.loginForm.valid;
    this.loginForm.markAllAsTouched();
    this.cambiado.set(!this.cambiado());

    if (!isValid) return;

    const { email , password  } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe((isAuth) => {
      // console.log('isAuth', isAuth);
      if (isAuth) {
        // console.log('Login successful');
        this.router.navigateByUrl('/home');
        return;
      }

      this.mostrarError();
    });
  }
}
