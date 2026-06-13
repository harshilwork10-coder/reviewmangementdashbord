# Backend Architecture - Service Design, Folder Structure, Business Logic, Queues & Operational Standards

This document defines the complete backend architecture for the **ReviewManagement** SaaS platform including service design, folder structure, repository pattern, business logic standards, queue architecture, notification processing, error handling, logging, performance, and security.

---

## 1. Backend Vision

* **Multi-Tenant Scalability**: Support thousands of businesses from a single platform instance using row-level PostgreSQL isolation.
* **Separation of Concerns**: Business logic is strictly separated from infrastructure logic — no database queries in controllers, no direct third-party API calls from the UI layer.
* **Future-Proof Design**: Service boundaries are defined to support future integrations (CRMs, ERP systems, third-party marketplaces) and enterprise features (SSO, white-labeling, multi-region) without architectural changes.

---

## 2. Recommended Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Runtime | **Node.js 20 LTS** | JavaScript runtime |
| Framework | **NestJS** | Modular server-side framework with DI |
| Database | **PostgreSQL 15** | Primary relational store with RLS |
| Cache | **Redis 7** | Session store, job queues, cache layer |
| Payments | **Stripe SDK** | Subscription billing and webhook handling |
| SMS | **Twilio SDK** | SMS review request delivery |
| Email | **Resend SDK** | Transactional email delivery |
| Queue | **BullMQ (Redis)** | Background job processing |
| Validation | **Zod / class-validator** | DTO schema validation |
| ORM | **Drizzle ORM / Prisma** | Type-safe database access layer |
| Testing | **Jest + Supertest** | Unit and integration testing |
| Docs | **Swagger / OpenAPI** | Auto-generated API documentation |

---

## 3. Project Folder Structure

```
/src
├── /auth               # JWT auth, refresh tokens, email verification
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── strategies/     # Passport JWT strategy
│   └── guards/         # JwtAuthGuard, RolesGuard
│
├── /users              # User CRUD, profile management
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.repository.ts
│   ├── dto/            # CreateUserDto, UpdateUserDto
│   └── users.module.ts
│
├── /businesses         # Business profile, review links, location settings
│   ├── businesses.controller.ts
│   ├── businesses.service.ts
│   ├── businesses.repository.ts
│   ├── dto/
│   └── businesses.module.ts
│
├── /customers          # Customer list, import CSV, communication history
│   ├── customers.controller.ts
│   ├── customers.service.ts
│   ├── customers.repository.ts
│   ├── dto/
│   └── customers.module.ts
│
├── /campaigns          # Campaign builder, scheduling, execution
│   ├── campaigns.controller.ts
│   ├── campaigns.service.ts
│   ├── campaigns.repository.ts
│   ├── dto/
│   └── campaigns.module.ts
│
├── /reviews            # Review ingestion, sync, monitoring
│   ├── reviews.controller.ts
│   ├── reviews.service.ts
│   ├── reviews.repository.ts
│   ├── dto/
│   └── reviews.module.ts
│
├── /reports            # Reporting queries, aggregations, PDF/CSV export
│   ├── reports.controller.ts
│   ├── reports.service.ts
│   ├── reports.repository.ts
│   └── reports.module.ts
│
├── /billing            # Stripe subscriptions, webhooks, invoices
│   ├── billing.controller.ts
│   ├── billing.service.ts
│   ├── billing.repository.ts
│   ├── dto/
│   └── billing.module.ts
│
├── /common             # Shared utilities across all modules
│   ├── /decorators     # Custom route decorators (@Roles, @CurrentUser)
│   ├── /filters        # Global exception filters
│   ├── /guards         # RolesGuard, SubscriptionGuard
│   ├── /interceptors   # LoggingInterceptor, TransformInterceptor
│   ├── /middleware      # Rate limiting, request ID injection
│   ├── /pipes          # ValidationPipe, ParseUUIDPipe
│   └── /utils          # Helpers (pagination, date formatting, CSV parser)
│
├── /jobs               # BullMQ background job processors
│   ├── email.processor.ts
│   ├── sms.processor.ts
│   ├── campaign.processor.ts
│   ├── report.processor.ts
│   └── webhook.processor.ts
│
├── app.module.ts       # Root module: imports all feature modules
└── main.ts             # Bootstrap: Swagger, global pipes, CORS, Helmet
```

---

## 4. Service Architecture

### 4.1 Layer Responsibilities

```
Request → Controller → Service → Repository → Database (PostgreSQL)
                    ↓
                 Jobs (BullMQ via Redis)
                    ↓
              Notification Service (Resend / Twilio)
```

| Layer | Responsibility | Rule |
| :--- | :--- | :--- |
| **Controller** | Route handling, request parsing, response formatting | No business logic. No DB access. |
| **Service** | Business logic, orchestration, workflow coordination | No SQL. Uses repositories only. |
| **Repository** | Database queries via ORM | Only place SQL/ORM queries are written. |
| **DTO** | Input validation schema definitions | Validated via class-validator / Zod. |
| **Guard** | JWT verification and RBAC role enforcement | Applied at controller or route level. |

### 4.2 Services Overview

| Service | Responsibility | Key Dependencies |
| :--- | :--- | :--- |
| **Authentication Service** | Registration, login, JWT issuance, refresh, password reset | Users, Redis |
| **Business Service** | Business CRUD, Google link management, location settings | Organizations, Users |
| **Customer Service** | Customer CRUD, CSV import, segmentation, tagging | Businesses |
| **Campaign Service** | Campaign creation, scheduling, triggering job queues | Customers, BullMQ |
| **Review Service** | Review ingestion from platforms, rating aggregation | Businesses, Google API |
| **Reporting Service** | Aggregation queries, chart data, PDF/CSV export generation | Reviews, Campaigns |
| **Billing Service** | Stripe subscription management, webhook handling, invoice sync | Organizations, Stripe |
| **Notification Service** | Email/SMS dispatch, delivery tracking, retry logic | Resend SDK, Twilio SDK |

---

## 5. Repository Pattern Standards

```typescript
// Example: CampaignsRepository
@Injectable()
export class CampaignsRepository {
  constructor(private readonly db: DatabaseService) {}

  async findById(campaignId: string): Promise<Campaign | null> {
    return this.db.campaigns.findUnique({ where: { campaign_id: campaignId } });
  }

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    return this.db.campaigns.create({ data: dto });
  }

  async findByBusiness(businessId: string, page: number, limit: number): Promise<Campaign[]> {
    return this.db.campaigns.findMany({
      where: { business_id: businessId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: 'desc' },
    });
  }
}
```

---

## 6. Business Logic Standards

* **No database queries in controllers**: Controllers only call service methods and return responses.
* **No direct API calls from UI**: All third-party calls (Stripe, Twilio, Google) are made exclusively from the service/repository layer.
* **Use service layer for workflows**: Complex multi-step operations (e.g., campaign launch = validate → enqueue → update status → audit log) are coordinated in services.
* **Reusable code modules**: Common utilities (pagination, CSV parsing, UUID validation, date formatters) live in `/src/common/utils` and are imported rather than duplicated.
* **DTOs on every endpoint**: Every POST and PUT endpoint must have a corresponding DTO class with validation decorators before hitting the service layer.

---

## 7. Queue & Background Jobs Architecture

Queues are powered by **BullMQ** backed by **Redis**. Each queue runs in an isolated processor.

| Queue Name | Trigger | Processor | Retry Policy |
| :--- | :--- | :--- | :--- |
| `email-queue` | Campaign launch / review request | `email.processor.ts` → Resend SDK | 3 retries, exponential backoff |
| `sms-queue` | Campaign launch / review request | `sms.processor.ts` → Twilio SDK | 3 retries, exponential backoff |
| `campaign-queue` | Scheduled campaign execution | `campaign.processor.ts` | 1 retry, alert on failure |
| `report-queue` | On-demand report generation | `report.processor.ts` | 2 retries |
| `webhook-queue` | Stripe / Google webhook events | `webhook.processor.ts` | 5 retries, 1min delay |

### Job Lifecycle
```
Campaign Launched
  → campaign-queue (validate, expand audience)
  → email-queue / sms-queue (per customer, per channel)
  → Delivery status updated (sent_at, opened_at, clicked_at)
  → review_requests record marked review_submitted=true on conversion
```

---

## 8. Notification Processing

* **Email review requests**: Dispatched via Resend SDK with branded HTML templates.
* **SMS review requests**: Dispatched via Twilio SDK with character-count-optimized messages.
* **Failed delivery retry**: Both queues implement 3-attempt exponential backoff with jitter.
* **Delivery tracking**: `sent_at`, `opened_at`, `clicked_at` timestamps written to `review_requests` table via Resend/Twilio webhooks processed through the webhook queue.

---

## 9. Error Handling Standards

* **Centralized exception filter**: `GlobalExceptionFilter` catches all unhandled exceptions and formats structured JSON error responses.
* **Structured error responses**:
  ```json
  {
    "statusCode": 400,
    "error": "BAD_REQUEST",
    "message": "email must be a valid email address",
    "traceId": "req_7f3a2b1c",
    "timestamp": "2025-06-11T03:00:00Z"
  }
  ```
* **Request tracing IDs**: A UUID `traceId` is injected by middleware into every request and included in all log entries and error responses for end-to-end tracing.
* **Critical error alerting**: Unhandled P0 errors trigger automated Slack/PagerDuty alerts via the monitoring integration.

---

## 10. Logging Framework

All logs are structured JSON, written to stdout (captured by the hosting platform log aggregator).

| Log Type | Fields Captured | Retention |
| :--- | :--- | :--- |
| **User Activity** | user_id, action, resource, timestamp | 90 days |
| **API Request** | method, path, status, duration_ms, traceId | 30 days |
| **Billing** | organization_id, event, amount, stripe_event_id | 12 months |
| **Authentication** | user_id, event (login/logout/failed), ip, timestamp | 90 days |
| **System Error** | error, stack, traceId, severity, timestamp | 12 months |

---

## 11. Performance Standards

| Standard | Target | Implementation |
| :--- | :--- | :--- |
| API Response Time | < 500ms p95 | Redis caching on frequent queries |
| Database Indexing | All FK columns indexed | Composite indexes on common filters |
| Redis Caching | TTL 5–60 minutes | Cache: business profiles, report aggregations |
| Pagination | All list endpoints | Default page=1, limit=25, max limit=100 |
| N+1 Prevention | Zero N+1 queries | ORM `include` / SQL JOINs enforced |

---

## 12. Backend Security

* **JWT Authentication**: Access tokens (15 min) + Refresh tokens (7 days) via Passport.js strategy.
* **Role-Based Access Control**: `@Roles()` decorator + `RolesGuard` enforced at controller method level.
* **Rate Limiting**: `@Throttle()` decorator via `@nestjs/throttler` — 60 req/min public, 300 req/min authenticated.
* **Input Sanitization**: `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true` applied globally.
* **Audit Trails**: `LoggingInterceptor` writes an `audit_logs` entry on all POST/PUT/DELETE requests automatically.

---

## 13. Part 4 Deliverables Checklist

* [x] **Folder structure approved** — 10 module directories defined with standard NestJS file conventions.
* [x] **Service architecture documented** — 8 services with responsibility, dependencies, and layer rules.
* [x] **Queue architecture documented** — 5 BullMQ queues with triggers, processors, and retry policies.
* [x] **Logging strategy approved** — 5 log categories with fields and retention periods specified.
* [x] **Backend ready for implementation** — All standards, patterns, and security requirements defined.
