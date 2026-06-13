# Frontend Architecture Playbook

This document defines the frontend architecture, folder structures, navigation patterns, component designs, and coding standards for the ReviewManagement SaaS platform.

---

## 1. Frontend Vision & Design Philosophy

The ReviewManagement frontend is built as a high-performance, responsive Single Page Application (SPA) utilizing Next.js (App Router). Our core goals are:
* **Speed & Responsiveness**: Immediate UI updates, page transitions under 100ms, and complete page load under 3 seconds.
* **Modern SaaS Aesthetics**: A premium, clean dark glassmorphism design language using unified, curated color palettes, rich gradients, and micro-interactions.
* **Agency-Ready Multi-Tenancy**: Smooth client/business contextual switching directly from the main layout.
* **Universal Responsiveness**: Adaptive layouts optimized for mobile, tablet, and desktop viewports.

---

## 2. Technology Stack

* **Framework**: Next.js 14/15 (App Router, Client-side React Components)
* **Language**: TypeScript (Strict typing enabled)
* **Styling**: Tailwind CSS & CSS Modules for glassmorphic utility styling
* **Data Fetching & Caching**: React Query (TanStack Query v5) for client cache management
* **API Client**: Axios with interceptors for header injection (JWT, Organization/Business-ID context)
* **Data Visualization**: Recharts (Responsive, SVG-based charts)
* **Forms & Validation**: React Hook Form with Zod integration

---

## 3. Directory Structure

The frontend application follows a clean modular layout:

```text
/src
├── /app                  # Next.js App Router (pages and layouts)
│   ├── /admin            # Super Admin console and playbooks
│   ├── /dashboard        # Client/Merchant dashboard
│   ├── /login            # Authentication flow pages
│   └── layout.tsx        # Global provider configuration
├── /components           # Reusable UI component library (Buttons, Cards, Modals)
├── /layouts              # Global layout systems (Sidebar, Header, Layout Wrappers)
├── /hooks                # Custom React Hooks (useAuth, useFetch, etc.)
├── /services             # Axios API clients & endpoints (auth, campaigns, etc.)
├── /store                # Client state stores (Zustand / React Context)
├── /types                # Global TypeScript type definitions
├── /utils                # Utility helper functions (formatters, parsers)
└── /styles               # Global CSS & Tailwind styling custom configurations
```

---

## 4. Page Architecture

The platform's pages are grouped into major layout categories:

### 4.1 Authentication Pages
* `/login` - Simple login with Google & SSO options.
* `/register` - Email sign-up and onboarding setup.
* `/forgot-password` & `/reset-password` - Password recovery flow.
* `/verify-email` - One-click registration confirmation.

### 4.2 Core Application (Dashboard & Contextual)
* `/dashboard` - Overview metrics, recent activities, and campaign performance.
* `/dashboard/businesses` - Multi-location and client profile settings.
* `/dashboard/customers` - Customer CRM list, segmentations, and CSV importer.
* `/dashboard/campaigns` - Review campaigns creator, templates, and execution reports.
* `/dashboard/reviews` - Feed of reviews gathered across directories (Google, Yelp, Facebook).
* `/dashboard/billing` - Plan selections, Stripe payment portal, and invoices.
* `/dashboard/settings` - Account and notification preference setups.

---

## 5. Component Library Standards

All UI components must adhere to the design library definitions:
* **Buttons**: Premium variants (`primary`, `secondary`, `glass`, `ghost`) supporting loading indicators and disabled states.
* **Cards**: Utilizing `glass-card` classes with subtle border-glows, blur settings (`backdrop-blur-md`), and hovering lift effects.
* **Tables**: Dynamic and responsive layout with sorted columns, pagination controls, and row hover visual markers.
* **Charts**: Custom-themed Recharts wrappers displaying line, bar, and area configurations using smooth transitions.
* **Forms**: React Hook Form components showing validation errors inline and input icons.
* **Modals**: Overlay-focused modals utilizing React Portal or Headless UI with exit animations.
* **Notifications**: Context-sensitive toast notifications (success, warning, error, info).
* **Navigation Components**: Unified breadcrumbs, action tags, and status badges.

---

## 6. Navigation System

Our navigation system provides seamless contextual guidance:
1. **Left Sidebar Navigation**: Permanent desktop sidebar listing main workspace modules. Collapsible on smaller viewports.
2. **Top Navigation Bar**: Global toolbar showing breadcrumbs, active business context switcher, and notification badges.
3. **Breadcrumb Support**: Hierarchical navigation tracing path segments (e.g. `Businesses / Acme Corp / Campaigns / New Campaign`).
4. **Quick Action Buttons**: Floating or header actions for common tasks ("Launch Campaign", "Import Customers").
5. **Responsive Mobile Navigation**: Slide-out hamburger menu with touch-friendly tapping regions.

---

## 7. State Management

The application state is distributed into five logic domains:
* **Authentication State**: Handled via global `AuthContext` specifying current user info, token cache, and session TTL.
* **Business Context**: Global context selector maintaining the active `business_id` and `organization_id` for scoping all client-side queries.
* **Campaign Data**: Local form states combined with React Query caching for drafts and launched states.
* **Report Filters**: Component states controlling reporting filters (date range, campaign type, source directory).
* **Billing Information**: Subscription details cached from Stripe API to toggle platform feature accesses.

---

## 8. Dashboard Standards & UX

Dashboards are visual command centers structured into logical zones:
* **Overview Metrics**: Grid of high-impact cards with sparkline charts (e.g. Average Rating, Requests Sent, Conversion Rate).
* **Recent Activity Feed**: Real-time list of review requests sent, feedback received, and system logs.
* **Campaign Performance**: Visual charts plotting review invite conversions over time.
* **Review Trends**: Area chart displaying review volume and overall sentiment changes.
* **Quick Actions Panel**: Direct entry keys to initiate critical workflows without leaving the overview.

---

## 9. Agency Experience

For agencies managing multiple clients/brands:
* **Multi-Client Switching**: Context dropdown in the top header to instantly switch between accounts without logging out.
* **Agency Overview Dashboard**: Aggregated high-level statistics across all client portfolios.
* **Client Performance Comparisons**: Comparative grids showing active locations, ratings, and campaign statuses.
* **Centralized Reporting**: Multi-tenant report exports combining cross-brand statistics.

---

## 10. Responsive Design & Visual Standards

* **Viewport Strategy**: Desktop-first structural containers optimized down to mobile phone layouts.
* **Breakpoints**: Tailwind standard breakpoints (`sm:`, `md:`, `lg:`, `xl:`).
* **Touch-Friendly Controls**: Minimum clickable area size of `44x44px` for interactive nodes.
* **Aesthetics**: Glassmorphism (`backdrop-blur-xl bg-card/30 border-border`), smooth hover scalings (`hover:scale-[1.02] duration-200`), and curated color schemes (avoiding raw primaries).

---

## 11. Frontend Security

* **Protected Routes**: Middleware routing checks verifying JWT integrity before rendering `/dashboard/*` pages.
* **Session Validation**: Background token expiration checks redirecting invalid sessions to `/login`.
* **Role-Based Rendering (RBAC)**: Selective DOM rendering (e.g., hiding Billing settings from `Agent` role while showing to `Admin` or `Owner`).
* **Input Validation**: Compulsory validation utilizing Zod client-side on all inputs before posting to backend APIs.
* **Secure API Communication**: Automated injection of authorization headers and CSRF tokens via Axios interceptors.

---

## 12. Performance Optimization

* **Page Load Budget**: Strict target of under 3 seconds for initial paint.
* **Lazy Loading**: Code splitting high-weight library components (e.g. charts, maps) utilizing Next.js `dynamic()`.
* **Optimized Assets**: Modern WebP/AVIF formats handled by `<Image />` next-gen components.
* **Query Caching**: Configured React Query `staleTime` and `gcTime` settings to minimize duplicate API calls.

---

## 13. Part 5 Deliverables Checklist

* [x] Frontend architecture approved by review panel
* [x] Page hierarchy and routes documented
* [x] Reusable component library definitions finalized
* [x] Navigation and breadcrumb guidelines completed
* [x] Codebase development-ready for frontend implementation
