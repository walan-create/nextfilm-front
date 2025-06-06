import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';



export class FormUtils {
  // Expresiones regulares
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  // static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  // Cambia la longitud mínima a 5 si lo deseas
  static passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,15}$';

  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'email':
          return 'El valor ingresado no es un correo electrónico';


        case 'pattern':

          if (errors['pattern'].requiredPattern === FormUtils.passwordPattern) {
            return `La contraseña debe tener al menos:<br>
                      -  8 - 15 caracteres<br>
                      - una mayúscula<br>
                      - un carácter especial (@$!%*?&)<br>
                      - un número`;
          }
          return 'El valor ingresado no es un nombre completo';

        default:
          return `Error de validación no controlado ${key}`;
      }
    }

    return null;
  }


}
