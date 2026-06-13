# Dashboard & Reporting Playbook

This document defines the data models, visualization layouts, metric calculations, and export pipelines for reporting dashboards.

---

## 1. Reporting Vision & Strategy

Reputation management relies on clear, actionable data. The reporting system is engineered to provide business intelligence at three contextual layers:
* **Executive Layer**: High-level ROI metrics, average ratings, and business health scores.
* **Business Layer**: Granular location details, recent reviews activity feeds, and campaign conversions.
* **Agency Layer**: Multi-client portfolio comparisons, aggregation benchmarks, and brand growth metrics.

---

## 2. Dashboard Configurations & Schemas

### 2.1 Executive Dashboard
* **Target Audience**: Corporate officers, stakeholders.
* **Primary Viewport**: Desktop summary scorecard grid.
* **Core Metrics**:
  * **Total Review Requests Sent**: Total invitations dispatched.
  * **Reviews Received**: Verifiable reviews indexed in the database.
  * **Average Star Rating**: Calculated dynamically: `SUM(review.rating) / COUNT(reviews)`.
  * **Review Conversion Rate**: `(Reviews Received / Requests Sent) * 100`.
  * **Business Health Score**: Weighted index combining rating average (60%), review frequency (25%), and negative response rates (15%). Range: 0 to 100.

### 2.2 Business Location Dashboard
* **Target Audience**: Store managers, operators.
* **Core Modules**:
  * **Recent Reviews Feed**: Interactive list of raw reviews indexed from Google/Yelp.
  * **Campaign Activity Timeline**: Send rate trends over rolling timeframes.
  * **Customer Engagement Grid**: Individual open/click logs per outreach segment.
  * **Quick Actions Panel**: Direct entry points to import lists or initiate manual requests.

### 2.3 Agency Portfolio Dashboard
* **Target Audience**: Multi-location administrators, agency representatives.
* **Core Modules**:
  * **Multi-Client Switcher**: Scoped dropdown to filter global lists by organization.
  * **Client Comparison Grid**: Visual matrix sorting locations by average ratings and conversion rates.
  * **Consolidated KPI Summary**: Summed parameters across all active locations.
  * **Client Growth Indicators**: Month-over-month increases in review volume.

---

## 3. KPI Widget Definitions

To maintain consistency across all modules:

| Metric | Formula / Calculation | Database Source |
|---|---|---|
| **Requests Sent** | `COUNT(review_requests)` | `review_requests` |
| **Open Rate** | `(COUNT(opens) / COUNT(delivered)) * 100` | `tracking_events` |
| **Click Rate** | `(COUNT(clicks) / COUNT(delivered)) * 100` | `tracking_events` |
| **Review Submission Rate** | `(COUNT(submissions) / COUNT(delivered)) * 100` | `tracking_events` |
| **Average Rating** | `AVG(reviews.rating)` | `reviews` |
| **Customer Response Rate** | `(COUNT(interactions) / COUNT(sent)) * 100` | `tracking_events` |

---

## 4. Visual Charting Standards

To support rapid scanning, dashboards utilize a dark glassmorphic layout theme:
* **Trend Graphs**: Line and Area charts (using Recharts) to plot review volume over daily, weekly, or monthly boundaries. Line paths use custom gradients.
* **Scorecards**: Micro-widgets displaying a single KPI alongside positive/negative variance indicators (e.g. `+12% vs last week`).
* **Performance Heatmaps**: Grids illustrating customer review click activity categorized by hour of day and day of week.
* **Star Indicators**: Visually rounded SVG stars rendered with fractional fills matching calculated decimal values (e.g. 4.67 stars).

---

## 5. Export Pipelines (PDF / CSV)

Reports are compiled asynchronously to protect main thread runtime responsiveness:
1. **Request Submission**: User triggers export from UI; a task is pushed to the `report-queue` containing active dashboard filters.
2. **Data Aggregation**: Worker queries the read-optimized replica database.
3. **Format Compilation**:
   * **CSV**: Stream formatted plaintext rows.
   * **PDF**: Server-side rendering using headless Chromium or HTML-to-PDF compilers.
4. **Delivery**: Compiled report uploaded to secure cloud storage; signed download link emailed to user or pushed via WebSocket.
5. **Scheduled Reports**: Cron jobs configured in the database run weekly or monthly to automatically email PDF summaries directly to owners.

---

## 6. Real-Time Notification Framework

Alerting coordinates outbound notifications using Redis pub/sub:

* **New Review Alerts**: Real-time pop-up logs showing review details.
* **Negative Review Escalations**: Triggered instantly if a new review has a rating of **<= 2 Stars**. Dispatches instant SMS alerts to managers and spawns a support ticket.
* **Campaign Completions**: Informs creators once a bulk invite campaign queue drains to zero.
* **Delivery Failures**: Logs carrier bounces or invalid addresses for support reviews.
* **Subscription Alerts**: Warning notices for credit card expirations or plan limits.

---

## 7. Performance Budgets

* **Dashboard Load Limit**: Initial paint and data queries must execute in under **3 seconds** (target p95: 1.8 seconds).
* **Cache Strategy**: Dashboard metrics queries are cached in Redis with a Time-to-Live (TTL) of **15 minutes**.
* **Database Optimization**: Scoped queries must leverage composite indexes on `(business_id, created_at)` and avoid runtime `COUNT` scans over non-indexed columns.
* **Pagination Constraints**: Review feeds and log streams must default to **25 records** per page, capped at **100**.

---

## 8. Part 8 Deliverables Gate Checklist

* [x] Dashboard visualization specifications approved
* [x] Core KPI metrics calculations finalized
* [x] Export report compilation architecture approved
* [x] Real-time notification rules defined
* [x] Analytics pipeline ready for development
