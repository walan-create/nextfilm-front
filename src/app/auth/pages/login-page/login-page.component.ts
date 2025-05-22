import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormUtils } from '@utils/form.utils';
import { FormErrorLabelComponent } from "../../../components/form-error-label/form-error-label.component";

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  private authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });



  checkStatusResource = rxResource({
    loader: () => this.authService.checkStatus()
  })

  private mostrarError (){

    this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;

  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    }
    else{

      const { email = '', password = '' } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe((isAuth) => {
      if(isAuth){
        this.router.navigateByUrl('/home');
      }


      this.mostrarError();

    });

    }


  }
}
