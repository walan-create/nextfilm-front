import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPageComponent } from './register-page.component';
import { AuthService } from '@auth/services/auth.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { FormErrorLabelComponent } from '../../../components/form-error-label/form-error-label.component';

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

const authServiceMock = {
  checkStatus: jasmine.createSpy('checkStatus').and.callFake(() => {
    return of(true);
  }),
  // mockResolvedValue
  register: jasmine
    .createSpy('register')
    .and.callFake((email: string, password: string, name: string) => {
      if (email === 'adios@adios.com') return of(false);
      return of(true);
    }),
};

fdescribe('Register Component', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
      .overrideComponent(RegisterPageComponent, {
        remove: { imports: [FormErrorLabelComponent] },
        add: { imports: [MockFormErrorLabelComponent] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPageComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router); // Get router instance

    component = fixture.componentInstance;

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

  describe('Form Validations', () => {
    it('should print error when email not valid', () => {
      component.registerForm.setValue({
        email: 'hola@',
        password: '!Qazghfdsnjw29',
        fullName: 'Hola Mundo',
      });

      // Simular un valor de email inválido
      expect(component.registerForm.valid).toBeFalse();

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

    it('should print error when fullName not valid', () => {
      component.registerForm.setValue({
        email: 'hola@hola.com',
        password: '!Qazghfdsnjw29',
        fullName: 'Hola',
      });

      // Simular un valor de email inválido
      expect(component.registerForm.valid).toBeFalse();

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

    it('should print error when password not valid', () => {
      component.registerForm.setValue({
        email: 'hola@hola.com',
        password: '123',
        fullName: 'Hola Mundo',
      });

      // Simular un valor de email inválido
      expect(component.registerForm.valid).toBeFalse();

      component.onSubmit();

      fixture.detectChanges();

      const errorMessages = Array.from(
        fixture.nativeElement.querySelectorAll(
          '.text-danger'
        ) as NodeListOf<HTMLElement>
      ).filter((el: HTMLElement) => el.textContent?.trim() !== '');

      expect(errorMessages.length).toBeGreaterThan(0);

      expect(errorMessages[0].textContent).toContain('Error');
    });
  });

  describe('Register', () => {
    it('should print error when credentials not valid', () => {
      component.registerForm.setValue({
        email: 'adios@adios.com',
        password: '!Qazghfdsnjw29',
        fullName: 'Adios Mundo',
      });

      component.onSubmit();

      expect(authService.register).toHaveBeenCalled();
      expect(component.hasError()).toBeTrue();

      setTimeout(() => {
        expect(component.hasError()).toBeFalse();
      }, 2000);
    });

    it('should do register with valid credentials', () => {
      component.registerForm.setValue({
        email: 'hola@hola.com',
        password: '!Qazghfdsnjw29',
        fullName: 'Hola Mundo',
      });
      const spyNavigate = spyOn(router, 'navigateByUrl');

      component.onSubmit();

      const errorMessages = Array.from(
        fixture.nativeElement.querySelectorAll(
          '.text-danger'
        ) as NodeListOf<HTMLElement>
      ).filter((el: HTMLElement) => el.textContent?.trim() !== '');

      expect(errorMessages.length).toBe(0);

      expect(authService.register).toHaveBeenCalled();

      // comprobar que se redirige a la página de inicio
      expect(spyNavigate).toHaveBeenCalledWith('/home');
    });
  });
});
