import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  imports: [],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss'
})
export class OrderDetail {
  protected readonly orderId = signal<string>('');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.orderId.set(id);
  }

  goBack(): void {
    this.router.navigate(['/trades']);
  }
}
