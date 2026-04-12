import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() className: string = '';
  @Input() hover: boolean = false;

  get cardClasses() {
    const baseClasses = 'bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-soft';
    const hoverClass = this.hover ? 'hover:shadow-medium transition-shadow duration-200' : '';

    return `${baseClasses} ${hoverClass} ${this.className}`;
  }
}
