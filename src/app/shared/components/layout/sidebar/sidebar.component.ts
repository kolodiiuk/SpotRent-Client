import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { RouterModule } from '@angular/router';

export interface NavigationItem {
  label: string;
  icon: IconDefinition;
  path: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, FontAwesomeModule],
  standalone: true,
  template: `
    <aside class="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white/80 dark:bg-neutral-900/85 backdrop-blur-md border-r border-neutral-200 dark:border-neutral-800 shadow-lg">
      <div class="flex flex-col flex-1 mt-2">
        <nav>
          @for (item of navItems; track item) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-primary-600 text-white shadow-md"
              [routerLinkActiveOptions]="{exact: item.exact ?? false}"
              class="flex items-center px-4 py-2.5 mt-2 text-neutral-700 dark:text-neutral-200 transition-colors duration-300 transform rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <span class="mx-2 font-medium inline-flex items-center justify-center">
                <fa-icon [icon]="item.icon"></fa-icon>
              </span>
              <span class="mx-2 font-medium">{{ item.label }}</span>
            </a>
          }
        </nav>
      </div>
    </aside>
    `,
  styles: []
})
export class SidebarComponent {
  @Input() navItems: NavigationItem[] = [];
}
