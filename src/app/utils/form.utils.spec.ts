import { FormUtils } from './form.utils';
import { ValidationErrors } from '@angular/forms';

describe('FormUtils - Get TextError', () => {
  describe('Normal Cases', () => {
    it('should return error message for "required" case', () => {
      const errors: ValidationErrors = { required: true };
      const errorMessage = FormUtils.getTextError(errors);
      expect(errorMessage).toBe('Este campo es requerido');
    });

    it('should return error message for "minlength" case', () => {
      const errors: ValidationErrors = {
        minlength: {
          requiredLength: 8,
          actualLength: 5,
        },
      };
      const errorMessage = FormUtils.getTextError(errors);
      expect(errorMessage).toBe('Mínimo de 8 caracteres.');
    });

    it('should return error message for "min" case', () => {
      const errors: ValidationErrors = {
        min: {
          min: 10,
          actual: 5,
        },
      };
      const errorMessage = FormUtils.getTextError(errors);
      expect(errorMessage).toBe('Valor mínimo de 10');
    });

    it('should return error message for "email" case', () => {
      const errors: ValidationErrors = { email: true };
      const errorMessage = FormUtils.getTextError(errors);
      expect(errorMessage).toBe(
        'El valor ingresado no es un correo electrónico'
      );
    });
  });

  describe('Pattern Cases', () => {
    it('should return specific error message for password pattern', () => {
      const errors: ValidationErrors = {
        pattern: {
          requiredPattern: FormUtils.passwordPattern,
          actualValue: 'password',
        },
      };
      const expectedMessage = `La contraseña debe tener al menos:<br>
                      -  8 - 15 caracteres<br>
                      - una mayúscula<br>
                      - un carácter especial (@$!%*?&)<br>
                      - un número`;
      const errorMessage = FormUtils.getTextError(errors);
      expect(errorMessage).toBe(expectedMessage);
    });

    it('should return error message for name pattern', () => {
      const errors: ValidationErrors = {
        pattern: {
          requiredPattern: 'namePattern',
          actualValue: 'valor',
        },
      };
      const errorMessage = FormUtils.getTextError(errors);
      expect(errorMessage).toBe('El valor ingresado no es un nombre completo');
    });
  });




  it('should return generic error message for unhandled cases', () => {
    const errors: ValidationErrors = { desconocido: true };
    const errorMessage = FormUtils.getTextError(errors);
    expect(errorMessage).toBe('Error de validación no controlado desconocido');
  });

  it('should return null when there are no errors', () => {
    const errors: ValidationErrors = {};
    const errorMessage = FormUtils.getTextError(errors);
    expect(errorMessage).toBeNull();
  });
});
