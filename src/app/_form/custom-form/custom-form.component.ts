import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import { DynamicErrorComponent } from './dynamic-error/dynamic-error.component';
import { SubmitEventData } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-custom-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFieldComponent, DynamicErrorComponent],
  templateUrl: './custom-form.component.html',
  styleUrl: './custom-form.component.css'
})
export class CustomFormComponent
implements OnInit {
  @Input()
  model!: Record<string, any>;
  @Output() submitEvent = new EventEmitter<SubmitEventData>();
  @Input() btnText: String = 'Save';
  public dynamicFormGroup!: FormGroup;
  public fields: Array<any> = [];

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    const formGroupFields = this.getFormControlsFields();
    this.dynamicFormGroup = new FormGroup(formGroupFields);
  }

  private getFormControlsFields() {
    const formGroupFields: {[key: string]: FormControl} = {};
    for (const field of Object.keys(this.model)) {
      const fieldProps = this.model[field];
      const validators = this.addValidator(fieldProps.rules);

      formGroupFields[field] = new FormControl(fieldProps.value, validators);
      this.fields.push({...fieldProps, fieldName: field});
    }

    return formGroupFields;
  }

  private addValidator(rules: any) {
    if (!rules) {
      return [];
    }

    const validators = Object.keys(rules).map((rule) => {
      switch (rule) {
        case "required":
          return Validators.required;
        // Add more cases for future validations.
        default:
          return null;
      }
    }).filter((validator): validator is Exclude<typeof validator, null> => validator !== null); // Filter out null values
    return validators;
  }

  onSubmit() {
    const formData = this.dynamicFormGroup.value;
    console.table(formData);
    const submitData: SubmitEventData = { formData };
    this.submitEvent.emit(submitData);
    // this.form.reset();
  }

  resetForm() {
    this.dynamicFormGroup.reset();
  }
}
