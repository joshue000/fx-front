import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { tradesReducer } from './trades/store/trades.reducer';
import { TradesEffects } from './trades/store/trades.effects';
import { TRADES_FEATURE_KEY } from './trades/store/trades.selectors';
import { timeoutInterceptor } from './core/interceptors/timeout.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([timeoutInterceptor])),
    provideStore({ [TRADES_FEATURE_KEY]: tradesReducer }),
    provideEffects([TradesEffects]),
  ]
};
