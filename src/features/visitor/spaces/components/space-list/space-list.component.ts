import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Space } from '../../../../../app/core/models/space.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-space-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './space-list.component.html',
  styleUrl: './space-list.component.css'
})
export class SpaceListComponent {
  @Input() spaces: Space[] = [];
  @Input() isLoading: boolean = false;
}
