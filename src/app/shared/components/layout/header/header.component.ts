import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../../services';
import { LocaleSwitcherComponent } from '../../locale-switcher/locale-switcher.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../../features/auth/services/auth.service';
import { User } from '../../../../../features/auth/models/user.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, LocaleSwitcherComponent, FontAwesomeModule, TranslateModule],
  standalone: true,
  template: `
    <header class="z-40 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <div class="flex items-center gap-4">
            <button class="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-300">
              <span class="sr-only">Open sidebar</span>
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a routerLink="/" class="flex items-center gap-2">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold">S</span>
              </div>
              <span class="hidden sm:block text-lg font-bold text-neutral-900 dark:text-white">SpotRent</span>
            </a>
          </div>

          <div class="flex items-center gap-3">
            <button (click)="toggleTheme()"
                    class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-300">
              <fa-icon [icon]="(themeService.theme$ | async) === 'light' ? faMoon : faSun"></fa-icon>
            </button>
            <app-locale-switcher></app-locale-switcher>
            <div class="relative">
              @if (user$ | async; as user) {
                <button (click)="toggleProfileMenu()"
                        class="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                  <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {{ getUserInitial(user) }}
                  </div>
                  <span class="hidden sm:block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    {{ user.email || 'User' }}
                  </span>
                </button>

                @if (profileMenuOpen) {
                  <div
                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-strong border border-neutral-200 dark:border-neutral-700 py-2">
                    <button (click)="logout()"
                      class="block w-full text-left px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                      {{ 'NAV.SIGN_OUT' | translate }}
                    </button>
                  </div>
                }
              } @else {
                <div class="text-sm font-medium text-neutral-500 dark:text-neutral-400">Loading...</div>
              }
            </div>

          </div>
        </div>
      </div>
    </header>
    `,
  styles: []
})
export class HeaderComponent implements OnInit {
  readonly faMoon = faMoon;
  readonly faSun = faSun;
  user$: Observable<User | null>;
  profileMenuOpen = false;

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {}

  logout(): void {
    this.profileMenuOpen = false;
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  getUserInitial(user: User): string {
    return user?.firstName?.charAt(0).toUpperCase() || 'U';
  }
}
