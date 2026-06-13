# CRM Strategy & Customer Success Playbook

This document details the customer lifecycle management, system architectures, qualification parameters, and customer success (CS) workflows for **ReviewManagement**.

---

## 1. Purpose & Core Objectives

Our CRM and Success strategy governs the complete customer journey from anonymous visitor to paid user, renewal, and advocate.

* **Primary Goals**:
  * Maximize Free Trial-to-Paid conversions.
  * Systematically detect and intercept customer churn before cancellations occur.
  * Drive account expansion through automated, usage-triggered upsell pipelines.
  * Structure a predictable recurring revenue framework (MRR/ARR).

---

## 2. CRM Architecture & Systems Integration

We sync data across five primary software systems to maintain a single source of customer truth:

```
+------------------+      +-------------+      +------------------+
|    HubSpot CRM   | <--> |   Stripe    | <--> |    App Database  |
|  (Leads & SQLs)  |      | (Billing)   |      |  (Usage Logs)    |
+------------------+      +-------------+      +------------------+
         ^                                              ^
         |                                              |
         v                                              v
+------------------+                           +------------------+
|     Calendly     |                           |       GA4        |
|  (Demo Schedule) |                           | (Behavior Logs)  |
+------------------+                           +------------------+
```

* **HubSpot CRM (Leads, Accounts & Support Tickets)**: Holds contact records, sales notes, demo booking stages, and support logs.
* **Stripe (Subscriptions & Invoicing)**: Manages subscriptions state, renewal dates, payment histories, and invoices.
* **Calendly (Meetings)**: Coordinates demo inquiries and triggers HubSpot deal creations.
* **Google Analytics 4 & App Database (Usage logs)**: Feeds customer action events (Google connected, campaigns dispatched, AI replies drafted) into HubSpot custom properties.

---

## 3. Lead Lifecycle Stages

Every contact in our system moves through eight distinct lifecycle checkpoints:

1. **Visitor**: Anonymous searcher browsing `/features` or competitor comparison pages.
2. **Lead**: Contact details captured (e.g., email submitted for the Exit-Intent eBook).
3. **Marketing Qualified Lead (MQL)**: Contact requests a demo and submits business details.
4. **Product Qualified Lead (PQL)**: Trial user who has completed the core product activation milestones.
5. **Sales Qualified Lead (SQL)**: Lead has attended a scheduled demo call and is issued a formal proposal.
6. **Trial User**: Evaluating the Growth plan during the active 14-day trial period.
7. **Customer**: Paid, active subscriber (on Starter, Growth, Agency, or Enterprise plans).
8. **Advocate**: Active customer who refers new merchants or joins the Agency portal networks.

---

## 4. Product Qualified Leads (PQL) Criteria

We qualify trial signups as PQLs when they hit high-intent usage thresholds. PQL status automatically escalates the account inside HubSpot, alerting a Sales representative to reach out:

* **PQL Core Criteria Checklist**:
  1. **Google Business Profile Hooked**: Connected a live directory to the dashboard setup wizard.
  2. **First Review Request Dispatched**: Sent an automated review invite via SMS/Email templates.
  3. **First AI Response Generated**: Drafted and approved an AI response suggestion in the inbox feed.
* **Engagement Accelerator**: Accounts logging in **3+ times** within their first 72 hours of signup are immediately prioritized as high-conversion targets.

---

## 5. Demo Management Workflow

We structure a 5-step funnel for demo inquiries:

```
[Request Demo] ➔ [Schedule Meeting via Calendly] ➔ [Demo Conducted] ➔ [Proposal Issued] ➔ [Follow-up Sequence]
```

* **Demo KPIs tracked in HubSpot**:
  * *Demo Show Rate*: Percentage of scheduled meetings completed (Target: > 85%).
  * *Demo-to-Trial Rate*: Percentage of demo attendees starting free evaluations (Target: > 60%).
  * *Demo-to-Customer Rate*: Percentage of demo leads converting to paid users (Target: > 35%).

---

## 6. Customer Success (CS) Touchpoints

Our Customer Success team contacts paid merchants at 30, 60, and 90-day intervals to review account performance:

* **30-Day Checkup**:
  * Focus: Review requests campaign setup, GBP connection health.
  * Milestone: Ensure at least 50 review invitations have been dispatched.
* **60-Day Review**:
  * Focus: Evaluate AI replies adoption, tone configurations.
  * Milestone: Ensure average response rate is > 85%.
* **90-Day Strategy Review**:
  * Focus: Track Local maps search ranking growth, review volume MoM.
  * Milestone: Conduct Net Promoter Score (NPS) survey. Check for expansion opportunities.

---

## 7. Churn Prevention & Alert Triggers

Our system monitors client databases daily to identify declining engagement. If warning thresholds are crossed, an alert is raised in the CRM, triggering automated Customer Success outreach:

* **Churn Risk Warning Signals**:
  * *Low Login Activity*: No administrator logins recorded for 7 consecutive days.
  * *Declining Review Volume*: Review imports drop by > 40% month-over-month.
  * *Unresolved Support Tickets*: Active support tickets remain open for > 48 hours without resolution.
* **Automated CS Playbook Triggers**:
  1. Email offering a free 1-on-1 reputation optimization consultation.
  2. Training video invitation detailing advanced review gating methods.
  3. Escalation task assigned to their dedicated Customer Success Manager.

---

## 8. Account Upsell Expansion Strategy

We trigger upgrade proposals inside the merchant workspace when they approach or exceed plan limits:

| Active Plan | Expansion Opportunity | Trigger Milestone |
| :--- | :--- | :--- |
| **Starter ($29/mo)** | Upgrade to **Growth ($79/mo)** | Merchant connects more than 1 location OR attempts to select custom AI reply tones. |
| **Growth ($79/mo)** | Upgrade to **Agency ($199/mo)** | Merchant adds a 6th physical location OR attempts to configure whitelabel logos. |
| **Agency ($199/mo)** | Upgrade to **Enterprise ($999/mo)** | Merchant adds a 26th client OR requests custom CRM integration endpoints. |
