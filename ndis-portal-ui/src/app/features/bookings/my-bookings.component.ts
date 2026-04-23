import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import your shared components
import { ReusableTableComponent } from '../../../shared/components/table/table.component';
import {
  DropdownComponent,
  DropdownOption,
} from '../../../shared/components/dropdown/dropdown.component';

// Import the model
import { TableColumn } from '../../../shared/models/table.model';
import { StatusIconComponent } from "../../../shared/components/icons/svg-icons/status-icon";

@Component({
  selector: 'app-my-booking',
  standalone: true,
  // Add the dropdown and table to imports
  imports: [CommonModule, ReusableTableComponent, DropdownComponent, StatusIconComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingComponent implements OnInit {
  // 1. Dropdown State
  selectedStatus: string = 'All';

  // 2. Dropdown Configuration
  statusOptions: DropdownOption[] = [
    { label: 'All Status', value: 'All' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  // 3. Table Column Configuration
  bookingColumns: TableColumn[] = [
    { key: 'service', label: 'Service', type: 'text' },
    { key: 'category', label: 'Category', type: 'category' },
    { key: 'date', label: 'Date', type: 'text' },
    { key: 'note', label: 'Note', type: 'action' },
    { key: 'status', label: 'Status', type: 'badge' },
  ];

  // 4. Master Data Source
  private masterData = [
    {
      service: 'Personal Hygiene',
      category: 'Daily Personal Activities',
      date: 'Apr 21, 2026',
      status: 'Approved',
    },
    {
      service: 'Personal Hygiene',
      category: 'Daily Personal Activities',
      date: 'Apr 21, 2026',
      status: 'Pending',
    },
    {
      service: 'Personal Hygiene',
      category: 'Daily Personal Activities',
      date: 'Apr 21, 2026',
      status: 'Approved',
    },
    {
      service: 'Personal Hygiene',
      category: 'Daily Personal Activities',
      date: 'Apr 21, 2026',
      status: 'Pending',
    },
    {
      service: 'Personal Hygiene',
      category: 'Daily Personal Activities',
      date: 'Apr 21, 2026',
      status: 'Cancelled',
    },
    {
      service: 'Personal Hygiene',
      category: 'Daily Personal Activities',
      date: 'Apr 21, 2026',
      status: 'Approved',
    },
    {
      service: 'Personal Hygiene',
      category: 'Daily Personal Activities',
      date: 'Apr 21, 2026',
      status: 'Cancelled',
    },
    {
      service: 'Personal Hygiene',
      category: 'Daily Personal Activities',
      date: 'Apr 21, 2026',
      status: 'Pending',
    },
  ];

  // 5. Data passed to the table component
  filteredData: any[] = [];

  ngOnInit() {
    // Fill the table with everything initially
    this.filteredData = [...this.masterData];
  }

  /**
   * Logic to filter data based on dropdown selection
   * @param status The value emitted from app-dropdown
   */
  handleStatusFilter(status: string) {
    this.selectedStatus = status;

    if (status === 'All') {
      this.filteredData = [...this.masterData];
    } else {
      this.filteredData = this.masterData.filter(
        (item) => item.status.toLowerCase() === status.toLowerCase(),
      );
    }
  }

  /**
   * Logic for the 'View' button in the table
   */
  onBookingView(item: any) {
    console.log('User clicked view for:', item);
    // You could open a modal or navigate to a detail page here
  }
}
