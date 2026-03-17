import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { ordersReducer } from './orders/store/orders.reducer';
import { OrdersEffects } from './orders/store/orders.effects';
import { ORDERS_FEATURE_KEY } from './orders/store/orders.selectors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ [ORDERS_FEATURE_KEY]: ordersReducer }),
    provideEffects([OrdersEffects]),
  ]
};
