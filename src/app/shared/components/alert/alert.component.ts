import {Component, Input, Output, EventEmitter} from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faTriangleExclamation,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type AlertType = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  readonly faXmark = faXmark;
  @Input() type: AlertType = 'info';
  @Input() title?: string;
  @Output() close = new EventEmitter<void>();

  get styles(): { bg: string; border: string; text: string; icon: IconDefinition } {
    const styleMap = {
      info: {
        bg: 'bg-primary-50 dark:bg-primary-900/20',
        border: 'border-primary-200 dark:border-primary-800',
        text: 'text-primary-900 dark:text-primary-100',
        icon: faCircleInfo
      },
      success: {
        bg: 'bg-success-50 dark:bg-success-900/20',
        border: 'border-success-200 dark:border-success-800',
        text: 'text-success-900 dark:text-success-100',
        icon: faCircleCheck
      },
      warning: {
        bg: 'bg-warning-50 dark:bg-warning-900/20',
        border: 'border-warning-200 dark:border-warning-800',
        text: 'text-warning-900 dark:text-warning-100',
        icon: faTriangleExclamation
      },
      danger: {
        bg: 'bg-danger-50 dark:bg-danger-900/20',
        border: 'border-danger-200 dark:border-danger-800',
        text: 'text-danger-900 dark:text-danger-100',
        icon: faCircleExclamation
      }
    };
    return styleMap[this.type];
  }

  onClose() {
    this.close.emit();
  }
}
