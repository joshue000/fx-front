import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Header } from './shared/header/header';
import { LoadingSpinner } from './shared/loading-spinner/loading-spinner';
import { selectIsLoading } from './trades/store/trades.selectors';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, Header, LoadingSpinner],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly store = inject(Store);

  readonly isLoading$: Observable<boolean> = this.store.select(selectIsLoading);
}
