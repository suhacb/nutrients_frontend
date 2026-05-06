# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200
npm run build      # Production build → dist/
npm run watch      # Dev build with watch mode
npm test           # Karma unit tests
```

No dedicated lint command is configured.

## Architecture

Angular 20 frontend for a nutritionist app (browsing, searching, managing nutrients and ingredients). Uses Angular Signals for state management (no NgRx), Angular Material for UI, and SCSS.

### App Structure

```
src/app/
├── core/           # Auth, HTTP, interceptors, guards, shared components
├── modules/        # Feature modules (nutrients, ingredients, search, auth-layout, etc.)
├── config/         # APP_CONFIG injection token
└── environments/   # Dev and prod environment configs
```

Each feature module under `modules/` follows a consistent pattern:
- `pages/` — routed page components
- `store/` — signal-based store
- `contracts/` — API response types and mappers (API models → app models)
- `resolvers/` — route resolvers that pre-fetch data

### State Management (Angular Signals)

Stores expose **readonly signals** and setter methods — never mutate signals directly from outside the store. Pattern:

```ts
private readonly _items = signal<Item[]>([]);
readonly items = this._items.asReadonly();
```

Active stores: `AuthStore`, `NutrientsStore`, `IngredientsStore`.

`AuthStore` persists tokens to `localStorage` and exposes computed signals `isLoggedIn` and `user` (decoded from JWT).

### HTTP Layer

`ApiFetcherService` (`core/http/`) wraps `HttpClient` with two methods:
- `fetchAndProcess<T>()` — GET with callback-based response handling
- `postAndProcess<TRequest, TResponse>()` — POST with optional transform

Error handling is centralized there via `ApiHandlerService`, which surfaces errors as snackbar notifications.

Two interceptors run on every request:
- `appHeadersInterceptor` — injects auth token from `AuthStore`
- `SpinnerInterceptor` — shows/hides the global loading spinner

### Routing & Guards

- `AuthGuard` — protects authenticated routes; validates access token, redirects to `/welcome` on failure
- `GuestGuard` — protects `/welcome` and `/callback`; redirects logged-in users to `/`

All authenticated routes are wrapped in the `AuthLayout` component (sidebar + toolbar).

### Mapper Pattern

API responses use dedicated contract types (e.g. `NutrientApiResource`). Mapper classes (e.g. `NutrientsMapper.toApp()`) transform them into app models before they reach the store. Keep API contracts isolated from app logic.

### Environment Config

Both `environments/environments.ts` and `environments/environments.prod.ts` define: `APPLICATION_NAME`, `CLIENT_URL` (frontend), `BACKEND_URL` (backend API), `APP_NAME`, `APP_TITLE`.

Dev backend runs at `http://localhost:9015` and must be running for the app to function.
