# TextMe Enterprise Service

A high-performance, fully generic, type-safe NestJS microservice integrating the complete [TextMe API](https://docs.textme.co.il/) (all 30 operations across 12 business domains).

Built following enterprise clean architecture and Polytech Engineering Guidelines, this service acts as the centralized telecom and SMS gateway for Polytech platforms, providing dedicated RESTful endpoints, full DTO validation, centralized constants, structured error management, automatic Hebrew localization, and an RPC gateway proxying arbitrary TextMe payloads with dry-run support.

---

## Features

- **Complete API Coverage (All 30 Operations & Webhooks)**:
  - **Tokens**: Mint new tokens (`new`) and retrieve active tokens (`current`) via `getApiToken`.
  - **SMS**: Single send (`sms`) with recipient array, external IDs, dynamic merge fields (`df1`..`df6`), timing schedule, link shortener, unsubscribe footer, temp blocklist filter. Bulk send (`bulk`) up to 2,500 distinct personalized messages.
  - **OTP**: Code generation & transmission (`send_otp`), verification (`validate_otp`) with max attempts and validity window.
  - **Balance**: Account balance query (`balance`) for SMS, international, or mail credits.
  - **Reports**: Delivery receipts by external ID (`dlr`), delivery receipts across date range (`dlrByDate`), incoming messages received (`incoming`).
  - **Blacklist**: Query blocklist within date range (`blacklist`), add numbers (`addNumBL` with `946` success mapping), remove numbers with required reason (`rmNumBL` with `944` partial success mapping).
  - **Contact Lists**: Create lists with dynamic contacts (`newCL`), delete lists (`removeCL`), add/remove recipient numbers (`addNumCL`, `rmNumCL`), get all lists (`getCL`), get list members (`getCLbyID`).
  - **Campaigns**: Cancel scheduled campaigns by ID or name (`cancel`), list birthday campaigns (`get_birthday_campaigns`), edit birthday campaign message (`edit_birthday_campaign`).
  - **Verified Senders**: Submit phone numbers for carrier sender verification (`verify_phone`), list verified senders with sub-account flag (`getVerifiedPhones`).
  - **Subscribers (Reseller)**: Create sub-account (`addSub`), credit sub-account wallet (`updateAmountSub`), get balances across all sub-accounts (`getBlanceSubs`).
  - **Push API & Webhooks**: Register push URL (`push_url`), and receive callbacks for DLR (`onDeliveryReport`), incoming messages (`onIncomingMessage`), and blocklist additions (`onBlocklistAddition`).
  - **Generic RPC Gateway**: Direct live dispatch (`/api/textme/call`) and dry-run validation (`/api/textme/test`).

- **Strict Type Safety & Zero Magic Numbers/Strings**:
  - All status codes, headers, URLs, timeouts, DLR statuses, and validation messages are defined in dedicated `constants/` files.
  - 100% typed with TypeScript strict mode and zero `any` usage.

- **Automated Hebrew Localization (AGENTS.md Compliance)**:
  - Global `HebrewResponseInterceptor` intercepts every outgoing payload and injects `message_he` and translated carrier DLR statuses.
  - Global `TextMeExceptionFilter` maps validation errors and HTTP exceptions into Hebrew messages (`messages_he`, `message_he`, `error_he`).

- **Dual-Environment Architecture (Production & Dry-Run Test Mode)**:
  - Routes to `https://my.textme.co.il/api` for live SMS dispatch.
  - Routes to `https://my.textme.co.il/api/test` when `isTestMode=true` for zero-cost schema and token validation without sending messages or deducting credits.

- **Transport Resilience & Retry Engine**:
  - Configurable timeouts (`TEXTME_TIMEOUT_MS`) and exponential backoff retry loop for transient network or server glitches.
  - `TextMeApiException` preserves status codes, error messages, and raw responses.

---

## Tech Stack & Tooling

- **Framework**: NestJS 11 (Node.js 20+ LTS / TypeScript 5.7)
- **HTTP Client**: Axios (`@nestjs/axios`) with custom retry loop
- **Package Manager**: `pnpm` (strictly required)
- **Validation**: `class-validator` & `class-transformer` (no Zod/Joi)
- **Linter**: Oxlint (`oxlint --deny-warnings`)
- **Unit Testing**: Jest (`pnpm test` — 15 suites, 48 unit tests)
- **E2E Testing**: Jest/Supertest (`pnpm run test:e2e`) & Playwright (`pnpm run test:playwright`)
- **API Collection Runner**: Newman / Postman (`pnpm run test:newman` — 35+ requests covering all 12 domains)

---

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Configuration
Configure environment variables in your environment or configuration management system:
```env
PORT=3001
NODE_ENV=development
TEXTME_BASE_URL=https://my.textme.co.il
TEXTME_TEST_URL=https://my.textme.co.il/api/test
TEXTME_API_TOKEN=your_textme_api_token
TEXTME_USERNAME=your_textme_username
TEXTME_SOURCE=your_approved_sender_id
TEXTME_IS_TEST_MODE=true
TEXTME_TIMEOUT_MS=30000
CORS_ORIGIN=*
```

> **Tip**: Set `TEXTME_IS_TEST_MODE=true` initially to safely test all requests against TextMe's `/api/test` dry-run endpoint without incurring credit charges.

### 3. Run Service
```bash
# Development mode (hot reload)
pnpm run start:dev

# Production build and run
pnpm run build
pnpm run start:prod
```

### 4. Verify Service Health
```bash
curl http://localhost:3001/api/health
```
Expected response:
```json
{
  "status": "ok",
  "service": "textme-service",
  "environment": "development",
  "isTestMode": true,
  "timestamp": "2026-10-09T09:00:00.000Z",
  "message_he": "המערכת פועלת כסדרה"
}
```

---

## Testing & Quality Assurance

```bash
# Typecheck (TypeScript compiler verification)
pnpm run typecheck

# Lint (Oxlint zero-warning policy)
pnpm run lint
pnpm run lint:fix

# Unit Tests (Jest)
pnpm test

# E2E Tests (Jest / Supertest)
pnpm run test:e2e

# E2E Tests (Playwright)
pnpm run test:playwright

# Postman / Newman E2E Collection Runner (requires service running on port 3001)
pnpm run test:newman
```

---

## API Endpoints Overview

| Domain | Method | Path | TextMe Root Key | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/api/health` | — | Health check, environment telemetry & Hebrew status |
| **Tokens** | `POST` | `/api/tokens/create` | `getApiToken` (`new`) | Mint a fresh Bearer API token from TextMe |
| **Tokens** | `POST` | `/api/tokens/current` | `getApiToken` (`current`) | Fetch currently active Bearer token for user |
| **SMS** | `POST` | `/api/sms/send` | `sms` | Send single SMS (supports merge tags, link shortener, unsubscribe) |
| **SMS** | `POST` | `/api/sms/bulk` | `bulk` | High-volume batch send (up to 2,500 distinct messages) |
| **OTP** | `POST` | `/api/otp/send` | `send_otp` | Generate and dispatch OTP verification code via SMS |
| **OTP** | `POST` | `/api/otp/validate` | `validate_otp` | Verify user passcode against TextMe verification engine |
| **Balance** | `POST` | `/api/balance/query` | `balance` | Query account balance (SMS, international, or email credits) |
| **Reports** | `POST` | `/api/reports/dlr` | `dlr` | Delivery receipts by external IDs (7-day window) |
| **Reports** | `POST` | `/api/reports/dlr-by-date` | `dlrByDate` | Delivery receipts across a date/time interval |
| **Reports** | `POST` | `/api/reports/incoming` | `incoming` | Inbound SMS messages received on virtual numbers |
| **Blacklist** | `POST` | `/api/blacklist/query` | `blacklist` | Query numbers on account do-not-contact blocklist |
| **Blacklist** | `POST` | `/api/blacklist/add` | `addNumBL` | Add numbers to blocklist (maps status `946` to success) |
| **Blacklist** | `POST` | `/api/blacklist/remove` | `rmNumBL` | Remove numbers from blocklist with mandatory reason (maps `944`) |
| **Contact Lists** | `POST` | `/api/contact-lists/create` | `newCL` | Provision distribution contact list with dynamic members |
| **Contact Lists** | `POST` | `/api/contact-lists/remove` | `removeCL` | Delete distribution contact lists by ID |
| **Contact Lists** | `POST` | `/api/contact-lists/add-numbers` | `addNumCL` | Append recipients and dynamic variables to existing list |
| **Contact Lists** | `POST` | `/api/contact-lists/remove-numbers` | `rmNumCL` | Delete specific numbers from existing contact list |
| **Contact Lists** | `POST` | `/api/contact-lists/all` | `getCL` | Retrieve metadata and member counts for all lists |
| **Contact Lists** | `POST` | `/api/contact-lists/by-id` | `getCLbyID` | Retrieve member phone numbers and merge fields for a list |
| **Campaigns** | `POST` | `/api/campaigns/cancel-by-id` | `cancel` | Cancel scheduled broadcast by numerical campaign ID |
| **Campaigns** | `POST` | `/api/campaigns/cancel-by-name` | `cancel` | Cancel pending broadcasts by campaign name |
| **Campaigns** | `POST` | `/api/campaigns/birthday` | `get_birthday_campaigns` | List automated birthday/anniversary campaigns |
| **Campaigns** | `POST` | `/api/campaigns/birthday/edit` | `edit_birthday_campaign` | Edit template text, timing, or sender on birthday campaign |
| **Verified Senders** | `POST` | `/api/verified-senders/verify` | `verify_phone` | Submit phone number for carrier sender ID verification |
| **Verified Senders** | `POST` | `/api/verified-senders/all` | `getVerifiedPhones` | List carrier-approved alphanumeric & numeric sender IDs |
| **Subscribers** | `POST` | `/api/subscribers/add` | `addSub` | Provision subordinate reseller sub-account |
| **Subscribers** | `POST` | `/api/subscribers/update-wallet` | `updateAmountSub` | Top up or adjust balance for a reseller sub-account |
| **Subscribers** | `POST` | `/api/subscribers/balances` | `getBlanceSubs` | Query credit balances across all provisioned sub-accounts |
| **Webhooks** | `POST` | `/api/webhooks/push-url/register` | `push_url` | Register server-side push callback URL with TextMe |
| **Webhooks** | `POST` | `/api/webhooks/delivery-report` | — | Ingest pushed real-time carrier delivery status callbacks |
| **Webhooks** | `POST` | `/api/webhooks/incoming-message` | — | Ingest pushed 2-way inbound SMS messages |
| **Webhooks** | `POST` | `/api/webhooks/blocklist-addition` | — | Ingest pushed opt-out / unsubscribe callbacks |
| **RPC Gateway** | `POST` | `/api/textme/call` | *dynamic* | Direct RPC proxy forwarding arbitrary payloads to live TextMe API |
| **RPC Gateway** | `POST` | `/api/textme/test` | *dynamic* | Dry-run RPC proxy validating arbitrary payloads against `/api/test` |

---

## Roadmap & Planned Enhancements

1. **Webhook Event Persistence & Forwarding**:
   - Currently, webhook endpoints log incoming DLR and inbound SMS payloads to console.
   - Introduce event queue (Redis / BullMQ) or webhook dispatcher to relay callbacks to the Polytech core application and update database records in real time.
2. **Service-to-Service (S2S) Security Hardening**:
   - Protect outbound endpoints with an `InternalAuthGuard` using `X-Internal-API-Key` or HMAC signatures to prevent unauthorized SMS dispatches.
3. **Carrier Rate Limiting & Throttling**:
   - Israeli telecom carriers enforce strict transactions-per-second (TPS) ceilings (typically 5–20 TPS).
   - Configure `@nestjs/throttler` and queue chunking to ensure smooth compliance.
4. **Interactive Swagger / OpenAPI Documentation**:
   - Integrate `@nestjs/swagger` at `/api/docs` alongside existing Postman and Newman test suites.

---

## Documentation & Postman

- **Architecture Deep-Dive**: See [architecture.md](file:///Users/almogram/Desktop/projects/polytech/textme-service/docs/architecture.md)
- **Getting Started & Setup from Scratch (TODO)**: See [todo.md](file:///Users/almogram/Desktop/projects/polytech/textme-service/docs/todo.md)
- **Postman Collection**: `postman/textme-service.postman_collection.json`
- **Newman Environment**: `postman/newman-environment.json`
