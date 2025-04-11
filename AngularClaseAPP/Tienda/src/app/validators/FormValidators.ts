import {FormControl, ValidationErrors} from "@angular/forms";

export class FormValidators {
  static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
    if ((control.value != null) && (control.value.trim().length == 0)) {
      return {notOnlyWhitespace: true}
    } else {
      return null;
    }
  }
  static notsex (control: FormControl):ValidationErrors | null{
    const forbiddenWord = 'sex';
    if ((control.value != null && control.value.toLowerCase().includes(forbiddenWord))) {
      return {notsex: true}
    } else {
      return null;
    }
  }
}
