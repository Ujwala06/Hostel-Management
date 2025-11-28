# College Hostel Management System – High Level Design (HLD)

## 1. Introduction

The College Hostel Management System is designed to simplify and automate daily administrative and operational activities within a college hostel. It provides a unified digital platform where administrators, wardens, students, and hostel staff can interact efficiently, reducing manual effort and improving transparency. [attached_file:61]

This HLD defines the overall structure, major modules, data flow, and interactions between components, and serves as a blueprint for the detailed Low Level Design and implementation. [attached_file:61]

---

## 2. System Overview and Actors

### 2.1 Core User Roles

- **Administrator**
  - Manages overall hostel configuration and operations.
  - Approves student registrations and room allocations.
  - Manages hostel staff and rules. [attached_file:61]

- **Warden**
  - Handles day-to-day hostel operations.
  - Monitors complaints and emergencies.
  - Coordinates with staff and acts as bridge between admin and students. [attached_file:61]

- **Student**
  - Uses the system to register, view information, raise complaints, and submit emergency or service requests. [attached_file:61]

- **Hostel Staff (Workers)**
  - Cleaning, cooking, laundry, maintenance, and other support staff.
  - Receive tasks, update status, and acknowledge work completion. [attached_file:61]

### 2.2 High-Level Architecture

The system will be built as a web-based application using a typical three-layer architecture:

- **Frontend (Client):**
  - Web UI for students, wardens, admins, and workers (e.g., React-based SPA).
- **Backend (API Server):**
  - RESTful APIs for all operations (auth, complaints, rooms, emergencies, staff, notifications).
  - Business logic, validations, and role-based access control. [attached_file:61]
- **Database:**
  - Central data store for users, rooms, complaints, emergencies, notifications, attendance, and history.

> **Diagram placeholder:**  
> `<!-- Diagram: Overall System Architecture (Client–API–Database) in draw.io -->`

---

## 3. Technology Stack (Target)

- **Frontend:** React (or similar SPA), HTML, CSS, JavaScript/TypeScript.
- **Backend:** Node.js with Express (or similar framework) exposing REST APIs.
- **Database:** Relational DB (e.g., MySQL/PostgreSQL) or MongoDB modeled per the schema described in LLD. [attached_file:61]
- **Authentication:** JWT-based authentication with role-based authorization.
- **Deployment (target):** Backend on a cloud platform (e.g., Render), frontend on static hosting (e.g., Vercel/Netlify).

---

## 4. Major Modules and Responsibilities

### 4.1 Administrator Module

- Approve and verify student registrations.
- Assign rooms and maintain student records (room, contact, emergency details).
- Add and manage hostel staff (cleaners, sweepers, cooks, laundry, maintenance workers).
- Configure hostel rules, meal timings, food menu, and announcements.
- Monitor complaints, emergency alerts, staff performance, and escalations. [attached_file:61]

### 4.2 Warden Module

- View and filter all complaints raised by students.
- Assign tasks to appropriate workers and track progress.
- Monitor worker performance and duty adherence.
- Handle emergency requests with top priority.
- Verify and update acknowledgements after work completion. [attached_file:61]

### 4.3 Student Module

- Register and submit personal and room details (subject to admin approval).
- View hostel information such as rules, announcements, meal timings, and food menu.
- Raise complaints related to room maintenance, cleanliness, laundry, or food.
- Track complaint status (Pending, Assigned, In Progress, Completed, Escalated).
- Submit emergency requests (medical help, unsafe situations, urgent room issues). [attached_file:61]

### 4.4 Worker & Staff Management Module

- Manage worker categories (cleaning, sweeping, cooking, laundry, maintenance).
- Maintain worker details: role, duty schedule, timings, and assigned tasks.
- Provide each worker with a task list and ability to update status (Completed / In Progress / Pending / Not Completed).
- Track missed duties and repeated issues for performance evaluation. [attached_file:61]

### 4.5 Complaint Management Module

**High-level flow:**

1. Student raises a complaint with category and description.
2. System categorizes it (Cleaning / Electrical / Water / Laundry / General).
3. Complaint is visible to warden and admin.
4. Warden/admin assigns the task to an appropriate worker.
5. Worker resolves and updates status.
6. Student receives acknowledgement; complaint history is logged.
7. Admin/warden can review complaints and worker performance. [attached_file:61]

> **Diagram placeholder:**  
> `<!-- Diagram: Complaint Lifecycle (Student → Warden/Admin → Worker → Student) in draw.io -->`

### 4.6 Emergency Handling Module

- Dedicated section for emergencies with higher priority than regular complaints.
- Immediate notification to warden (and optionally admin/security).
- Detailed logging of emergency type (medical, safety, critical utility failure).
- Status tracking from Reported → Responded → Resolved. [attached_file:61]

> **Diagram placeholder:**  
> `<!-- Diagram: Emergency Handling Flow in draw.io -->`

### 4.7 Notification & Acknowledgement Module

- System-generated notifications for:
  - New complaints, assignments, status changes, and resolutions.
  - Emergency triggers and status updates.
- Students receive acknowledgement when their issue is marked completed.
- Supports notification read/unread tracking. [attached_file:61]

---

## 5. Additional Functional Capabilities (Phase 2)

The system can be extended to manage the following additional scenarios: [attached_file:61]

- **Room Change Requests**
  - Students can request room changes for reasons like disturbances, roommate issues, ventilation, or health.
  - Warden approves or rejects requests and updates room allocation.

- **Visitor Management**
  - Visitor entry requests with allowed visiting hours.
  - Warden approval and in/out time tracking for improved security.

- **Leave Request Management**
  - Leave applications for going home or outside campus.
  - Approval workflows and optional parent/admin notifications.
  - Leave history tracking.

- **Mess Billing & Payments**
  - Display monthly mess bills, extra charges, fines, and payment history.
  - Optional integration for online payments.

- **Electricity & Water Tracking (Optional)**
  - Capture consumption or repeated issues (low supply, power cuts).
  - Notify students or admin about unusual usage or frequent problems.

- **Lost & Found**
  - Report lost items and log found items with photos.
  - Match items and notify rightful owners.

- **Room Inventory Tracking**
  - Maintain list of room assets (fan, light, bed, table, chair, cupboard).
  - Damage reports and repair/replace requests.
  - Inventory updates by staff.

- **Event & Notice Announcements**
  - Publish hostel events, urgent notices, inspection dates, and rule updates.
  - Notify relevant users within the app.

- **Security Alerts**
  - Allow students to report misbehavior, theft, fire hazards, or suspicious activity.
  - Notify warden/security for quick response.

- **Attendance & In–Out Tracking**
  - Track student hostel return before curfew using QR or check-in.
  - Record late entries and generate alerts/reports.

- **Maintenance Scheduling**
  - Schedule recurring maintenance (cleaning, pest control, electrical checks, water tank cleaning).
  - Automatically assign and remind relevant workers. [attached_file:61]

These features can be planned as Phase 2 or subsequent releases after the core MVP is stable.

---

## 6. High-Level Data Flow

**Complaint Flow:**

Student → Raise Complaint → Warden/Admin → Assign Worker → Worker Updates Status → System Sends Acknowledgement → Student. [attached_file:61]

**Emergency Flow:**

Student → Raise Emergency → Warden (and Admin/Security) Notified → Immediate Action → Status Updates → Resolution Logged. [attached_file:61]

> **Diagram placeholder:**  
> `<!-- Diagram: High-Level Data Flow for Complaints and Emergencies in draw.io -->`

---

## 7. Non-Functional Requirements (High-Level)

- **Security**
  - Passwords stored as secure hashes.
  - JWT-based authentication with role-based access control.
  - Protection of sensitive data (contacts, emergency info). [attached_file:61]

- **Performance & Scalability**
  - Paginated lists for complaints, emergencies, and logs.
  - Efficient queries for filtering by status, category, or date.

- **Reliability & Audit**
  - Logging of complaint and emergency history.
  - Audit trails for status changes and assignments via complaint_history. [attached_file:61]

- **Usability**
  - Simple, mobile-friendly interfaces for students and workers.
  - Clear dashboards for wardens and admins.

---

## 8. MVP vs Phase 2 Scope

**MVP Focus:**

- Authentication & roles (Student, Warden, Admin, Worker).
- Student registration and room assignment.
- Complaint management (full lifecycle).
- Emergency module.
- Worker/task management.
- Notifications and acknowledgements. [attached_file:61]

**Phase 2+ (Optional):**

- Mess billing, visitor/leave management.
- Lost & found, inventory, in–out tracking, security alerts.
- Maintenance scheduling and advanced reporting. [attached_file:61]
