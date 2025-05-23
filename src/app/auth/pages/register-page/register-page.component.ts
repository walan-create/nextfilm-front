import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { FormUtils } from '@utils/form.utils';
import { FormErrorLabelComponent } from "../../../components/form-error-label/form-error-label.component";

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  private authService = inject(AuthService);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(FormUtils.passwordPattern)]],
    fullName: ['', [Validators.required, Validators.pattern(FormUtils.namePattern)]],
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
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
    } else {
      const {
        email = '',
        password = '',
        fullName = '',
      } = this.registerForm.value;

      this.authService
        .register(email!, password!, fullName!)
        .subscribe((isAuth) => {
          if (isAuth) {
            this.router.navigateByUrl('/home');
          }
          this.mostrarError();
        });
    }
  }
}
