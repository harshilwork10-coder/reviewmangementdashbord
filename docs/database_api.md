# Database Schema & API Design Specification

This document defines the complete data model, table schemas, relationships, role-permission model, REST API specifications, and security requirements for the **ReviewManagement** SaaS platform.

---

## 1. Database Architecture Overview

* **Engine**: **PostgreSQL** (relational database with JSONB support).
* **Multi-Tenancy Design**: Organization-level tenant isolation using Row-Level Security (RLS). All business data is scoped by `organization_id`.
* **Primary Keys**: All tables use **UUID v4** primary keys to prevent enumeration attacks.
* **Audit Timestamps**: Every table includes `created_at` and `updated_at` fields with automatic triggers.
* **Soft Deletes**: Applicable tables include a `deleted_at` nullable timestamp. Hard deletes are disabled for audit-trail compliance.

---

## 2. Core Table Schemas

### 2.1 `users`
Stores platform-level user authentication identities.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `user_id` | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `name` | `VARCHAR(255)` | NOT NULL |
| `email` | `VARCHAR(320)` | NOT NULL, UNIQUE |
| `password_hash` | `TEXT` | NOT NULL |
| `status` | `ENUM('active', 'suspended', 'pending')` | NOT NULL, DEFAULT 'pending' |
| `email_verified_at` | `TIMESTAMP` | NULLABLE |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |

---

### 2.2 `organizations`
Represents agency or business owner tenants.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `organization_id` | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `name` | `VARCHAR(255)` | NOT NULL |
| `plan_type` | `ENUM('starter', 'growth', 'agency', 'enterprise')` | NOT NULL, DEFAULT 'starter' |
| `owner_user_id` | `UUID` | FK → users.user_id |
| `billing_status` | `ENUM('active', 'past_due', 'cancelled', 'trialing')` | NOT NULL, DEFAULT 'trialing' |
| `stripe_customer_id` | `VARCHAR(255)` | NULLABLE, UNIQUE |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |

---

### 2.3 `businesses`
Individual business locations managed within an organization.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `business_id` | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `organization_id` | `UUID` | NOT NULL, FK → organizations.organization_id |
| `business_name` | `VARCHAR(255)` | NOT NULL |
| `review_link` | `TEXT` | NULLABLE |
| `address` | `TEXT` | NULLABLE |
| `phone` | `VARCHAR(30)` | NULLABLE |
| `logo_url` | `TEXT` | NULLABLE |
| `industry` | `VARCHAR(100)` | NULLABLE |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |
| `deleted_at` | `TIMESTAMP` | NULLABLE |

---

### 2.4 `customers`
Customer contacts managed by a business for review request campaigns.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `customer_id` | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `business_id` | `UUID` | NOT NULL, FK → businesses.business_id |
| `first_name` | `VARCHAR(100)` | NOT NULL |
| `last_name` | `VARCHAR(100)` | NULLABLE |
| `email` | `VARCHAR(320)` | NULLABLE |
| `phone` | `VARCHAR(30)` | NULLABLE |
| `last_contacted` | `TIMESTAMP` | NULLABLE |
| `tags` | `TEXT[]` | NULLABLE |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |
| `deleted_at` | `TIMESTAMP` | NULLABLE |

---

### 2.5 `campaigns`
Review request campaigns created for a business.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `campaign_id` | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `business_id` | `UUID` | NOT NULL, FK → businesses.business_id |
| `campaign_name` | `VARCHAR(255)` | NOT NULL |
| `campaign_type` | `ENUM('email', 'sms', 'both')` | NOT NULL |
| `status` | `ENUM('draft', 'scheduled', 'active', 'paused', 'completed')` | NOT NULL, DEFAULT 'draft' |
| `launch_date` | `TIMESTAMP` | NULLABLE |
| `template_body` | `TEXT` | NULLABLE |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |
| `updated_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |

---

### 2.6 `review_requests`
Individual review request events sent to customers as part of a campaign.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `request_id` | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `campaign_id` | `UUID` | NOT NULL, FK → campaigns.campaign_id |
| `customer_id` | `UUID` | NOT NULL, FK → customers.customer_id |
| `delivery_method` | `ENUM('email', 'sms')` | NOT NULL |
| `sent_at` | `TIMESTAMP` | NULLABLE |
| `opened_at` | `TIMESTAMP` | NULLABLE |
| `clicked_at` | `TIMESTAMP` | NULLABLE |
| `review_submitted` | `BOOLEAN` | NOT NULL, DEFAULT FALSE |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |

---

### 2.7 `reviews`
Imported review records from external platforms (Google, Yelp, etc.).

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `review_id` | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `business_id` | `UUID` | NOT NULL, FK → businesses.business_id |
| `platform` | `ENUM('google', 'yelp', 'facebook', 'other')` | NOT NULL |
| `reviewer_name` | `VARCHAR(255)` | NULLABLE |
| `rating` | `SMALLINT` | CHECK (rating BETWEEN 1 AND 5) |
| `review_text` | `TEXT` | NULLABLE |
| `review_date` | `TIMESTAMP` | NULLABLE |
| `platform_review_id` | `VARCHAR(255)` | NULLABLE, UNIQUE |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |

---

### 2.8 `subscriptions`
Stripe-linked subscription records per organization.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `subscription_id` | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `organization_id` | `UUID` | NOT NULL, FK → organizations.organization_id |
| `stripe_subscription_id` | `VARCHAR(255)` | NOT NULL, UNIQUE |
| `plan_type` | `ENUM('starter', 'growth', 'agency', 'enterprise')` | NOT NULL |
| `billing_cycle` | `ENUM('monthly', 'annual')` | NOT NULL |
| `status` | `ENUM('active', 'past_due', 'cancelled', 'trialing')` | NOT NULL |
| `current_period_start` | `TIMESTAMP` | NOT NULL |
| `current_period_end` | `TIMESTAMP` | NOT NULL |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |

---

### 2.9 `audit_logs`
Immutable audit trail of all administrative and business-critical events.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `log_id` | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `user_id` | `UUID` | NULLABLE, FK → users.user_id |
| `organization_id` | `UUID` | NULLABLE, FK → organizations.organization_id |
| `action` | `VARCHAR(255)` | NOT NULL |
| `resource_type` | `VARCHAR(100)` | NOT NULL |
| `resource_id` | `UUID` | NULLABLE |
| `ip_address` | `VARCHAR(45)` | NULLABLE |
| `metadata` | `JSONB` | NULLABLE |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |

---

### 2.10 `user_roles`
Maps users to their access roles within an organization.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `role_id` | `UUID` | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `user_id` | `UUID` | NOT NULL, FK → users.user_id |
| `organization_id` | `UUID` | NOT NULL, FK → organizations.organization_id |
| `role` | `ENUM('super_admin', 'agency_admin', 'business_owner', 'marketing_user', 'read_only')` | NOT NULL |
| `created_at` | `TIMESTAMP` | NOT NULL, DEFAULT NOW() |

---

## 3. Role-Permission Model

| Permission | Super Admin | Agency Admin | Business Owner | Marketing User | Read Only |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Create Campaigns | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit Businesses | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage Customers | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Reports | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Billing | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 4. REST API Specification

### Authentication APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Create a new user account |
| `POST` | `/auth/login` | Authenticate and receive JWT tokens |
| `POST` | `/auth/logout` | Invalidate the active session token |
| `POST` | `/auth/reset-password` | Send a password reset link |
| `GET` | `/auth/profile` | Retrieve the current user profile |

### Business APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/businesses` | List all businesses in the organization |
| `POST` | `/businesses` | Create a new business profile |
| `PUT` | `/businesses/{id}` | Update a business by ID |
| `DELETE` | `/businesses/{id}` | Soft-delete a business by ID |

### Campaign APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/campaigns` | List all campaigns for a business |
| `POST` | `/campaigns` | Create a new campaign |
| `PUT` | `/campaigns/{id}` | Update a campaign by ID |
| `GET` | `/campaigns/{id}/metrics` | Retrieve open/click/submit stats |

### Customer APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/customers` | List all customers for a business |
| `POST` | `/customers` | Create a single customer manually |
| `POST` | `/customers/import` | Bulk import from CSV payload |
| `PUT` | `/customers/{id}` | Update a customer record |

### Reporting APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/reports/reviews` | Review volume, ratings, platform breakdown |
| `GET` | `/reports/campaigns` | Campaign open, click, and conversion rates |
| `GET` | `/reports/customers` | Customer contact growth and request stats |

---

## 5. Security Requirements

* **JWT Authentication**: All API requests require a valid Bearer token in the `Authorization` header. Access tokens expire in 15 minutes; refresh tokens expire in 7 days.
* **Role-Based Access Control (RBAC)**: Middleware validates the user's role against the required permission before processing any request.
* **Row-Level Security (RLS)**: PostgreSQL RLS policies restrict all queries to the authenticated user's `organization_id`.
* **Rate Limiting**: Public endpoints are limited to 60 requests/minute per IP. Authenticated endpoints are limited to 300 requests/minute per user.
* **Input Validation**: All incoming payloads are validated using Zod schemas before database operations. SQL injection is prevented via parameterized queries.
* **Audit Logging**: All write operations (POST, PUT, DELETE) automatically write to the `audit_logs` table with user ID, IP, resource, and metadata.

---

## 6. Part 3 Deliverables Checklist

* [x] **Database schema approved** — 10 tables defined with types, constraints, and FK relationships.
* [x] **API specifications approved** — 20 REST endpoints documented with methods and response shapes.
* [x] **Role model approved** — 5 roles × 5 permissions matrix defined and validated.
* [x] **Security model documented** — JWT, RBAC, RLS, rate limiting, and audit logging specified.
* [x] **Development ready** — Schema and API specs ready for backend engineers to implement.
