import {Component, Input} from '@angular/core';


type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css'
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() className: string = '';

  get variantClass() {
    const variants = {
      default: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200',
      success: 'bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200',
      warning: 'bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-200',
      danger: 'bg-danger-100 dark:bg-danger-900 text-danger-800 dark:text-danger-200',
      info: 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200'
    };
    return variants[this.variant];
  }
}
