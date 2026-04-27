import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.ui.html',
})
export class DialogUi {
  @Input() label: string = '';
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
}
