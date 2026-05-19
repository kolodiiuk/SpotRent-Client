import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ThemeService } from '../../services';
import { TranslateModule } from '@ngx-translate/core';
import { LocaleSwitcherComponent } from '../../shared/components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faMoon, faSun, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../features/auth/services/auth.service';
import { User } from '../../../features/auth/models/user.model';
import { UserRole } from '../../../features/auth/models/user-role.model';

@Component({
  selector: 'app-visitor-layout',
  standalone: true,
  imports: [RouterModule, AsyncPipe, TranslateModule, LocaleSwitcherComponent, FontAwesomeModule],
  templateUrl: './visitor-layout.component.html',
  styleUrls: ['./visitor-layout.component.css']
})
export class VisitorLayoutComponent {
  readonly faBars = faBars;
  readonly faXmark = faXmark;
  readonly faMoon = faMoon;
  readonly faSun = faSun;
  mobileMenuOpen = false;

  constructor(
    public themeService: ThemeService,
    public authService: AuthService,
    private router: Router
  ) {
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.closeMobileMenu();
      this.router.navigate(['/']);
    });
  }

  displayName(user: User): string {
    const lastName = (user as User & { lastName?: string }).lastName ?? user.secondName ?? '';
    const fullName = `${user.firstName} ${lastName}`.trim();
    return fullName || user.email;
  }

  getAccountRoute(user: User): string {
    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.OWNER:
        return '/owner';
      case UserRole.USER:
      default:
        return '/user/profile';
    }
  }
}
