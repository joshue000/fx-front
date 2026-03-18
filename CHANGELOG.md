# CHANGELOG

All notable changes to this project will be documented in this file.

Format: `MAJOR.MINOR.PATCH` — patch is incremented for each change.

---

## [0.0.7] - 2026-03-17

### Added
- `PaginationMetadata` and `PaginatedResponse<T>` interfaces at `core/models/paginated-response.model.ts`
- Reusable `Pagination` component at `shared/pagination/` — accepts `currentPage` and `totalPages` inputs, emits `pageChange` output; handles ellipsis rendering for large page ranges
- `selectTradesPagination` selector to expose `PaginationMetadata | null` from state
- Pagination rendered in `TradesList` only when `totalPages > 1`
- `DEFAULT_PAGE_SIZE = 10` constant exported from `trades-list.ts`

### Changed
- `TradesService.getTrades(page, limit)` now returns `Observable<PaginatedResponse<TradeOrder>>` and sends `page` / `limit` as query params
- `loadTrades` action now requires `{ page: number; limit: number }` props
- `loadTradesSuccess` action now carries `{ trades, pagination }` instead of just `{ trades }`
- `TradesState` extended with `pagination: PaginationMetadata | null`
- `tradesReducer` stores pagination metadata on `loadTradesSuccess`
- `TradesEffects.loadTrades$` passes page/limit to service and maps `response.data` / `response.metadata`
- `TradesList` dispatches `loadTrades({ page: 1, limit: DEFAULT_PAGE_SIZE })` on init; handles `onPageChange` by re-dispatching with new page
- All affected spec files updated to reflect new signatures and assertions

### Fixed
- Resolved `TypeError: newCollection[Symbol.iterator] is not a function` — caused by the API returning a wrapped `{ data, metadata }` object instead of a plain array

---

## [0.0.6] - 2026-03-17

### Changed
- Renamed all `orders`-related identifiers to `trades` throughout the frontend codebase
- Moved `orders/orders-list/` → `trades/trades-list/` (`OrdersList` → `TradesList`, selector `app-trades-list`)
- Moved `orders/order-detail/` → `trades/trade-detail/` (`OrderDetail` → `TradeDetail`, selector `app-trade-detail`)
- Moved `orders/services/orders.service.ts` → `trades/services/trades.service.ts` (`OrdersService` → `TradesService`, methods `getTrades` / `createTrade`)
- Moved `orders/store/` → `trades/store/` with renamed files (`trades.state.ts`, `trades.actions.ts`, `trades.selectors.ts`, `trades.reducer.ts`, `trades.effects.ts`)
- Renamed NgRx identifiers: `ORDERS_FEATURE_KEY` → `TRADES_FEATURE_KEY` (value `'trades'`), `OrdersState` → `TradesState`, `ordersReducer` → `tradesReducer`, `OrdersEffects` → `TradesEffects`
- Renamed actions: `loadOrders/Success/Failure` → `loadTrades/Success/Failure`, `createOrder/Success/Failure` → `createTrade/Success/Failure`
- Renamed selectors: `selectOrders*` → `selectTrades*`
- Renamed `CreateTradeOrderDto` → `CreateTradeDto` (`core/dtos/create-trade.dto.ts`)
- Updated `app.config.ts` and `app.routes.ts` to point to new `trades/` paths and identifiers
- Updated all spec files to reflect new class names, selectors, actions, and CSS class names
- CSS classes renamed: `.orders-*` → `.trades-*`, `.order-detail*` → `.trade-detail*`

---

## [0.0.5] - 2026-03-17

### Added
- `CreateTradeOrderDto` interface at `core/dtos/create-trade-order.dto.ts` (`side`, `type`, `amount`, `price`, `pair`, optional `status`)
- `TradeForm` reactive form component at `trades/trade-form/` routed as `trades/new`
  - Validates all required fields with inline error hints
  - Dispatches `createOrder` action on valid submit
  - Navigates to `/orders` automatically on `createOrderSuccess` using `takeUntilDestroyed`
  - Submit button disabled while creating
- `OrdersService.createOrder(dto)` — POST to `trade_orders` endpoint
- NgRx store extended with create flow: `createOrder`, `createOrderSuccess`, `createOrderFailure` actions; `creating` and `createError` state fields; `selectOrdersCreating` and `selectOrdersCreateError` selectors; `createOrder$` effect
- Unit tests for `TradeForm` covering form validation, dispatch, navigation, and template states
- Unit tests for new reducer create transitions, new effect paths, and new service POST method

---

## [0.0.4] - 2026-03-17

### Added
- Unit tests for NgRx reducer covering all state transitions (`loadOrders`, `loadOrdersSuccess`, `loadOrdersFailure`)
- Unit tests for NgRx selectors (`selectOrders`, `selectOrdersLoading`, `selectOrdersError`)
- Unit tests for NgRx effects with mocked `OrdersService` covering success and failure paths
- Unit tests for `OrdersService` using `HttpTestingController` to verify endpoint and response handling
- Unit tests for `OrdersList` component using `MockStore` to verify dispatch, rendering, loading, error, and empty states
- Unit tests for `OrderDetail` component with mocked `ActivatedRoute` to verify route param reading and navigation
- Unit tests for `Home` component verifying heading and `routerLink`
- Updated `App` component spec to use `provideRouter([])` and assert `router-outlet` presence

---

## [0.0.3] - 2026-03-17

### Changed
- Restored NgRx state management after temporary static data phase
- Rewrote `OrdersEffects` to use `inject()` pattern, fixing initialization crash caused by class-field effect reading `this.actions$` before constructor injection resolved
- Restored `provideStore`, `provideEffects`, and `provideHttpClient` in `app.config.ts`
- `OrdersList` component now exposes `orders$`, `loading$`, and `error$` as `Observable` streams via `store.select()`
- Template uses `async` pipe for automatic subscription and unsubscription
- `@for` block uses `track trackById($index, order)` for efficient DOM reconciliation

---

## [0.0.2] - 2026-03-17

### Added
- Backend integration using `http://localhost:3000/api/v1/` declared in environment files
- `OrdersService` performing `GET /trade_orders` via `HttpClient`
- NgRx feature store for orders: actions (`loadOrders`, `loadOrdersSuccess`, `loadOrdersFailure`), reducer, selectors, and effects
- `provideStore`, `provideEffects`, and `provideHttpClient` registered in `app.config.ts`

---

## [0.0.1] - 2026-03-17

### Added
- Initial Angular 20 project scaffold (`fx-front`)
- Root `App` component with `RouterOutlet`
- `Home` component with navigation link to orders
- `OrdersList` component with table layout, badge styling, and routing
- `OrderDetail` component reading order id from route params
- Lazy-loaded routes: `/`, `/trades`, `/trades/:id`
- `TradeOrder` model with `OrderSide`, `OrderType`, and `OrderStatus` enums
- Environment files for development and production with `apiUrl` constant
