import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocaleService } from '../../../services/locale.service';
import { SupportedLang, TimeFormat, DateOrder } from '../../../models/locale.model';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-locale-switcher',
    standalone: true,
    imports: [TranslateModule, ClickOutsideDirective, FontAwesomeModule],
    templateUrl: './locale-switcher.component.html',
    styleUrls: ['./locale-switcher.component.css'],
})
export class LocaleSwitcherComponent {
    readonly faGlobe = faGlobe;
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
