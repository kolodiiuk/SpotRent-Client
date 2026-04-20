import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-error',
    template: '<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ error }}</div>'
  }
)
export class ErrorComponent {
  @Input({ required: true}) error: string = '';
}
