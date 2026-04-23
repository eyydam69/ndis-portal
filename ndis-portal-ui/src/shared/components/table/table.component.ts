import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../models/table.model';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class ReusableTableComponent {
  // CONFIG: The definition of headers and data keys
  @Input() columns: TableColumn[] = [];

  // DATA: The actual array of objects to display
  @Input() data: any[] = [];

  // EVENT: Notifies parent when the 'View' button is clicked (like a React callback)
  @Output() viewAction = new EventEmitter<any>();
}
