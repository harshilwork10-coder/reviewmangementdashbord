# QA Playbook, Testing Standards & Release Readiness

This document outlines the Quality Assurance (QA) lifecycle, test planning suites, defect management classifications, and release readiness checklists.

---

## 1. QA Vision & Philosophy

* **Reliable & Stable UX**: Prevent production escapes through sharded unit and automated integration testing pipelines.
* **Proactive Validation**: Ensure features are thoroughly checked prior to merges to decrease support overhead and guarantee a reliable SaaS experience.
* **Repeatable Quality Standards**: Define test coverage objectives and gates to enable CI/CD validations.

---

## 2. Testing Strategy Matrix

Our multi-layered quality control strategy encompasses the following domains:

```text
┌─────────────────────────────────────────────────────────────┐
│                 User Acceptance Testing (UAT)               │
├─────────────────────────────────────────────────────────────┤
│            UI End-to-End Testing & Browser Layouts          │
├─────────────────────────────────────────────────────────────┤
│         Security Validation & Role Permissions Audits       │
├─────────────────────────────────────────────────────────────┤
│       Integration API Testing (Stripe, Twilio, Resend)      │
├─────────────────────────────────────────────────────────────┤
│       Unit Testing (Services, Repositories, Helpers)        │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Unit Testing
* **Target Scopes**: Relational database repositories, calculation helpers, and security decorators.
* **Coverage Threshold**: Target of **>= 80%** code statement coverage.
* **Automation**: CI/CD workflows run unit tests automatically on every pull request. Merges are blocked if coverage drops below the threshold.

### 2.2 Integration Testing
Verifies database interactions and external provider integration stability:
* **Stripe Billing**: Assures checkout session creations, invoice payments, and webhook lifecycle handling.
* **Twilio SMS**: Confirms Alpha-Sender IDs lookup configurations and dispatch callbacks.
* **Resend Email**: Assures templates compile successfully and HTML variables parse correctly.
* **Webhook Listeners**: Evaluates signature validation handlers and database sync updates.

### 2.3 API Testing
Verifies endpoint responses against schema expectations:
* **Auth**: `/api/auth/login`, `/api/auth/register`, `/api/auth/verify-email`.
* **Business**: `/api/businesses` location CRUD operations.
* **Customers**: `/api/customers` database indexing and CSV bulk imports latency.
* **Campaigns**: `/api/campaigns` triggers and queues schedules.
* **Reporting**: `/api/reports` cache generations and CSV downloads.

### 2.4 UI Testing (Playwright / Cypress)
Validates key user journeys across viewports:
* **Authentication**: Login credentials inputs, register validations, reset-password paths.
* **Dashboard**: Navigating sidebar segments, location switchers context changes.
* **Campaigns**: Creation forms validations, template selections, and trigger parameters validation.
* **Customers**: CSV file drops, import logs parsing, filters checks.
* **Billing**: Stripe Checkout redirects, invoices download keys.

### 2.5 Security Testing
* **RBAC verification**: Assures controllers restrict unauthorized roles from administrative paths.
* **JWT validation**: Verifies expiration times, blacklist checking, signature verification.
* **Sanitization**: Checks SQL injection preventions (using parameterized queries) and XSS blocks.
* **Rate Limits**: Confirms IP blocks on public login and registration paths.

### 2.6 Performance Testing
* **API Latency**: Enforce p95 latency **< 500ms** on core endpoints.
* **Dashboard Loading**: Initial page load complete in **< 3.0s**.
* **Bulk Imports**: Processing a 10,000-customer CSV in under 60 seconds.
* **Campaign Dispatches**: Triggering 50,000 requests without queue memory overflows.

### 2.7 User Acceptance Testing (UAT)
* **Real-World Scenarios**: Agency owners switch contexts, invite staff, import customers, and launch email campaigns.
* **Sign-off Rule**: Feature releases require written PM and UAT tester approvals before production deploys.

---

## 3. Defect Management & Priority Matrix

Bugs encountered during staging tests are classified into four severity priorities:

| Severity | Definition | Target Resolution |
|---|---|---|
| **Critical** | Blockers. System crash, billing loop failures, data leakage, security bypasses. | **Immediate** (Block Deploy) |
| **High** | Feature disabled. Campaigns failing to dispatch, reviews scraping timeout locks. | **24 Hours** (Block Deploy) |
| **Medium** | Functional issue with workarounds. Charts displaying wrong time offsets, sorting. | **3-5 Days** (Allowed in release) |
| **Low** | Aesthetic issue. Typos, minor layout spacing overlaps on specific device resolutions. | **Next Sprint** (Allowed in release) |

### 3.1 Root Cause Analysis (RCA) Process
Every Critical or High defect in production triggers a mandatory RCA:
1. **Identify Bug**: Document event timeline and user actions leading to the defect.
2. **5 Whys Audit**: Probe the issue recursively to find the structural root cause.
3. **Implications**: Review impacted files and tenant database records.
4. **Remediation**: Deploy hotfixes, write regression unit tests to prevent recurrence, and update the QA Playbook.

---

## 4. Release Readiness Checklist

The QA Lead must verify the following checkpoints before unlocking a production release:
* [x] **Zero Open Critical/High Bugs**: Verified via active defect management logs.
* [x] **Staging QA Sign-off**: Functional testing passed and validated.
* [x] **Security Audits Cleared**: RBAC and JWT validation checks completed.
* [x] **Performance Benchmarks Met**: Latency gauges confirm target load times are within bounds.
* [x] **Rollback Configuration Active**: Verified rollback instructions and tag references.

### Rollback Strategy
In case of deployment failure, developers must execute the rollback command:
```bash
# Step 1: Revert production branch to previous stable release tag
git checkout tags/v1.4.2-stable

# Step 2: Push stable commit to production cluster
git push origin production --force

# Step 3: Rollback database migrations if executed
npm run db:migrate:rollback
```

---

## 5. Quality Assurance KPIs

* **Defect Escape Rate**: `(Production Bugs / Total Bugs) * 100`. Target: **< 5%**.
* **Critical Bug Count**: Target: **0** open critical bugs at release time.
* **Test Coverage Percentage**: Statement coverage target: **> 80%**.
* **Release Success Rate**: Percentage of deployments completed without rollbacks. Target: **> 98%**.
* **Customer-Reported Issues**: Weekly count of support tickets related to bugs. Target: **< 10 tickets/week**.

---

## 6. Part 11 Deliverables Gate Checklist

* [x] QA strategy defined and approved
* [x] Test cases documented across layers
* [x] Release checklists finalized
* [x] Defect management processes established
* [x] Launch quality gates approved
