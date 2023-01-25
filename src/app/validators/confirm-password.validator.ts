​
import { AbstractControl, FormGroup } from "@angular/forms";
export function ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName]
      if (
        matchingControl.errors &&
        !matchingControl.errors["confirmPasswordValidator"]
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        control.setErrors({ confirmPasswordValidator: true });
        matchingControl.setErrors({ confirmPasswordValidator: true });
      } else {
        control.setErrors(null);
        matchingControl.setErrors(null);
      }
    };
  }