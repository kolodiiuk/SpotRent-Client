import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-space-filter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './space-filter.component.html',
  styleUrl: './space-filter.component.css'
})
export class SpaceFilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();
  filterForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      search: [''],
      city: [''],
      minCapacity: [null],
      maxCapacity: [null],
      minHourlyRate: [null],
      maxHourlyRate: [null]
    });

    this.filterForm.valueChanges.subscribe(value => {
      this.filterChanged.emit(value);
    });
  }
}
