# CHANGELOG

All notable changes to this project will be documented in this file.

Format: `MAJOR.MINOR.PATCH` — patch is incremented for each change.

---

## [0.0.10] - 2026-03-17

### Added
- Font Awesome 6.5.1 loaded via CDN in `index.html`
- `TradesList` actions column now shows three icon buttons: view (eye), edit (pen), delete (trash) — each with `title` and `aria-label` attributes
- `goToEdit(id)` method navigating to `/trades/:id/edit`
- `onDelete(id)` stub method (logs warning, ready for delete action dispatch)
- `.btn-icon` SCSS block with `--view` (blue), `--edit` (yellow), `--delete` (red) modifiers
- Unit test for `goToEdit` navigation

### Changed
- Removed the `View Details` text button from the actions column

---

## [0.0.9] - 2026-03-17

### Fixed
- `PageSizeSelector`: replaced `[value]="pageSize"` on `<select>` with `[selected]="option === pageSize"` on each `<option>` — native `<select>` does not respond to `[value]` binding in Angular, causing the visual selection to always show the first option regardless of the actual value
- `DEFAULT_PAGE_SIZE` changed from `10` to `5` so the initial fetch matches the visually selected option

---

## [0.0.8] - 2026-03-17

### Added
- Reusable `PageSizeSelector` component at `shared/page-size-selector/` — renders a `Rows per page` dropdown with options `[5, 10, 20]`, emits `pageSizeChange` output; exports `PAGE_SIZE_OPTIONS` constant
- `TradesList` now renders a footer bar below the table with pagination centered and `PageSizeSelector` on the right
- `onPageSizeChange(limit)` in `TradesList` — resets to page 1 and re-dispatches with new limit; updates `currentPageSize` so subsequent page navigation respects the selected limit
- Unit tests for `PageSizeSelector` covering rendering, input binding, and change emission
- Unit tests for `onPageSizeChange` and limit persistence in `TradesList`

### Changed
- `trade-form.scss` input/select/button font sizes aligned to `0.875rem` (matching `trades-list` buttons); added `font-family: inherit` to form controls

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
