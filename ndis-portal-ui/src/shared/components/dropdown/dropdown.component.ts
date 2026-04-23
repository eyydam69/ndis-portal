import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusIconComponent } from '../icons/svg-icons/status-icon';

export interface DropdownOption {
  label: string;
  value: any;
  isDivider?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    StatusIconComponent, // Importing the StatusIconComponent for use in the dropdown
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  @Input() label: string = 'Select';
  @Input() options: DropdownOption[] = [];
  @Input() selectedValue: any;

  @Output() onSelect = new EventEmitter<any>();

  isOpen = false;

  constructor(private eRef: ElementRef) {}

  toggle() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: DropdownOption) {
    if (option.isDivider) return;
    this.onSelect.emit(option.value);
    this.isOpen = false;
  }

  // Closes the dropdown if you click anywhere outside of this component
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
