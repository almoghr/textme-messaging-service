# TextMe Enterprise Service

A high-performance, fully generic, type-safe NestJS microservice integrating the complete [TextMe API](https://docs.textme.co.il/).

Built following enterprise clean architecture and Polytech Engineering Guidelines, this service provides dedicated RESTful endpoints, full DTO validation, centralized constants, structured error management, and an RPC gateway proxying arbitrary TextMe payloads with dry-run support.

---

## Features

- **Complete API Coverage (All 30 Operations & Webhooks)**:
  - **Tokens**: Mint new tokens (`new`) and retrieve current active tokens (`current`) via `getApiToken`.
  - **SMS**: Single send (`sms`) with recipient array, external IDs, dynamic merge fields (`df1`..`df6`), timing schedule, link shortener, unsubscribe footer, temp blocklist filter. Bulk send (`bulk`) up to 2,500 distinct messages.
  - **OTP**: Code generation & transmission (`send_otp`), verification (`validate_otp`) with max attempts and validity window.
  - **Balance**: Account balance query (`balance`) for SMS, international, or mail credits.
  - **Reports**: Delivery receipts by external ID (`dlr`), delivery receipts across date range (`dlrByDate`), incoming messages received (`incoming`).
  - **Blacklist**: Query blocklist within date range (`blacklist`), add numbers (`addNumBL` with `946` success mapping), remove numbers with required reason (`rmNumBL` with `944` partial success mapping).
  - **Contact Lists**: Create lists with dynamic contacts (`newCL`), delete lists (`removeCL`), add/remove recipient numbers (`addNumCL`, `rmNumCL`), get all lists (`getCL`), get list members (`getCLbyID`).
  - **Campaigns**: Cancel scheduled campaigns by ID or name (`cancel`), list birthday campaigns (`get_birthday_campaigns`), edit birthday campaign message (`edit_birthday_campaign`).
  - **Verified Senders**: Submit phone numbers for sender verification (`verify_phone`), list verified senders with sub-account flag (`getVerifiedPhones`).
  - **Subscribers (Reseller)**: Create sub-account (`addSub`), credit sub-account wallet (`updateAmountSub`), get balances across all sub-accounts (`getBlanceSubs`).
  - **Push API & Webhooks**: Register push URL (`push_url`), and receive callbacks for DLR (`onDeliveryReport`), incoming messages (`onIncomingMessage`), and blocklist additions (`onBlocklistAddition`).
  - **Generic RPC Gateway**: Direct live dispatch (`/api/textme/call`) and dry-run validation (`/api/textme/test`).

- **Strict Type Safety & Zero Magic Numbers/Strings**:
  - All status codes, headers, URLs, timeouts, DLR statuses, and validation messages are defined in dedicated `constants/` files.
  - TypeScript strict mode with no `any`.

- **Dual-Environment Architecture (Development & Production)**:
  - Powered by `@nestjs/config` supporting both development and production configurations.
  - Automatic base URL and test endpoint resolution.
  - Global CORS with origin parsing.

- **Resilience & Fault Tolerance**:
  - Configurable timeouts and exponential backoff retry loop for transient network or server errors.
  - `TextMeApiException` and global `TextMeExceptionFilter` preserving status codes, messages, and raw responses.

---

## Architecture & Directory Layout

```
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── config/
│   ├── config.constants.ts
│   └── textme.config.ts
├── common/
│   ├── constants/
│   │   ├── api.constants.ts
│   │   ├── status-codes.constants.ts
│   │   ├── dlr-statuses.constants.ts
│   │   └── validation-messages.constants.ts
│   ├── dto/
│   │   ├── base-response.dto.ts
│   │   └── textme-user.dto.ts
│   └── errors/
│       ├── textme-api.exception.ts
│       └── textme-exception.filter.ts
├── textme-client/
│   ├── textme-client.module.ts
│   ├── textme-client.service.ts
│   └── textme-client.types.ts
├── tokens/
├── sms/
├── otp/
├── balance/
├── reports/
├── blacklist/
├── contact-lists/
├── campaigns/
├── verified-senders/
├── subscribers/
├── webhooks/
└── rpc/
```

---

## Environment Configuration

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP port for the NestJS server | `3001` |
| `NODE_ENV` | Runtime environment (`development`, `production`, `test`) | `development` |
| `TEXTME_BASE_URL` | Base URL for TextMe production API | `https://my.textme.co.il` |
| `TEXTME_TEST_URL` | Base URL for TextMe dry-run test endpoint | `https://my.textme.co.il/api/test` |
| `TEXTME_API_TOKEN` | Bearer token for authenticating calls | *None (override per request or set in config)* |
| `TEXTME_USERNAME` | Default account username | *None (override per request or set in config)* |
| `TEXTME_SOURCE` | Default verified sender phone / ID | *None* |
| `TEXTME_IS_TEST_MODE` | Route all API calls to `/api/test` dry run | `false` |
| `TEXTME_TIMEOUT_MS` | HTTP timeout in milliseconds | `30000` |
| `CORS_ORIGIN` | Allowed CORS origin(s) | `*` |

---

## Endpoints Overview

| Domain | Method | Path | TextMe Root Key | Description & Detailed Route Explanation |
|---|---|---|---|---|
| **Health** | `GET` | `/api/health` | - | **Health & Runtime Telemetry**: Verifies microservice operational status, active runtime environment, test mode state, and current ISO timestamp with Hebrew translation. |
| **Tokens** | `POST` | `/api/tokens/create` | `getApiToken` (`new`) | **Mint New API Token**: Requests TextMe to issue a fresh API bearer token for the target username, invalidating any previously issued active token. |
| **Tokens** | `POST` | `/api/tokens/current` | `getApiToken` (`current`) | **Get Active API Token**: Retrieves the currently valid, non-expired API bearer token registered under the target username without re-issuing. |
| **SMS** | `POST` | `/api/sms/send` | `sms` | **Single SMS Dispatch**: Sends a text message to one or more recipient numbers or contact lists, supporting dynamic tags (`df1`..`df6`), link shortening, timing, and unsubscribe footers. |
| **SMS** | `POST` | `/api/sms/bulk` | `bulk` | **High-Volume Bulk SMS**: Transmits up to 2,500 distinct, personalized messages with individual destinations and custom message bodies in a single batch. |
| **OTP** | `POST` | `/api/otp/send` | `send_otp` | **Transmit OTP Code**: Dispatches a one-time numerical passcode via SMS to a destination phone, configuring code expiration window and maximum retry attempts. |
| **OTP** | `POST` | `/api/otp/validate` | `validate_otp` | **Validate OTP Code**: Verifies the numerical passcode entered by an end-user against TextMe's OTP verification engine to authenticate the identity. |
| **Balance** | `POST` | `/api/balance/query` | `balance` | **Query Account Balance**: Inspects remaining units and quota across SMS credits, international messaging, or email credits for the master account or sub-user. |
| **Reports** | `POST` | `/api/reports/dlr` | `dlr` | **Delivery Receipts by External IDs**: Pulls carrier delivery receipts and status updates for specific external transaction IDs over a 7-day query window. |
| **Reports** | `POST` | `/api/reports/dlr-by-date` | `dlrByDate` | **Delivery Receipts by Date Range**: Retrieves all carrier delivery reports and final statuses for messages transmitted across a specified date/time interval. |
| **Reports** | `POST` | `/api/reports/incoming` | `incoming` | **Inbound SMS Log**: Pulls received two-way SMS messages received on virtual numbers assigned to the account within a specified date window. |
| **Blacklist** | `POST` | `/api/blacklist/query` | `blacklist` | **Query Blocklist**: Fetches the list of phone numbers currently blocked from receiving SMS within a defined registration date interval. |
| **Blacklist** | `POST` | `/api/blacklist/add` | `addNumBL` | **Add to Blocklist**: Enrolls phone numbers into the do-not-contact blocklist to block future dispatches (mapped automatically to success code `946`). |
| **Blacklist** | `POST` | `/api/blacklist/remove` | `rmNumBL` | **Remove from Blocklist**: Unblocks phone numbers from the blacklist with a required justification reason string (supports partial removal code `944`). |
| **Contact Lists** | `POST` | `/api/contact-lists/create` | `newCL` | **Create Contact Lists**: Provisions new distribution contact lists with optional pre-loaded member numbers and dynamic fields (`df1`..`df6`). |
| **Contact Lists** | `POST` | `/api/contact-lists/remove` | `removeCL` | **Delete Contact Lists**: Permanently deletes one or more distribution contact lists and clears their member associations by list IDs. |
| **Contact Lists** | `POST` | `/api/contact-lists/add-numbers` | `addNumCL` | **Append Recipients to List**: Adds recipient phone numbers and custom merge field attributes to existing contact lists without clearing prior data. |
| **Contact Lists** | `POST` | `/api/contact-lists/remove-numbers` | `rmNumCL` | **Remove Recipients from List**: Deletes specified recipient phone numbers from existing contact lists while retaining remaining contacts. |
| **Contact Lists** | `POST` | `/api/contact-lists/all` | `getCL` | **List All Contact Lists**: Fetches metadata, list names, recipient counts, and creation dates for all contact lists belonging to the account. |
| **Contact Lists** | `POST` | `/api/contact-lists/by-id` | `getCLbyID` | **Get Contact List Members**: Retrieves full member records, phone numbers, and dynamic variables for a specific contact list by its numeric list ID. |
| **Campaigns** | `POST` | `/api/campaigns/cancel-by-id` | `cancel` | **Cancel Campaign by ID**: Cancels and aborts a scheduled, pending broadcast campaign before its scheduled dispatch time using its numeric ID. |
| **Campaigns** | `POST` | `/api/campaigns/cancel-by-name` | `cancel` | **Cancel Campaign by Name**: Cancels all pending scheduled message broadcasts matching a specified campaign name handle. |
| **Campaigns** | `POST` | `/api/campaigns/birthday` | `get_birthday_campaigns` | **List Birthday Campaigns**: Pulls all automated recurring birthday and anniversary campaign configurations configured on the account. |
| **Campaigns** | `POST` | `/api/campaigns/birthday/edit` | `edit_birthday_campaign` | **Edit Birthday Campaign**: Modifies the message template, dispatch timing, or sender name of an active recurring birthday campaign. |
| **Verified Senders** | `POST` | `/api/verified-senders/verify` | `verify_phone` | **Initiate Sender Verification**: Submits an originator phone number to undergo carrier sender ID verification via SMS confirmation code. |
| **Verified Senders** | `POST` | `/api/verified-senders/all` | `getVerifiedPhones` | **List Verified Senders**: Retrieves all carrier-approved numerical and alphanumeric sender IDs permitted for outbound transmission. |
| **Subscribers** | `POST` | `/api/subscribers/add` | `addSub` | **Provision Sub-Account**: Registers a subordinate reseller sub-account with distinct login credentials, source sender, and initial message quota. |
| **Subscribers** | `POST` | `/api/subscribers/update-wallet` | `updateAmountSub` | **Update Sub-Account Wallet**: Tops up or adjusts the message units or monetary balance assigned to a specific reseller sub-account. |
| **Subscribers** | `POST` | `/api/subscribers/balances` | `getBlanceSubs` | **Query Sub-Account Balances**: Retrieves current credit balances, usage limits, and account status across all provisioned reseller sub-accounts. |
| **Webhooks** | `POST` | `/api/webhooks/push-url/register` | `push_url` | **Register Push Callback URL**: Configures TextMe server-side webhooks to push live events for DLR, inbound SMS, or blacklist additions to a callback URL. |
| **Webhooks** | `POST` | `/api/webhooks/delivery-report` | - | **Ingest Delivery Report Webhook**: Receives and processes pushed real-time delivery status updates from TextMe containing external IDs and carrier codes. |
| **Webhooks** | `POST` | `/api/webhooks/incoming-message` | - | **Ingest Inbound Message Webhook**: Receives and processes pushed inbound SMS messages sent by mobile users to virtual account numbers. |
| **Webhooks** | `POST` | `/api/webhooks/blocklist-addition` | - | **Ingest Opt-Out Webhook**: Receives and processes pushed opt-out / unsubscribe callbacks triggered when an end-user texts an opt-out keyword. |
| **RPC Gateway** | `POST` | `/api/textme/call` | *dynamic* | **Live RPC Proxy Gateway**: Forwards arbitrary XML/JSON payload objects directly to the live TextMe API with automatic authentication and Hebrew translation. |
| **RPC Gateway** | `POST` | `/api/textme/test` | *dynamic* | **Dry-Run RPC Proxy Gateway**: Dispatches arbitrary payloads to `/api/test` to validate structure, syntax, and credentials without deducting balance or sending SMS. |

### Detailed Route Explanations by Domain

- **Health (`/api/health`)**:
  - `GET /api/health` — Returns runtime telemetry (status, service name, active environment, test mode, timestamp) accompanied by a Hebrew status translation (`"המערכת פועלת כסדרה"`).
- **Authentication & Tokens (`/api/tokens/*`)**:
  - `POST /api/tokens/create` — Submits `{ username, user? }` with `action: new` to issue a fresh API token from TextMe.
  - `POST /api/tokens/current` — Submits `{ username, user? }` with `action: current` to look up the currently active API token for the user.
- **SMS Transmission (`/api/sms/*`)**:
  - `POST /api/sms/send` — Sends a single SMS to individual numbers or contact lists, supporting dynamic tags (`df1`..`df6`), link shortening, timing, and unsubscribe footers.
  - `POST /api/sms/bulk` — Transmits high-volume batches (up to 2,500 distinct messages) with per-message custom text, sender IDs, and links.
- **OTP Verification (`/api/otp/*`)**:
  - `POST /api/otp/send` — Generates and dispatches a numerical OTP code to a recipient phone with configurable validity period and max tries.
  - `POST /api/otp/validate` — Validates the received passcode against TextMe to authenticate the end-user.
- **Account Balance (`/api/balance/*`)**:
  - `POST /api/balance/query` — Inquires account message balance for SMS, international messaging, or email credits.
- **Delivery Reports & Inbound (`/api/reports/*`)**:
  - `POST /api/reports/dlr` — Queries delivery status for one or more transaction references (`external_id`) within a 7-day window.
  - `POST /api/reports/dlr-by-date` — Pulls historical delivery statuses for all messages dispatched between two specified date-time stamps.
  - `POST /api/reports/incoming` — Fetches inbound messages received on virtual numbers between two specified date-time stamps.
- **Blacklist Management (`/api/blacklist/*`)**:
  - `POST /api/blacklist/query` — Lists all blocked numbers added within the specified date window.
  - `POST /api/blacklist/add` — Adds target phone numbers to the account blacklist (automatically handling TextMe's `946` success code).
  - `POST /api/blacklist/remove` — Removes numbers from the blacklist with a mandatory reason string (handling `944` partial deletion).
- **Contact Lists (`/api/contact-lists/*`)**:
  - `POST /api/contact-lists/create` — Creates new recipient lists with optional pre-loaded member numbers and dynamic fields.
  - `POST /api/contact-lists/remove` — Deletes existing contact lists by list IDs.
  - `POST /api/contact-lists/add-numbers` — Appends phone numbers and dynamic fields to existing contact lists.
  - `POST /api/contact-lists/remove-numbers` — Removes specific phone numbers from contact lists.
  - `POST /api/contact-lists/all` — Queries metadata, member counts, and creation dates for all account contact lists.
  - `POST /api/contact-lists/by-id` — Retrieves detailed contact list member entries and dynamic fields for a specific list ID.
- **Campaign Automation (`/api/campaigns/*`)**:
  - `POST /api/campaigns/cancel-by-id` — Cancels a scheduled SMS broadcast prior to its dispatch time using its numeric campaign ID.
  - `POST /api/campaigns/cancel-by-name` — Cancels all pending scheduled message broadcasts matching a campaign name.
  - `POST /api/campaigns/birthday` — Lists all recurring birthday and anniversary campaign automation rules.
  - `POST /api/campaigns/birthday/edit` — Updates the template text, dispatch hour, or sender ID of an existing birthday campaign.
- **Verified Senders (`/api/verified-senders/*`)**:
  - `POST /api/verified-senders/verify` — Initiates sender verification for an originator phone number.
  - `POST /api/verified-senders/all` — Retrieves all authorized and carrier-verified sender IDs for the account.
- **Reseller Sub-Accounts (`/api/subscribers/*`)**:
  - `POST /api/subscribers/add` — Provisions a new sub-account with designated username, password, display name, and initial balance.
  - `POST /api/subscribers/update-wallet` — Updates credit balance or monetary wallet for a designated sub-account.
  - `POST /api/subscribers/balances` — Queries live balances for all sub-accounts under reseller management.
- **Webhooks & Ingest (`/api/webhooks/*`)**:
  - `POST /api/webhooks/push-url/register` — Registers server-side push callback URLs with TextMe for DLR, inbound SMS, or blacklist feeds.
  - `POST /api/webhooks/delivery-report` — Webhook endpoint ingesting real-time carrier delivery receipt callbacks.
  - `POST /api/webhooks/incoming-message` — Webhook endpoint ingesting pushed inbound two-way SMS messages.
  - `POST /api/webhooks/blocklist-addition` — Webhook endpoint ingesting pushed opt-out / unsubscribe callbacks.
- **Generic RPC Gateway (`/api/textme/*`)**:
  - `POST /api/textme/call` — Proxies arbitrary XML/JSON payload objects directly to the live TextMe API with automatic authentication injection, retry handling, and Hebrew translation.
  - `POST /api/textme/test` — Validates arbitrary payload structures on `/api/test` dry run without sending SMS or deducting credits.

---

## Scripts & Quality Assurance

All commands use `pnpm`:

```bash
# Typecheck
pnpm run typecheck

# Lint (Oxlint)
pnpm run lint
pnpm run lint:fix

# Unit Tests (Jest)
pnpm test

# E2E Tests (Jest / Supertest)
pnpm run test:e2e

# E2E Tests (Playwright)
pnpm run test:playwright

# Postman Newman E2E
pnpm run test:newman

# Build Production Bundle
pnpm run build

# Start Development Server
pnpm run start:dev

# Start Production Server
pnpm run start:prod
```
