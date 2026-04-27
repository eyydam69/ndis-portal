import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogUi } from '../../../shared/ui/dialog/dialog.ui';

@Component({
  selector: 'app-cancel-dialog',
  standalone: true,
  imports: [CommonModule, DialogUi],
  templateUrl: './cancel-dialog.component.html',
})
export class CancelDialogComponent {
  @Input() label: string = 'Confirm Action';
  @Input() confirmText: string = 'Confirm';
  @Input() isOpen: boolean = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
}
