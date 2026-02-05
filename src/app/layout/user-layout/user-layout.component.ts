import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Router, RouterModule, NavigationEnd} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {filter} from 'rxjs/operators';
import {User} from '../../core/models';
import {ThemeService} from '../../core/services/theme.service';

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
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
    {path: '/dashboard', label: 'Dashboard', icon: '📊'},
    {path: '/bookings', label: 'My Bookings', icon: '📅'},
    {path: '/spaces', label: 'Browse Spaces', icon: '🏢'},
    {path: '/subscriptions', label: 'Subscriptions', icon: '💳'},
    {path: '/access', label: 'Access Control', icon: '🔐'},
    {path: '/profile', label: 'Profile', icon: '👤'},
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
    this.router.navigate(['/book-now']);
  }

  getUserInitial(): string {
    return this.user?.firstName?.charAt(0).toUpperCase() || 'U';
  }
}
