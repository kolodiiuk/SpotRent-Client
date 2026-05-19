import {Component, Input, forwardRef} from '@angular/core';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() error?: string;
  @Input() helperText?: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() className: string = '';

  value: any = '';
  disabled: boolean = false;

  private onChange: (value: any) => void = () => {
  };
  private onTouched: () => void = () => {
  };

  get inputClasses() {
    const baseClasses = 'w-full px-4 py-2 rounded-lg border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 transition-colors';
    const errorClasses = this.error
      ? 'border-danger-500 focus:ring-danger-500'
      : 'border-neutral-300 dark:border-neutral-600 focus:ring-primary-500';
    return `${baseClasses} ${errorClasses} ${this.className}`;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
