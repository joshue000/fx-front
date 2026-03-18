import { Component, EventEmitter, Input, Output } from '@angular/core';

export const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

@Component({
  selector: 'app-page-size-selector',
  imports: [],
  templateUrl: './page-size-selector.html',
  styleUrl: './page-size-selector.scss',
})
export class PageSizeSelector {
  @Input() pageSize = 10;
  @Output() pageSizeChange = new EventEmitter<number>();

  readonly options = PAGE_SIZE_OPTIONS;

  onChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(value);
  }
}
