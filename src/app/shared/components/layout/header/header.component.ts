import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  standalone: true,
  template: `
    <header class="bg-white border-b border-gray-200">
      <div class="px-4 mx-auto sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <div class="flex items-center gap-x-4">
            <!-- Mobile Menu Toggle Button (optional, can be linked to sidebar state later) -->
            <button class="p-2 -m-2 text-gray-400 lg:hidden hover:text-gray-500">
              <span class="sr-only">Open sidebar</span>
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-900 hidden sm:block">Dashboard</h1>
          </div>

          <div class="flex items-center gap-x-4 sm:gap-x-6">
            <!-- Notifications -->
            <button class="p-2 -m-2 text-gray-400 hover:text-gray-500">
              <span class="sr-only">View notifications</span>
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <!-- Separator -->
            <div class="hidden sm:block sm:w-px sm:h-6 sm:bg-gray-200" aria-hidden="true"></div>

            <!-- Profile dropdown -->
            <div class="relative flex items-center">
              <ng-container *ngIf="user$ | async as user; else guestTpl">
                <div class="flex items-center gap-x-3 text-sm font-medium leading-6 text-gray-900">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    {{ user.firstName[0] }}{{ user.secondName[0] }}
                  </div>
                  <span class="hidden sm:block">{{ user.firstName }} {{ user.secondName }}</span>
                  <button (click)="logout()" class="ml-4 text-sm text-red-600 hover:text-red-900 transition-colors">
                    Logout
                  </button>
                </div>
              </ng-container>
              <ng-template #guestTpl>
                <div class="text-sm font-medium text-gray-500">Loading...</div>
              </ng-template>
            </div>
            
          </div>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
