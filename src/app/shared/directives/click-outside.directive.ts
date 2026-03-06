import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Directive that emits an event when a click occurs outside the host element.
 *
 * Usage: <div (clickOutside)="onOutside()">...</div>
 */
@Directive({
    selector: '[clickOutside]',
    standalone: true,
})
export class ClickOutsideDirective {
    @Output() clickOutside = new EventEmitter<void>();

    constructor(private el: ElementRef) { }

    @HostListener('document:click', ['$event.target'])
    onClick(target: EventTarget | null): void {
        if (!this.el.nativeElement.contains(target)) {
            this.clickOutside.emit();
        }
    }
}
