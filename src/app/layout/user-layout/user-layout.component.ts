import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter } from 'rxjs/operators';
import { User } from '../../models';
import { ThemeService } from '../../services/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { LocaleSwitcherComponent } from '../../shared/components/locale-switcher/locale-switcher.component';

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterModule, RouterOutlet, AsyncPipe, TranslateModule, LocaleSwitcherComponent],
  templateUrl: 'user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {
  @Input() user!: User;
  @Output() logout = new EventEmitter<void>();

  sidebarOpen = false;
  profileMenuOpen = false;
  currentPath = '';

  navigationItems: NavigationItem[] = [
    { path: '/user', label: 'Dashboard', icon: '📊' },
    { path: '/user/my-bookings', label: 'My Bookings', icon: '📅' },
    { path: '/user/subscriptions', label: 'My Subscriptions', icon: '💼' },
    { path: '/user/subscriptions/history', label: 'Subscription History', icon: '🕘' },
    { path: '/spaces', label: 'Browse Spaces', icon: '🏢' },
    { path: '/subscription-plans', label: 'Subscription Plans', icon: '💳' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/user/profile', label: 'Profile', icon: '👤' },
  ];

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.currentPath = this.router.url;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.urlAfterRedirects;
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  isActive(path: string): boolean {
    return this.currentPath === path;
  }

  onLogout(): void {
    this.closeProfileMenu();
    this.logout.emit();
  }

  navigateToBooking(): void {
    this.router.navigate(['/subscription-plans']);
  }

  getUserInitial(): string {
    return this.user?.firstName?.charAt(0).toUpperCase() || 'U';
  }
}
