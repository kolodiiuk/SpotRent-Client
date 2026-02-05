import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';

type AlertType = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() title?: string;
  @Output() close = new EventEmitter<void>();

  get styles() {
    const styleMap = {
      info: {
        bg: 'bg-primary-50 dark:bg-primary-900/20',
        border: 'border-primary-200 dark:border-primary-800',
        text: 'text-primary-900 dark:text-primary-100',
        icon: 'ℹ️'
      },
      success: {
        bg: 'bg-success-50 dark:bg-success-900/20',
        border: 'border-success-200 dark:border-success-800',
        text: 'text-success-900 dark:text-success-100',
        icon: '✓'
      },
      warning: {
        bg: 'bg-warning-50 dark:bg-warning-900/20',
        border: 'border-warning-200 dark:border-warning-800',
        text: 'text-warning-900 dark:text-warning-100',
        icon: '⚠'
      },
      danger: {
        bg: 'bg-danger-50 dark:bg-danger-900/20',
        border: 'border-danger-200 dark:border-danger-800',
        text: 'text-danger-900 dark:text-danger-100',
        icon: '✕'
      }
    };
    return styleMap[this.type];
  }

  onClose() {
    this.close.emit();
  }
}
