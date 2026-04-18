import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { Booking, BookingStatus } from '../../models/booking.model';

@Component({
  selector: 'owner-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-7xl w-full">
      <div class="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">Space Bookings</h1>
          <p class="mt-2 text-sm text-gray-600">Track and manage reservations for all your spaces.</p>
        </div>
      </div>

      <div *ngIf="isLoading" class="flex justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div *ngIf="!isLoading">
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button (click)="setTab('active')" [ngClass]="currentTab === 'active' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'" class="whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm">
              Active Bookings
              <span *ngIf="activeBookings.length" class="ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium" [ngClass]="currentTab === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'">{{ activeBookings.length }}</span>
            </button>
            <button (click)="setTab('history')" [ngClass]="currentTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'" class="whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm">
              History
              <span *ngIf="historyBookings.length" class="ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium" [ngClass]="currentTab === 'history' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'">{{ historyBookings.length }}</span>
            </button>
          </nav>
        </div>

        <div class="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Space</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Period</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
               <tr *ngIf="displayedBookings.length === 0">
                 <td colspan="4" class="py-8 text-center text-gray-500 text-sm">No bookings found in this category.</td>
               </tr>
               <tr *ngFor="let booking of displayedBookings" class="hover:bg-gray-50 transition-colors">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                           <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="font-medium text-gray-900">{{ booking.spaceName }}</div>
                        <div class="text-gray-500">{{ booking.room || 'General Area' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div class="text-gray-900">{{ booking.startTime | date:'medium' }}</div>
                    <div class="text-gray-500">to {{ booking.endTime | date:'shortTime' }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div class="text-gray-900 font-medium">\${{ booking.total | number:'1.2-2' }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5" [ngClass]="getStatusClass(booking.status)">
                      {{ getStatusLabel(booking.status) }}
                    </span>
                  </td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class OwnerBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = false;
  currentTab: 'active' | 'history' = 'active';

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.isLoading = true;
    this.bookingService.getOwnerBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: () => {
        // Fallback or error handling
        this.isLoading = false;
      }
    });
  }

  get activeBookings() {
    // 0 = Pending, 1 = Confirmed, 2 = Active
    return this.bookings.filter(b => [0, 1, 2].includes(b.status));
  }

  get historyBookings() {
    // 3 = Completed, 4 = Cancelled
    return this.bookings.filter(b => [3, 4].includes(b.status));
  }

  get displayedBookings() {
    return this.currentTab === 'active' ? this.activeBookings : this.historyBookings;
  }

  setTab(tab: 'active' | 'history') {
    this.currentTab = tab;
  }

  getStatusClass(status: BookingStatus) {
    switch(status) {
      case BookingStatus.Pending: return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.Confirmed: return 'bg-blue-100 text-blue-800';
      case BookingStatus.Active: return 'bg-green-100 text-green-800';
      case BookingStatus.Completed: return 'bg-gray-100 text-gray-800';
      case BookingStatus.Cancelled: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: BookingStatus) {
    return BookingStatus[status];
  }
}
