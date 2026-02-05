import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'workspace-theme';
  private themeSubject: BehaviorSubject<Theme>;
  public theme$: Observable<Theme>;

  constructor() {
    const savedTheme = this.getThemeFromStorage();
    this.themeSubject = new BehaviorSubject<Theme>(savedTheme);
    this.theme$ = this.themeSubject.asObservable();

    // Apply theme on initialization
    this.applyTheme(savedTheme);
  }

  private getThemeFromStorage(): Theme {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const stored = localStorage.getItem(this.THEME_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }

    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem(this.THEME_KEY, theme);
  }

  public toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';

    this.themeSubject.next(newTheme);
    this.applyTheme(newTheme);
  }

  public setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  public getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }
}
