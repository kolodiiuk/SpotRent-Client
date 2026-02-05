import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {ThemeService} from '../../core/services/theme.service';

@Component({
  selector: 'app-visitor-layout',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  templateUrl: './visitor-layout.component.html',
  styleUrls: ['./visitor-layout.component.css']
})
export class VisitorLayoutComponent {
  mobileMenuOpen = false;

  constructor(public themeService: ThemeService) {
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
}
