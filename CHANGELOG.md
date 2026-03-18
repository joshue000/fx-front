# CHANGELOG

All notable changes to this project will be documented in this file.

Format: `MAJOR.MINOR.PATCH` — patch is incremented for each change.

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
