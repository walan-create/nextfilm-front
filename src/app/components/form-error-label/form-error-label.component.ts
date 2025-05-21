import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormUtils } from '@utils/form.utils';

@Component({
  selector: 'app-form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorLabelComponent {

  control = input.required<AbstractControl>();

  get errorMessage() {
    const error = this.control().errors || {};

    return this.control().touched && Object.keys(error).length > 0
      ? FormUtils.getTextError(error)
      : null;
  }
}
