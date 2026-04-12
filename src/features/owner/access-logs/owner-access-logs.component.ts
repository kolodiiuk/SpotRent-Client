import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccessLogService } from '../../../app/core/services/access-log.service';
import { AccessLogEntry, accessTypeLabel } from '../../../app/core/models/access-log.model';

@Component({
  selector: 'owner-access-logs',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-7xl w-full">
      <div class="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">Access Logs</h1>
          <p class="mt-2 text-sm text-gray-600">Review entries and exits across your spaces in real-time.</p>
        </div>
      </div>

      <div *ngIf="isLoading" class="flex justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div *ngIf="!isLoading && logs.length === 0" class="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-semibold text-gray-900">No logs</h3>
        <p class="mt-1 text-sm text-gray-500">There are no access events recorded yet.</p>
      </div>

      <div *ngIf="!isLoading && logs.length > 0" class="bg-white shadow-sm flex flex-col rounded-xl border border-gray-100 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
           <thead class="bg-gray-50">
             <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Time</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Event</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">User</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Space</th>
                <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Result</th>
             </tr>
           </thead>
           <tbody class="divide-y divide-gray-200 bg-white">
              <tr *ngFor="let log of logs" class="hover:bg-gray-50 transition-colors">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                  {{ (log.timestamp || log.Timestamp) | date:'medium' }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                  {{ getTypeLabel(log.accessType) }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ log.user ? log.user.firstName + ' ' + log.user.lastName : 'Unknown' }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ log.space ? log.space.name : 'Unknown Space' }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-right">
                  <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5" [ngClass]="log.isSuccessful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ log.isSuccessful ? 'Success' : 'Denied' }}
                  </span>
                </td>
              </tr>
           </tbody>
        </table>
      </div>
    </div>
  `
})
export class OwnerAccessLogsComponent implements OnInit {
  logs: AccessLogEntry[] = [];
  isLoading = false;

  constructor(private accessLogService: AccessLogService) {}

  ngOnInit() {
    this.isLoading = true;
    this.accessLogService.getOwnerAccessLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  
  getTypeLabel = accessTypeLabel;
}
