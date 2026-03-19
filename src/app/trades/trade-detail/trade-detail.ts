import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-trade-detail',
  imports: [],
  templateUrl: './trade-detail.html',
  styleUrl: './trade-detail.scss'
})
export class TradeDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly tradeId = signal<string>('');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.tradeId.set(id);
  }

  goBack(): void {
    this.router.navigate(['/trades']);
  }
}
