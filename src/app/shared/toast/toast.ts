import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast implements OnInit, OnDestroy {
  @Input() message = '';
  @Input() duration = 4000;
  @Output() dismissed = new EventEmitter<void>();

  private timer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.timer = setTimeout(() => this.dismiss(), this.duration);
  }

  ngOnDestroy(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }
  }

  dismiss(): void {
    this.dismissed.emit();
  }
}
