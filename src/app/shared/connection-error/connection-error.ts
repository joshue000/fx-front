import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-connection-error',
  imports: [TranslatePipe],
  templateUrl: './connection-error.html',
  styleUrl: './connection-error.scss',
})
export class ConnectionError {
  @Input() message = '';
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
