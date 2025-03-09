import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectInputComponent,
      multi: true,
    },
  ],
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.css',
})
export class SelectInputComponent implements ControlValueAccessor {
  // Configurable Inputs
  @Input() options: any[] = [];
  @Input() label: string = '';
  @Input() name: string = 'select-input';
  @Input() disabled: boolean = false;
  @Input() showErrors: boolean = true;

  // Unique identifier for the select input
  @Input() id: string = `select-input-${SelectInputComponent.nextId++}`;

  // Form Control for Reactive Forms
  control: FormControl = new FormControl('');

  // Static counter for generating unique IDs
  private static nextId = 1;

  // ControlValueAccessor Implementation
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  // Write value from parent form
  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  // Register change handler
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Register touched handler
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Disable/enable control
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    isDisabled ? this.control.disable() : this.control.enable();
  }

  // Constructor to set up listeners
  constructor() {
    // Listen to value changes and propagate to parent form
    this.control.valueChanges.subscribe((value) => {
      this.onChange(value);
    });

    // Mark as touched when control loses focus
    this.control.valueChanges.subscribe(() => {
      this.onTouched();
    });
  }
}
