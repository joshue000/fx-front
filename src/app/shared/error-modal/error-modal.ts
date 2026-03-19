import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-error-modal',
  imports: [TranslatePipe],
  templateUrl: './error-modal.html',
  styleUrl: './error-modal.scss',
})
export class ErrorModal {
  @Input() message = 'An unexpected error occurred.';
  @Output() dismissed = new EventEmitter<void>();

  onDismiss(): void {
    this.dismissed.emit();
  }
}
