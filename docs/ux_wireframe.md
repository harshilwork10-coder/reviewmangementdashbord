# UI/UX & Wireframe Manual - User Experience Design, Navigation & User Journeys

This document defines all UX principles, screen inventory, navigation architecture, user journey flows, layout specifications, and the component library for the **ReviewManagement** platform.

---

## 1. UX Design Principles

All design decisions are anchored to five core principles that prioritize accessibility and business user clarity:

1. **Onboarding Speed**: Reduce new user onboarding time to under **15 minutes** from account creation to first review request sent.
2. **Business Owner First**: Interfaces are designed for non-technical business owners, not developers. Avoid jargon and always use plain-language labels.
3. **Mobile-First Responsive**: All layouts are designed at 375px mobile width first, then scaled to tablet (768px) and desktop (1280px+).
4. **Minimize Click Depth**: The most common actions (send campaign, reply to review, view inbox) must be reachable within **3 clicks** from any screen.
5. **Clear Calls-to-Action**: Every screen must have at least one visible primary CTA button with a descriptive label (never generic "Click Here").

---

## 2. Application Navigation Structure

The platform uses a flat, role-aware top-level navigation with 7 core nodes:

```
ReviewHub App
├── Dashboard          (Overview, KPIs, Quick Actions)
├── Businesses         (Profile, Locations, Branding, Platforms)
├── Review Campaigns   (Builder, Templates, Schedules, History)
├── Customers          (List, Import CSV, Manual Entry, Filters)
├── Reports            (Review Growth, Rating Trends, Export PDF/CSV)
├── Billing            (Plans, Invoices, Stripe Portal)
└── Settings           (Account, Notifications, Integrations, Team)
```

### Role-Based Navigation Visibility
* **Business Owner**: Full access to all 7 nodes.
* **Marketing Manager**: Dashboard, Campaigns, Customers, Reports.
* **Agency User**: Businesses (multi-client switcher), Reports, Billing.
* **Read-Only User**: Dashboard, Reports only.

---

## 3. Authentication Screens

### 3.1 Login Page
* **Elements**: Email field, Password field, Remember Me checkbox, Login CTA, "Forgot Password?" link, Google OAuth option.
* **UX Rule**: Auto-focus on the email field on page load.

### 3.2 Registration Page
* **Elements**: Full Name, Business Email, Password, Plan selection (Starter / Growth / Agency), Terms acceptance checkbox, Create Account CTA.
* **UX Rule**: Show real-time password strength indicator.

### 3.3 Forgot Password
* **Elements**: Email input field, "Send Reset Link" CTA.
* **UX Rule**: Display success confirmation without revealing whether the email exists.

### 3.4 Reset Password
* **Elements**: New Password, Confirm Password, Reset CTA.
* **UX Rule**: Show the token expiry countdown timer.

### 3.5 Email Verification
* **Elements**: Confirmation message, "Resend Verification Email" link, countdown timer.
* **UX Rule**: Auto-redirect to Business Profile wizard upon verification success.

---

## 4. New User Onboarding Journey (7 Steps)

The onboarding wizard guides new users from registration to their first active campaign with minimal friction:

```
[Create Account] ➔ [Verify Email] ➔ [Business Profile] ➔ [Add Google Link] ➔ [Import Customers] ➔ [Launch Campaign] ➔ [View Dashboard]
```

| Step | Screen | Goal | CTA Label |
| :---: | :--- | :--- | :--- |
| 1 | Account Registration | Collect user details and plan selection | "Create My Account" |
| 2 | Email Verification | Confirm identity | "Verify My Email" |
| 3 | Business Profile | Enter business name, logo, address, category | "Save & Continue" |
| 4 | Add Google Review Link | Paste Google review URL | "Link Google Profile" |
| 5 | Import Customers | Upload CSV or manually enter phone / email | "Import Contacts" |
| 6 | Launch First Campaign | Send Email or SMS requests to imported contacts | "Send My First Campaign" |
| 7 | Dashboard Overview | View first metrics and review activity | "Go to Dashboard" |

---

## 5. Screen Inventory & Layout Specifications

### 5.1 Dashboard Layout
**Primary KPI widgets (top row):**
* Total Review Requests Sent
* Reviews Received
* Average Rating (star meter)
* Campaign Performance (open rate)

**Secondary sections:**
* **Recent Activity Feed**: Scrollable timeline of new reviews, campaign dispatches, and replies.
* **Quick Actions Panel**: Shortcuts to "Send Campaign", "Add Customer", "View Reviews".

### 5.2 Business Profile Screen
* Business name and description text fields.
* Logo image upload with crop preview.
* Address, phone number, and website URL.
* Review platform links manager (Google, Yelp, Facebook).
* Location settings (for multi-location accounts).
* Branding options (accent color, watermark logo).

### 5.3 Customer Management Screen
* Paginated customer table (Name, Email, Phone, Last Contacted, Review Status).
* "Import CSV" button opening a file picker with column mapping wizard.
* "Add Customer Manually" inline form slide-over modal.
* Search bar and multi-filter controls (by status, date, source).
* Customer communication history drawer (opens per row click).

### 5.4 Review Campaign Builder
1. Campaign name field.
2. Channel toggle (Email / SMS / Both).
3. Review link selector (Google or custom URL).
4. Message template editor with preview pane.
5. Audience selector (All contacts / Segment / Manual list).
6. Schedule settings (Send Now / Schedule Date & Time).
7. Launch button with confirmation modal.
8. Live campaign monitor widget (sent, opened, clicked counts).

### 5.5 Reporting Screens
* **Review Request Success Rate**: Donut chart + table (sent vs responded).
* **Reviews Generated**: Bar chart (by week/month) + platform source breakdown.
* **Rating Trends**: Line chart showing average star rating over time.
* **Campaign Performance**: Open rates, click-through rates per campaign.
* **Export Controls**: PDF report and CSV raw data download buttons.

### 5.6 Agency View
* Multi-client dashboard — card grid showing each client's summary KPIs.
* Client switcher — persistent top-bar dropdown to change client context.
* Client performance summary — aggregate reviews and campaign stats.
* Agency-level reporting — consolidated metrics across all client accounts.

---

## 6. Mobile Experience Specifications

All screens must be fully functional and optimized for mobile viewport (375px+):

* **Responsive Dashboard**: KPI cards stack vertically. Activity feed scrolls inline.
* **Campaign Management**: Campaign builder collapses into a single-column stepped form flow.
* **Customer Management**: Table converts to a card list on mobile with swipe-to-action gestures.
* **Report Viewing**: Charts resize with pinch-to-zoom. Export buttons are sticky at the bottom.
* **Notification Center**: Persistent slide-in notification tray accessible via bell icon.

---

## 7. UI Component Library

All components are built using the platform's dark glassmorphism design system.

| Component | Variants | Usage |
| :--- | :--- | :--- |
| **Buttons** | Primary (Red), Secondary (Ghost), Danger, Disabled | CTAs, Actions, Confirmations |
| **Tables** | Sortable, Paginated, Selectable rows | Customer lists, Invoice history |
| **Charts** | Bar, Line, Donut, Gauge | Reporting dashboards |
| **Cards** | KPI Stat card, Summary card, Action card | Dashboard widgets |
| **Forms** | Input, Textarea, Select, Toggle, Date picker | Data entry screens |
| **Modals** | Confirmation, Form slide-over, Alert | Destructive actions, Quick entry |
| **Notifications** | Success (green), Warning (amber), Error (red), Info (blue) | System alerts, Toast messages |

---

## 8. Part 2 Deliverables Checklist

To complete the UX/Wireframe definition phase, the following items must be approved:

* [x] **Screen inventory complete** — All 15+ screens catalogued with layout specs.
* [x] **Navigation structure approved** — 7 top-level nodes defined with role-based visibility.
* [x] **User journeys documented** — 7-step onboarding flow and role-based paths mapped.
* [x] **Dashboard wireframes approved** — KPI layout, activity feed, and quick-action panel specified.
* [x] **MVP UI requirements finalized** — Component library defined and design system tokens established.
