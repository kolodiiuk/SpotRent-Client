import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavigationItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  standalone: true,
  template: `
    <aside class="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r border-gray-200">
      <div class="flex items-center justify-center -mx-2 mb-8">
        <h2 class="text-2xl font-bold text-blue-600">SpotRent</h2>
      </div>

      <div class="flex flex-col justify-between flex-1 mt-6">
        <nav>
          <a *ngFor="let item of navItems" 
             [routerLink]="item.path" 
             routerLinkActive="bg-blue-50 text-blue-700"
             [routerLinkActiveOptions]="{exact: item.path === '/owner' || item.path === '/admin'}"
             class="flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700">
            
            <span class="mx-2 font-medium" [innerHTML]="item.icon"></span>
            <span class="mx-2 font-medium">{{ item.label }}</span>
          </a>
        </nav>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {
  @Input() navItems: NavigationItem[] = [];
}
