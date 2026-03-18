# CHANGELOG

All notable changes to this project will be documented in this file.

Format: `MAJOR.MINOR.PATCH` — patch is incremented for each change.

---

## [0.0.18] - 2026-03-17

### Added
- `Dockerfile` — multi-stage build: Node 22 Alpine compiles the app, nginx 1.27 Alpine serves `dist/fx-front/browser`
- `nginx.conf` — static asset caching headers; all routes fall back to `index.html` for Angular client-side routing
- `.dockerignore` — excludes `node_modules`, `dist`, `.angular` cache, and shell scripts from the build context
- `start.sh` — builds the Docker image and starts the container; respects `PORT` env var (default `4200`)
- `stop.sh` — stops and removes the running container
- `README.md` rewritten with prerequisites table, local dev, Docker start/stop instructions, and build notes

---

## [0.0.17] - 2026-03-17

### Changed
- `TradeForm`: submit button is now also disabled when `form.invalid` (previously only disabled while submitting)
- `TradeForm`: `status` field defaults to `open` instead of empty string
- `trade-form.spec.ts`: updated form initialization test to expect `status: OrderStatus.open`; added tests for submit button disabled when form invalid and enabled when form valid

---

## [0.0.16] - 2026-03-17

### Changed
- `orderPriceGroupValidator`: removed `touched && dirty` guard — cross-field price errors are now computed immediately whenever price has a value, making validation fully reactive
- `TradeForm`: added `showPriceCrossFieldError` getter — controls UI display of cross-field errors; shows the error only after the user has interacted with at least one related field (pair, side, type, or price), preventing premature error display on initial load or edit mode population
- `trade-form.html`: price input invalid class now also binds to `showPriceCrossFieldError`; restored market order info message (`trade-form__info`) shown instead of error hint when type is market
- `trade-form.scss`: added `.trade-form__info` style (indigo, 0.8rem) for the market price auto-fill message
- `trade-form.spec.ts`: updated cross-field display test to assert `showPriceCrossFieldError` (UI gating) instead of raw `hasError` (which is now always set when price has a value); added test confirming the error becomes visible after a related field is touched; removed unused `clearTradesErrors` import

---

## [0.0.15] - 2026-03-17

### Added
- `AppError` model at `core/models/app-error.model.ts` — `{ kind: 'network' | 'api'; message: string }` — typed error contract used across the entire store
- `ErrorModal` shared component at `shared/error-modal/` — fixed-position overlay showing an error icon, message, and a Close button; emits `dismissed`
- `ConnectionError` shared component at `shared/connection-error/` — inline replacement for content area showing a disconnection icon, message, and a Try Again button; emits `retry`
- `clearTradesErrors` NgRx action — clears all error fields (`error`, `createError`, `loadOneError`, `updateError`, `deleteError`) in a single dispatch
- `toAppError(HttpErrorResponse)` helper in effects — maps `status === 0` to `kind: 'network'`, all other statuses to `kind: 'api'` with the response body message

### Changed
- All failure actions (`loadTradesFailure`, `loadTradeFailure`, `createTradeFailure`, `updateTradeFailure`, `deleteTradeFailure`) changed from `{ error: string }` to `{ error: AppError }`
- `TradesState` error fields changed from `string | null` to `AppError | null`
- Effects extract human-readable messages from `err.error?.message` for API errors instead of the raw Angular `HttpErrorResponse.message`
- `TradesList`: network errors replace the table with `ConnectionError` (with retry); API load errors show `ErrorModal` (dismissal re-fetches list); delete errors show `ErrorModal` (dismissal dispatches `clearTradesErrors`)
- `TradeForm`: network load errors replace the form with `ConnectionError` (with retry); API load errors and submit errors show `ErrorModal` (dismissal dispatches `clearTradesErrors`)
- Spec files updated: mock selectors use `AppError | null`; error display assertions check for `app-error-modal` / `app-connection-error` instead of inline div classes

---

## [0.0.14] - 2026-03-17

### Changed
- `pair` field changed from a free-text input to a `<select>` dropdown listing only the valid pairs (`BTCUSD`, `EURUSD`, `ETHUSD`); eliminates the need for manual ticker entry

---

## [0.0.13] - 2026-03-17

### Added
- `market-prices.constant.ts` at `core/constants/` — `MARKET_PRICES` record (`BTCUSD`, `EURUSD`, `ETHUSD`) and `VALID_PAIRS` array as the single source of truth for current market prices
- `order-price.validator.ts` at `trades/trade-form/validators/`:
  - `validateOrderPrice(pair, side, type, price)` — pure cross-field validation function
  - `validPairValidator` — control-level ValidatorFn; rejects pairs not in `VALID_PAIRS`
  - `orderPriceGroupValidator` — group-level ValidatorFn; sets errors directly on the price control once it is touched and dirty
- `order-price.validator.spec.ts` — unit tests for all cases (limit, stop, market, boundary conditions, validPairValidator)

### Changed
- `pair` field: no longer accepts slash format (e.g. `EUR/USD`); must use the ticker format (`EURUSD`). Placeholder updated accordingly. `validPairValidator` added to control validators.
- `price` field: `Validators.min(0.0001)` replaces the previous `min(0)`. Cross-field validation via `orderPriceGroupValidator`:
  - Limit buy: price must be **below** market price
  - Limit sell: price must be **above** market price
  - Stop buy: price must be **above** market price
  - Stop sell: price must be **below** market price
  - Market: no price rule; field is **auto-filled** with current market price and **disabled**
- Price field re-enables automatically when type changes away from market
- `getPairError()` and `getPriceError()` methods expose human-readable messages for template rendering
- Template: pair hint shows the list of valid pairs; price hint is driven by `getPriceError()`; market order shows an info label instead of an error
- `trade-form.spec.ts` updated: existing tests migrated to use valid pairs (`EURUSD` instead of `EUR/USD`); new test groups added for pair validation, cross-field price validation, and market order behavior

---

## [0.0.12] - 2026-03-17

### Removed
- `Home` component and all related files (`home.ts`, `home.html`, `home.scss`, `home.spec.ts`)

### Changed
- Root route `''` now redirects to `trades` instead of loading the `Home` component

---

## [0.0.11] - 2026-03-17

### Added
- `UpdateTradeDto` interface at `core/dtos/update-trade.dto.ts`
- `TradesService.getTradeById(id)`, `updateTrade(id, dto)`, `deleteTrade(id)` methods
- NgRx actions: `loadTrade/Success/Failure`, `updateTrade/Success/Failure`, `deleteTrade/Success/Failure`
- NgRx state fields: `selectedTrade`, `loadingOne`, `loadOneError`, `updating`, `updateError`, `deleting`, `deleteError`
- NgRx selectors for all new state fields
- NgRx effects: `loadTrade$`, `updateTrade$`, `deleteTrade$`
- `ConfirmModal` shared component at `shared/confirm-modal/` — accepts `message` input, emits `confirmed`/`cancelled`; includes unit tests
- `TradeFormMode` type (`'create' | 'view' | 'edit'`) — `TradeForm` now reads mode from route data
- View mode (`trades/:id`): fetches trade via GET, all fields disabled, no submit button
- Edit mode (`trades/:id/edit`): fetches trade via GET, fields editable, submit dispatches PUT via `updateTrade`
- Delete flow in `TradesList`: `onDelete` opens `ConfirmModal`; confirm dispatches `deleteTrade`; success closes modal and reloads list
- Route `trades/:id/edit` added; `trades/:id` and `trades/new` updated with `data: { mode }`

### Changed
- `TradeForm` title, submit label, and footer adapt to mode (`create`/`edit`/`view`)
- `trades/:id` now loads `TradeForm` in view mode (previously routed to `TradeDetail`)
- All spec `initialState` objects updated with new `TradesState` fields

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
