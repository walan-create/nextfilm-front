import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormErrorLabelComponent } from './form-error-label.component';
import { AbstractControl, Form, FormControl, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form.utils';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  InputSignal,
  NO_ERRORS_SCHEMA,
  signal,
} from '@angular/core';

fdescribe('FormErrorLabelComponent', () => {
  let component: FormErrorLabelComponent;
  let fixture: ComponentFixture<FormErrorLabelComponent>;

  let FormUtilsMock = {
    getTextError: jasmine
      .createSpy('getTextError')
      .and.callFake((error: any) => {
        if (error.email) return 'El correo no es válido';
        return 'Unknown error';
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormErrorLabelComponent],
      providers: [{ provide: FormUtils, useValue: FormUtilsMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorLabelComponent);
    component = fixture.componentInstance;
    const control = new FormControl('', [Validators.required]);
    component.control = signal(
      control
    ) as unknown as InputSignal<AbstractControl>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('errorMessage', () => {
    it('should return error message for required field', () => {
      expect(component.errorMessage).toBe(null); // no Touched
    });

    it('should return error message for email field', () => {
      const control = new FormControl('hola', [
        Validators.required,
        Validators.email,
      ]);
      control.markAsTouched();
      component.control = signal(
        control
      ) as unknown as InputSignal<AbstractControl>;
      expect(component.errorMessage).toContain('correo');
    });
  });
});
