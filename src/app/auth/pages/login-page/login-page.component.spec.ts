import { Component, CUSTOM_ELEMENTS_SCHEMA, input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '@auth/services/auth.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { FormUtils } from '@utils/form.utils';
import { FormErrorLabelComponent } from '../../../components/form-error-label/form-error-label.component';

const authServiceMock = {
  checkStatus: jasmine.createSpy('checkStatus').and.callFake(() => {
    return of(true);
  }),
  // mockResolvedValue
  login: jasmine
    .createSpy('login')
    .and.callFake((email: string, password: string) => {
      if (email === 'adios@adios.com') return of(false);
      return of(true);
    }),
};


@Component({
  selector: 'app-form-error-label',
  imports: [],
  template: '<div class="text-danger">{{ errorMessage }}</div>',
})
class MockFormErrorLabelComponent {

  control = input.required<AbstractControl>();
  valido = input<boolean>(false);

  get errorMessage() {
    const error = this.control().errors || {};

    return this.control().touched && Object.keys(error).length > 0
      ? 'Alun Error'
      : null;
  }
}



describe('Login Component', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent], // Usa el mock component
      providers: [
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).overrideComponent(
      LoginPageComponent,
      {
         remove: { imports: [FormErrorLabelComponent] },
      add: { imports: [MockFormErrorLabelComponent] }

      }
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    component = fixture.componentInstance;

    authServiceMock.checkStatus.calls.reset();
    authServiceMock.login.calls.reset();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Check Status Resource', () => {
    it('should load checkStatusResource correctly', async () => {
      expect(authService.checkStatus).toHaveBeenCalled();

      // Esperar a que se resuelva el recurso
      await fixture.whenStable();

      const result = component.checkStatusResource.value();
      expect(result).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should print error when email not valid', () => {
      component.loginForm.setValue({
        email: 'hola',
        password: '!Qazghfdsnjw29',
      });
      // Simular un valor de email inválido
      expect(component.loginForm.valid).toBeFalse();

      component.onSubmit();

      fixture.detectChanges();

      // Verificar que el mensaje de error
      const errorMessages = Array.from(
        fixture.nativeElement.querySelectorAll(
          '.text-danger'
        ) as NodeListOf<HTMLElement>
      ).filter((el: HTMLElement) => el.textContent?.trim() !== '');

      expect(errorMessages.length).toBeGreaterThan(0);
      expect(errorMessages[0].textContent).toContain('Error');
    });
  });

  describe('Login', () => {
    it('should print error when credentials not valid', fakeAsync( () => {
      component.loginForm.setValue({
        email: 'adios@adios.com',
        password: '!Qazghfdsnjw29',
      });

      component.onSubmit();

      expect(authService.login).toHaveBeenCalled();
      expect(component.hasError()).toBeTrue();

      tick(2001);

      expect(component.hasError()).toBeFalse();

      // setTimeout(() => {
      //   expect(component.hasError()).toBeFalse();
      // }, 2001);
    }));

    it('should do login with valid credentials', () => {
      component.loginForm.setValue({
        email: 'hola@hola.com',
        password: '!Qazghfdsnjw29',
      });
      const spyNavigate = spyOn(router, 'navigateByUrl');

      component.onSubmit();

      expect(authService.login).toHaveBeenCalled();

      // comprobar que se redirige a la página de inicio
      expect(spyNavigate).toHaveBeenCalledWith('/home');
    });
  });
});
