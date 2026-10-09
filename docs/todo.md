# TextMe Enterprise Service — Getting Started & Implementation Checklist (TODO)

This document provides a comprehensive, step-by-step checklist of everything required to get the **TextMe Enterprise Service** fully configured, verified, connected to TextMe's cellular gateway, and integrated with the Polytech platform.

> [!IMPORTANT]
> **Key Focus of this Guide**: In addition to local setup and verification, **Section 7** provides an exhaustive breakdown of **what needs to be built and configured from scratch** to turn this service from a stateless API adapter into a fully automated, rock-solid, production-grade telecom microservice.

---

## Table of Contents
1. [Prerequisites & System Requirements](#1-prerequisites--system-requirements)
2. [TextMe Commercial Account & Israeli Carrier Setup](#2-textme-commercial-account--israeli-carrier-setup)
3. [API Token Generation & Authentication Setup](#3-api-token-generation--authentication-setup)
4. [Environment & Security Configuration](#4-environment--security-configuration)
5. [Local Installation & Quality Assurance Verification](#5-local-installation--quality-assurance-verification)
6. [Setting Up Real-Time Push Webhooks From Scratch](#6-setting-up-real-time-push-webhooks-from-scratch)
7. [What Needs to be Built From Scratch to Make the Project Work Perfectly](#7-what-needs-to-be-built-from-scratch-to-make-the-project-work-perfectly)
8. [End-to-End Testing & Integration Workflow](#8-end-to-end-testing--integration-workflow)
9. [Production Readiness & Operational Checklist](#9-production-readiness--operational-checklist)

---

## 1. Prerequisites & System Requirements

- [ ] **Node.js**: Install Node.js v20.x or v22.x LTS.
  ```bash
  node -v # Must be >= 20.0.0
  ```
- [ ] **pnpm**: Ensure `pnpm` is installed globally (strict requirement; do not use npm or yarn).
  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  pnpm -v # Must be >= 9.x
  ```
- [ ] **Tunneling Tool (for local webhook testing)**: Install `ngrok` or `cloudflared` to expose local port `3001` to TextMe's push servers.
  ```bash
  ngrok --version # Or: cloudflared --version
  ```
- [ ] **OpenSSL**: For generating S2S secrets and HMAC encryption keys.
  ```bash
  openssl version
  ```

---

## 2. TextMe Commercial Account & Israeli Carrier Setup

TextMe is an Israeli cellular SMS gateway (`https://my.textme.co.il`). Because outbound SMS messages traverse Israeli mobile operators (Cellcom, Partner, Pelephone, HOT Mobile), the following commercial and regulatory steps are required:

### 2.1 Commercial Registration
- [ ] Register an enterprise account with [TextMe Israel](https://my.textme.co.il).
- [ ] Obtain commercial agreement and purchase an SMS message bundle (SMS credits, international credits, or virtual two-way phone numbers for incoming SMS).
- [ ] Secure account credentials:
  - Account Username (`TEXTME_USERNAME`)
  - Initial master password

### 2.2 Carrier Sender ID Verification (Israeli Regulatory Compliance)
Under Israeli Ministry of Communications (MoC / משרד התקשורת) anti-spam and spoofing regulations, senders must be carrier-approved:

- [ ] **Alphanumeric Sender ID (e.g., `Polytech`)**:
  - Submit company documentation and authorization letter to TextMe support desk.
  - Wait for cellular carriers (Cellcom, Partner, Pelephone, HOT Mobile) to approve the alphanumeric handle.
  - Set this handle as `TEXTME_SOURCE`.
- [ ] **Numeric Sender ID (Mobile Number e.g., `0501234567`)**:
  - Submit the phone number for programmatic verification:
    ```bash
    curl -X POST http://localhost:3001/api/verified-senders/verify \
      -H "Content-Type: application/json" \
      -d '{ "phone": "0501234567" }'
    ```
  - An OTP verification code will be sent to the handset; approve it to whitelist the number.
- [ ] **Verify Permitted Senders List**:
  - Run the query endpoint to confirm active authorized senders:
    ```bash
    curl -X POST http://localhost:3001/api/verified-senders/all \
      -H "Content-Type: application/json" \
      -d '{}'
    ```
  - Confirm your sender ID appears in the returned list.

---

## 3. API Token Generation & Authentication Setup

TextMe API uses Bearer token authentication. Tokens must be minted before making API calls:

- [ ] **Step 3.1: Mint New API Token**:
  - Call `/api/tokens/create` with your TextMe username:
    ```bash
    curl -X POST http://localhost:3001/api/tokens/create \
      -H "Content-Type: application/json" \
      -d '{ "username": "your_textme_username" }'
    ```
  - TextMe will issue a fresh Bearer token (note: this invalidates any prior token for this username).
- [ ] **Step 3.2: Store Token**:
  - Copy the returned token string into your configuration as `TEXTME_API_TOKEN`.
- [ ] **Step 3.3: Verify Active Token**:
  - Verify that the active token can be retrieved without invalidating it:
    ```bash
    curl -X POST http://localhost:3001/api/tokens/current \
      -H "Content-Type: application/json" \
      -d '{ "username": "your_textme_username" }'
    ```

---

## 4. Environment & Security Configuration

- [ ] Configure environment variables in your runtime settings or secrets manager:
  - `PORT`: HTTP port (`3001`)
  - `NODE_ENV`: Runtime mode (`development` or `production`)
  - `CORS_ORIGIN`: Allowed origins (`*`)
  - `TEXTME_BASE_URL`: Live TextMe endpoint (`https://my.textme.co.il`)
  - `TEXTME_TEST_URL`: Sandbox dry-run endpoint (`https://my.textme.co.il/api/test`)
  - `TEXTME_API_TOKEN`: Bearer token obtained in Step 3
  - `TEXTME_USERNAME`: Account username
  - `TEXTME_SOURCE`: Carrier-approved sender handle or verified phone
  - `TEXTME_IS_TEST_MODE`: Set to `true` for dry-run testing; `false` for live dispatch
  - `TEXTME_TIMEOUT_MS`: Network timeout in milliseconds (`30000`)
  - `INTERNAL_API_KEY`: Secret key for service-to-service protection

> [!TIP]
> **Start in Test Mode**: Keep `TEXTME_IS_TEST_MODE=true` initially. In test mode, all requests route to `https://my.textme.co.il/api/test` (dry-run). TextMe validates your JSON schema, headers, and credentials, but **does not send SMS or deduct your balance**. Once verified, switch to `false`.

---

## 5. Local Installation & Quality Assurance Verification

- [ ] **Install Dependencies**:
  ```bash
  pnpm install
  ```
- [ ] **Run TypeScript Compilation Check** (zero errors):
  ```bash
  pnpm run typecheck
  ```
- [ ] **Run Oxlint Code Quality Check** (zero warnings):
  ```bash
  pnpm run lint
  ```
  *(To automatically fix any formatting issues: `pnpm run lint:fix`)*
- [ ] **Run Unit Tests (Jest)**:
  ```bash
  pnpm test
  ```
  - Verify all 15 test suites and 48 unit tests pass with 100% green status.
- [ ] **Run E2E Tests (Jest / Supertest)**:
  ```bash
  pnpm run test:e2e
  ```
  - Verify all 7 HTTP integration tests pass.
- [ ] **Run E2E Tests (Playwright)**:
  ```bash
  pnpm run test:playwright
  ```
  - Verify all 5 Playwright end-to-end tests pass.
- [ ] **Run Postman / Newman Automated Suite**:
  - Open a second terminal and start the service:
    ```bash
    pnpm run start:dev
    ```
  - In your main terminal, run Newman:
    ```bash
    pnpm run test:newman
    ```
  - Verify all 35+ requests covering all 12 domains pass against the running instance.

---

## 6. Setting Up Real-Time Push Webhooks From Scratch

TextMe supports server-side push notifications for three critical asynchronous events:
1. **DLR (Delivery Reports)**: Real-time carrier delivery receipt updates (`status: 0` = delivered, `1` = failed, etc.).
2. **Inbound SMS (`incoming`)**: Two-way SMS received on virtual account numbers.
3. **Blocklist Opt-outs (`blacklist`)**: End-users replying with STOP/הסר keywords.

Because TextMe's servers push HTTP POST requests to your service, you must configure a publicly reachable HTTPS endpoint:

### 6.1 Expose Local Service via Tunnel (Development)
- [ ] Start ngrok or cloudflared pointing to port 3001:
  ```bash
  ngrok http 3001
  # Example output: https://abc123-your-tunnel.ngrok-free.app
  ```

### 6.2 Register Callback URLs with TextMe
- [ ] **Register DLR Push URL**:
  ```bash
  curl -X POST http://localhost:3001/api/webhooks/push-url/register \
    -H "Content-Type: application/json" \
    -d '{
      "type": "dlr",
      "url": "https://abc123-your-tunnel.ngrok-free.app/api/webhooks/delivery-report"
    }'
  ```
- [ ] **Register Inbound SMS Push URL**:
  ```bash
  curl -X POST http://localhost:3001/api/webhooks/push-url/register \
    -H "Content-Type: application/json" \
    -d '{
      "type": "incoming",
      "url": "https://abc123-your-tunnel.ngrok-free.app/api/webhooks/incoming-message"
    }'
  ```
- [ ] **Register Opt-Out / Blocklist Push URL**:
  ```bash
  curl -X POST http://localhost:3001/api/webhooks/push-url/register \
    -H "Content-Type: application/json" \
    -d '{
      "type": "blacklist",
      "url": "https://abc123-your-tunnel.ngrok-free.app/api/webhooks/blocklist-addition"
    }'
  ```

---

## 7. What Needs to be Built From Scratch to Make the Project Work Perfectly

While `textme-service` provides complete controller-to-client coverage of all 30 TextMe operations, **the following critical architectural components must be implemented from scratch** to achieve enterprise-level production stability, data persistence, and security:

### 7.1 Gap 1: Webhook Event Persistence & Forwarding Pipeline (CRITICAL)
- **Problem**: Right now, `src/webhooks/webhooks.service.ts` only logs incoming DLR, inbound SMS, and blocklist events to `this.logger.log()` and returns `{ received: true }`. If the process restarts or logs roll over, all carrier delivery confirmations and inbound customer messages are lost forever!
- **Tasks to implement from scratch**:
  - [ ] **Option A: Outbound Webhook Relay / Dispatcher**:
    - Build a forwarding service in `src/webhooks/` that takes the incoming DLR or inbound SMS and immediately POSTs it to the core Polytech backend (`https://core.polytech.co.il/api/v1/telecom/webhooks/events`).
    - Sign outgoing requests using HMAC-SHA256 (`x-webhook-signature`) and include retry logic with exponential backoff if the core backend is temporarily unreachable.
  - [ ] **Option B: Asynchronous Queue (Redis + BullMQ)**:
    - Install `bullmq` and `@nestjs/bullmq`.
    - Ingest webhooks within 20ms by enqueuing them to a `textme-events` queue.
    - Create a worker processor to store messages in MongoDB/PostgreSQL and update outbound message statuses.
  - [ ] **Option C: Direct Database Persistence (Mongoose / Prisma)**:
    - Add database schemas:
      - `DlrReceipt`: `external_id`, `status`, `phone`, `operator`, `date`, `he_message`.
      - `IncomingMessage`: `phone`, `dest`, `message`, `date`.
      - `OptOutRecord`: `dest`, `message`, `date`.

### 7.2 Gap 2: Service-to-Service (S2S) Security & Endpoint Protection (CRITICAL)
- **Problem**: Currently, all endpoints (`/api/sms/send`, `/api/sms/bulk`, `/api/otp/send`, `/api/subscribers/*`) are completely unauthenticated. Anyone with network access can send SMS messages, spend real money, top up reseller wallets, or delete contact lists.
- **Tasks to implement from scratch**:
  - [ ] Implement an `InternalAuthGuard` (matching MailBridge's architecture):
    - Check for an `X-Internal-API-Key` header matching your configured secret key.
    - Apply the guard globally via `APP_GUARD` or specifically across outbound business controllers (`sms`, `otp`, `subscribers`, `campaigns`, `contact-lists`).
  - [ ] Exempt public/telecom endpoints:
    - Mark `/api/health` as public.
    - Secure `/api/webhooks/*` using an IP whitelist of TextMe's server IPs or a secret token query parameter (e.g., `?token=YOUR_WEBHOOK_SECRET`).

### 7.3 Gap 3: Token Storage & Dynamic Multi-Tenant Management
- **Problem**: Currently, `TEXTME_API_TOKEN` is statically configured. When calling `/api/tokens/create`, TextMe mints a new token and invalidates the old one, but the new token is not automatically persisted to configuration or storage.
- **Tasks to implement from scratch**:
  - [ ] Create a `CredentialsRepository` and database schema (similar to MailBridge) storing `{ organizationId, username, encryptedApiToken, defaultSource, isActive }`.
  - [ ] Encrypt tokens at rest using AES-256-GCM (`CryptoService`).
  - [ ] Automatically update stored credentials whenever `POST /api/tokens/create` succeeds.
  - [ ] Support multi-tenant credential resolution based on an incoming `organizationId` header or query parameter.

### 7.4 Gap 4: Rate Limiting & Carrier TPS Throttling (Carrier Compliance)
- **Problem**: Israeli cellular carriers impose strict transactions-per-second (TPS) limits on SMS sender IDs (typically 10–20 TPS). If a caller sends 500 SMS at once via bulk or parallel loops, carriers will throttle, drop messages, or temporarily block the sender ID.
- **Tasks to implement from scratch**:
  - [ ] Activate `@nestjs/throttler` (already declared in `package.json`):
    - Configure `ThrottlerModule.forRoot([{ ttl: 1000, limit: 15 }])` in `AppModule`.
  - [ ] Implement batch chunking and pacing inside `SmsService.sendBulk`:
    - Automatically split large batches (> 250 messages) into sub-chunks.
    - Dispatch chunks with a 1,000ms delay between batches to respect carrier buffers.

### 7.5 Gap 5: Automated Account Balance & Low-Credit Alarms
- **Problem**: Balance can currently only be queried on demand via `/api/balance/query`. If credits run out, customer OTPs and critical transactional SMS will fail silently with status `4` (`NOT_ENOUGH_CREDIT`).
- **Tasks to implement from scratch**:
  - [ ] Install `@nestjs/schedule` to run a recurring hourly cron job:
    ```typescript
    @Cron('0 * * * *')
    async checkBalanceThreshold() { ... }
    ```
  - [ ] If balance falls below a configurable threshold (e.g., 500 SMS units), emit an alert notification (via Slack webhook, email, or alert event) to company administrators.

### 7.6 Gap 6: Interactive OpenAPI / Swagger Documentation
- **Problem**: API documentation is currently restricted to Postman collections. Developers cannot inspect and try endpoints interactively in the browser.
- **Tasks to implement from scratch**:
  - [ ] Install `@nestjs/swagger` and `swagger-ui-express`:
    ```bash
    pnpm add @nestjs/swagger swagger-ui-express
    ```
  - [ ] Configure Swagger bootstrap in `src/main.ts`:
    ```typescript
    const config = new DocumentBuilder()
      .setTitle('TextMe Enterprise API')
      .setDescription('Polytech Telecom & SMS Gateway')
      .setVersion('1.0')
      .addApiKey({ type: 'apiKey', name: 'x-internal-api-key', in: 'header' }, 'x-internal-api-key')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    ```
  - [ ] Annotate DTOs with `@ApiProperty()` and controllers with `@ApiTags()`.

---

## 8. End-to-End Testing & Integration Workflow

The following sequential workflows demonstrate how to interact with the service:

### 8.1 Health Telemetry
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

### 8.2 Check Account Balance
```bash
curl -X POST http://localhost:3001/api/balance/query \
  -H "Content-Type: application/json" \
  -d '{ "type": "sms" }'
```
Expected response:
```json
{
  "status": 0,
  "message": "OK",
  "message_he": "הפעולה בוצעה בהצלחה",
  "balance": "1450"
}
```

### 8.3 Dry-Run Test SMS (Zero Credits Charged)
Test your message schema and credentials safely against TextMe's `/api/test`:
```bash
curl -X POST http://localhost:3001/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Polytech",
    "destinations": { "phone": "0501234567" },
    "message": "בדיקת מערכת TextMe - הודעת בדיקה בלבד"
  }'
```

### 8.4 Live Single SMS with Merge Fields & Unsubscribe
```bash
curl -X POST http://localhost:3001/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Polytech",
    "destinations": {
      "phone": [
        { "phone": "0501234567", "id": "ORDER-991" }
      ]
    },
    "message": "שלום [df1], הזמנתך מספר [df2] נשלחה בהצלחה!",
    "add_dynamic": {
      "df1": "ישראל",
      "df2": "991"
    },
    "add_unsubscribe": "true",
    "tag": "order_updates"
  }'
```

### 8.5 OTP Generation and Validation Lifecycle
1. **Send OTP Code**:
```bash
curl -X POST http://localhost:3001/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0501234567",
    "source": "Polytech",
    "valid_time": 5,
    "max_tries": 3
  }'
```
2. **Validate Code Entered by User**:
```bash
curl -X POST http://localhost:3001/api/otp/validate \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0501234567",
    "code": "849201"
  }'
```

### 8.6 Query Delivery Reports (DLR)
```bash
curl -X POST http://localhost:3001/api/reports/dlr \
  -H "Content-Type: application/json" \
  -d '{
    "external_ids": ["ORDER-991"],
    "from": "2026-10-01 00:00:00",
    "to": "2026-10-09 23:59:59"
  }'
```
Expected response:
```json
{
  "status": 0,
  "message": "OK",
  "message_he": "הפעולה בוצעה בהצלחה",
  "transactions": [
    {
      "external_id": "ORDER-991",
      "status": 0,
      "he_message": "נמסר",
      "en_message": "Delivered",
      "phone": "0501234567",
      "date": "2026-10-09 09:12:04"
    }
  ]
}
```

### 8.7 Blacklist Management (Opt-Outs)
- **Add number to blacklist**:
```bash
curl -X POST http://localhost:3001/api/blacklist/add \
  -H "Content-Type: application/json" \
  -d '{ "phones": ["0501234567"] }'
```
*(TextMe returns `status: 946`, automatically mapped by the service as success with Hebrew message: `"מספר הטלפון נוסף לרשימה השחורה"`)*

- **Remove number from blacklist (mandatory reason)**:
```bash
curl -X POST http://localhost:3001/api/blacklist/remove \
  -H "Content-Type: application/json" \
  -d '{
    "phones": ["0501234567"],
    "reason": "Customer opted back in via support ticket #441"
  }'
```

---

## 9. Production Readiness & Operational Checklist

- [ ] **SSL / TLS Termination**: Ensure production traffic runs behind HTTPS (required for TextMe webhook push callbacks).
- [ ] **Reverse Proxy / Ingress**: Configure Nginx, Caddy, or Traefik with appropriate keep-alive and request timeout headers (30s+).
- [ ] **Switch off Test Mode**: Set `TEXTME_IS_TEST_MODE=false` in production runtime settings.
- [ ] **S2S API Key Configured**: Ensure `INTERNAL_API_KEY` is set to a cryptographically secure 32-byte hex secret and enforced via `InternalAuthGuard`.
- [ ] **Webhook Endpoint Registration**: Verify all 3 push URLs (`dlr`, `incoming`, `blacklist`) are registered with production domain URLs.
- [ ] **Kubernetes / Docker Liveness & Readiness Probes**:
  - Liveness probe: `GET /api/health` (HTTP 200).
  - Readiness probe: `GET /api/health` (HTTP 200).
- [ ] **Credit Balance Monitoring**: Verify automated balance alerting is active to prevent quota exhaustion.
- [ ] **Carrier Sender Whitelisting**: Confirm all alphanumeric sender handles are approved by Israeli telecom operators.
- [ ] **Log Sanitization**: Ensure customer phone numbers and OTP passcodes are masked in persistent application logs in compliance with privacy regulations.
