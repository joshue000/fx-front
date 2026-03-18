import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-connection-error',
  imports: [],
  templateUrl: './connection-error.html',
  styleUrl: './connection-error.scss',
})
export class ConnectionError {
  @Input() message = 'Unable to reach the server. Please check your connection.';
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
