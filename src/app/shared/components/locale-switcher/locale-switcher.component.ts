import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocaleService } from '../../../core/services/locale.service';
import { SupportedLang, TimeFormat, DateOrder } from '../../../core/models/locale.model';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
    selector: 'app-locale-switcher',
    standalone: true,
    imports: [TranslateModule, ClickOutsideDirective],
    templateUrl: './locale-switcher.component.html',
    styleUrls: ['./locale-switcher.component.css'],
})
export class LocaleSwitcherComponent {
    panelOpen = false;

    constructor(public locale: LocaleService) { }

    setLang(lang: SupportedLang): void {
        this.locale.setLang(lang);
    }

    setTimeFormat(fmt: TimeFormat): void {
        this.locale.setTimeFormat(fmt);
    }

    setDateOrder(order: DateOrder): void {
        this.locale.setDateOrder(order);
    }

    togglePanel(): void {
        this.panelOpen = !this.panelOpen;
    }

    closePanel(): void {
        this.panelOpen = false;
    }
}
