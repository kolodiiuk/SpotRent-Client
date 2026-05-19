import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Space } from '../../../../models/space.model';
import { RouterModule } from '@angular/router';
import { StringSpaceTypePipe } from '../../../../../../app/shared/pipes';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-space-list',
  standalone: true,
  imports: [CommonModule, RouterModule, StringSpaceTypePipe, TranslateModule],
  templateUrl: './space-list.component.html',
  styleUrl: './space-list.component.css'
})
export class SpaceListComponent {
  @Input() spaces: Space[] = [];
  @Input() isLoading: boolean = false;
}
