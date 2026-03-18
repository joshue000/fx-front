import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-trade-detail',
  imports: [],
  templateUrl: './trade-detail.html',
  styleUrl: './trade-detail.scss'
})
export class TradeDetail {
  protected readonly tradeId = signal<string>('');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.tradeId.set(id);
  }

  goBack(): void {
    this.router.navigate(['/trades']);
  }
}
