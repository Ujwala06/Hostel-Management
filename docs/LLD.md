# College Hostel Management System – Low Level Design (LLD)

## 1. Project Structure

The project is organized as a monorepo with documentation and implementation separated:

- `backend/` – API server, services, models, and database access.
- `frontend/` – Web client (SPA) for all roles.
- `docs/` – Design and requirements:
  - `HLD.md` – High Level Design.
  - `LLD.md` – Low Level Design.
- `docs/diagrams/` – Class, ER, and workflow diagrams (PNG/SVG from draw.io).
- `docs/sql/` – Database scripts (schema.sql, seed.sql).
- `docs/api/` – Detailed API specifications (OpenAPI or Markdown).
- `docs/ui/` – UI wireframes and screenshots. 
> **Diagram placeholder:**  
> `<!-- Diagram: High-Level Module and Folder Structure in draw.io -->`

---

## 2. Core Modules and Use Cases

### 2.1 Complaint Module

Operations:

- `CreateComplaint` – Student submits a complaint with category, description, and optional attachments.
- `ListComplaints` – View complaints:
  - By student (own complaints).
  - By warden/admin (filter by status, category, priority).
- `AssignWorker` – Warden/admin assigns a worker to a complaint.
- `UpdateStatus` – Worker or warden updates complaint status.
- `NotifyStudent` – System sends notifications on status or assignment changes.

### 2.2 Student Management Module

- `RegisterStudent` – Admin/Warden (or public+approval) creates student profile and room mapping.
- `StudentLogin` – Student login using email/password.
- `ViewProfile` – View own details and room allocation.
- `UpdateProfile` – Update contact details and emergency contact. 

### 2.3 Worker & Staff Management Module

- `AddWorker` – Admin creates worker records with role and duty schedule.
- `AssignTask` – Assign complaints or scheduled maintenance tasks to workers.
- `TrackDuty` – Track worker attendance and duty adherence.
- `ViewPerformance` – Aggregate performance metrics (tasks completed, escalations, missed duties). 

### 2.4 Emergency Module

- `RaiseEmergency` – Student raises emergency with description and room.
- `NotifyAuthorities` – System notifies warden and optionally admin/security instantly.
- `LogEmergency` – Track life cycle from Reported → Responded → Resolved. 

### 2.5 Room Management Module

- `AddRoom` – Admin defines hostel rooms (number, floor, capacity, type).
- `AssignStudentToRoom` – Link student to a room, checking capacity.
- `ViewRoomOccupancy` – Show current occupancy and available rooms. 

> **Diagram placeholder:**  
> `<!-- Diagram: Use-Case Diagram for Student, Warden, Admin, Worker in draw.io -->`

---

## 3. Authentication and Authorization

### 3.1 User Roles

A shared auth model is used with roles:

- `STUDENT`
- `WARDEN`
- `ADMIN`
- `WORKER`

Each user record contains identity fields, hashed password, role, and status (active/inactive).

### 3.2 Auth Flows

- **Login Endpoints:**
  - `POST /api/auth/login/student`
  - `POST /api/auth/login/admin`
  - `POST /api/auth/login/worker`  
- Issue JWT tokens containing user ID and role.
- Middleware checks token and enforces role-based access:
  - Students can access only own complaints, emergencies, profile.
  - Workers only see assigned tasks and own attendance.
  - Wardens/admins can manage and view all assigned data per role.

> **Diagram placeholder:**  
> `<!-- Diagram: Auth & Role-Based Access Flow in draw.io -->`

---

## 4. Class / Entity Models

> Note: These can be represented as class diagrams or translated directly into DB tables or MongoDB collections.

### 4.1 Student

Student
student_id: int
name: string
email: string
phone: string
room_no: int (FK → Room.room_no)
password_hash: string
join_date: date
emergency_contact: string
created_at: datetime
updated_at: datetime

Methods:

submitComplaint(category, description)

viewComplaints()

raiseEmergency(description)

updateProfile(phone, emergency_contact)

### 4.2 Worker

Worker
worker_id: int
name: string
role: string // e.g., Cleaner, Plumber, Electrician
phone: string
duty_start_time: time
duty_end_time: time
active: boolean
created_at: datetime

Methods:

viewAssignedTasks()

updateTaskStatus(complaint_id, new_status, notes)

clockIn()

clockOut()

### 4.3 Complaint

Complaint
complaint_id: int
student_id: int (FK → Student.student_id)
category: string // Cleaning, Electrical, Water, Laundry, General
description: text
status: enum {Pending, Assigned, InProgress, Completed, Escalated}
priority: enum {Low, Medium, High}
assigned_worker_id: int (FK → Worker.worker_id, nullable)
assigned_by: int (FK → Admin.admin_id or Warden.admin_id)
created_at: datetime
updated_at: datetime
completed_at: datetime (nullable)

Methods:

assignWorker(worker_id, assigned_by)

updateStatus(new_status, notes)

escalate()

sendAcknowledgement()

### 4.4 Admin / Warden

Admin (also used for Warden with role flag)
admin_id: int
name: string
email: string
phone: string
role: string // ADMIN or WARDEN
password_hash: string
created_at: datetime

Methods:

addStudent(name, email, phone, room_no)

addWorker(name, role, duty_time)

viewAllComplaints(filter)

assignComplaintToWorker(complaint_id, worker_id)

viewWorkerPerformance(worker_id)

### 4.5 Room

Room
room_no: int (PK)
floor: int
capacity: int
current_occupancy: int
room_type: string // Single, Double, etc.
created_at: datetime

Methods:

addStudent(student_id)

removeStudent(student_id)

isFull()

### 4.6 Emergency

Emergency
emergency_id: int
student_id: int (FK → Student.student_id)
description: text
room_no: int (FK → Room.room_no)
status: enum {Reported, Responded, Resolved}
reported_at: datetime
responded_at: datetime (nullable)
resolved_at: datetime (nullable)
responded_by: int (FK → Admin/Warden)

Methods:

notifyAuthorities()

markResponded()

markResolved()

### 4.7 Notification

Notification
notification_id: int
recipient_id: int
recipient_type: enum {Student, Worker, Admin, Warden}
message: text
is_read: boolean
related_complaint_id: int (nullable, FK → Complaint.complaint_id)
related_emergency_id: int (nullable, FK → Emergency.emergency_id)
created_at: datetime

Methods:

send()

markAsRead()




> **Diagram placeholder:**  
> `<!-- Diagram: Class Diagram for Student, Worker, Complaint, Room, Emergency, Notification in draw.io -->`

---

## 5. Database Schema (Relational View)

**students**

- student_id (PK)
- name
- email (unique)
- phone
- room_no (FK → rooms.room_no)
- password_hash
- join_date
- emergency_contact
- created_at
- updated_at 

**workers**

- worker_id (PK)
- name
- role
- phone
- duty_start_time
- duty_end_time
- active
- created_at 

**admins**

- admin_id (PK)
- name
- email (unique)
- password_hash
- role (ADMIN / WARDEN)
- phone
- created_at 

**rooms**

- room_no (PK)
- floor
- capacity
- current_occupancy
- room_type
- created_at 

**complaints**

- complaint_id (PK)
- student_id (FK → students.student_id)
- category
- description
- status (enum)
- priority (enum)
- assigned_worker_id (FK → workers.worker_id, nullable)
- assigned_by (FK → admins.admin_id, nullable)
- created_at
- updated_at
- completed_at (nullable) 

**emergencies**

- emergency_id (PK)
- student_id (FK → students.student_id)
- description
- room_no (FK → rooms.room_no)
- status (enum)
- reported_at
- responded_at (nullable)
- resolved_at (nullable)
- responded_by (FK → admins.admin_id, nullable) 
**notifications**

- notification_id (PK)
- recipient_id
- recipient_type
- message
- is_read
- related_complaint_id (FK → complaints.complaint_id, nullable)
- related_emergency_id (FK → emergencies.emergency_id, nullable)
- created_at 

**attendance**

- attendance_id (PK)
- worker_id (FK → workers.worker_id)
- clock_in
- clock_out
- date
- status (e.g., Present, Absent, Late) 

**complaint_history**

- history_id (PK)
- complaint_id (FK → complaints.complaint_id)
- old_status
- new_status
- changed_by (user id)
- changed_by_type (Admin/Warden/Worker)
- notes
- changed_at 

> **Diagram placeholder:**  
> `<!-- Diagram: ER Diagram for students, workers, admins, rooms, complaints, emergencies, notifications, attendance, complaint_history in draw.io -->`

---

## 6. API Specification (Summary)

### 6.1 Auth

- `POST /api/auth/login/student`
- `POST /api/auth/login/admin`
- `POST /api/auth/login/worker`  
Returns JWT token with role and user details. 

### 6.2 Complaints

- `POST /api/complaints` – Create new complaint (student).
- `GET /api/complaints/student/:student_id` – Get complaints for a student.
- `GET /api/complaints?status=&category=` – Filter complaints for warden/admin.
- `PATCH /api/complaints/:complaint_id/assign` – Assign worker.
- `PATCH /api/complaints/:complaint_id/status` – Update status.
- `PATCH /api/complaints/:complaint_id/escalate` – Escalate complaint.

### 6.3 Emergencies

- `POST /api/emergencies` – Raise emergency.
- `GET /api/emergencies?status=Reported` – View open emergencies.
- `PATCH /api/emergencies/:emergency_id/status` – Update emergency status.

### 6.4 Students

- `POST /api/students` – Create/register student (admin).
- `GET /api/students/:student_id` – Get student details.
- `PATCH /api/students/:student_id` – Update student details.

### 6.5 Workers

- `POST /api/workers` – Add worker.
- `GET /api/workers/:worker_id/tasks` – Get tasks for worker.
- `POST /api/workers/:worker_id/attendance` – Clock-in/out.
- `GET /api/workers/:worker_id/performance` – Performance summary.

### 6.6 Notifications

- `GET /api/notifications/:recipient_id?type=` – List notifications.
- `PATCH /api/notifications/:notification_id/read` – Mark read. 

### 6.7 Rooms

- `POST /api/rooms` – Add room.
- `GET /api/rooms/:room_no` – Get room details.
- `GET /api/rooms?floor=&available=` – Filter rooms by floor/availability.

### 6.8 Error Handling

- Consistent JSON error structure:
  - `code`, `message`, `details?`
- Standard HTTP status codes: 200/201/400/401/403/404/409/500. 

---

## 7. Business Rules and Logic

- Worker assignment should match complaint category and worker role; if no available worker, escalate to warden. 
- Auto-escalation: if a complaint remains unresolved beyond SLA (e.g., 24 hours), status becomes `Escalated` and admin is notified.
- When status becomes `Completed`, system sends acknowledgement notification to the student with completion time. 
- Worker performance is derived from:
  - Number of tasks completed on time.
  - Number of escalations.
  - Attendance records (missed/late). 
- Use enums for statuses and roles to maintain consistency across codebase and database.

---

## 8. Key Workflows

### 8.1 Complaint Lifecycle

1. Student submits complaint (Pending).
2. System notifies warden/admin.
3. Warden/admin assigns worker (Assigned).
4. Worker starts work (InProgress).
5. Worker completes work (Completed).
6. System updates complaint_history at each step.
7. Student receives acknowledgement and can view history. 

### 8.2 Emergency Response

1. Student raises emergency.
2. System creates Emergency record (Reported) and notifies warden/admin/security.
3. Warden/assigned staff marks Responded and later Resolved.
4. History and timestamps recorded for audits. 

### 8.3 Worker Attendance and Performance

1. Worker clocks in/out (attendance records).
2. Tasks completed and statuses updated.
3. Periodic reports aggregate attendance and complaint outcomes for performance view. 

> **Diagram placeholder:**  
> `<!-- Diagram: Workflow for Complaint, Emergency, and Attendance in draw.io -->`

---

## 9. Test Cases & Sample Data

Example scenarios:

- Submit, assign, update, and close a complaint; verify notifications and history rows.
- Raise emergency, transition through statuses, and confirm logs.
- Worker attendance with missed duty triggering warnings or notifications. 

Sample SQL (for relational DB) is stored in `docs/sql/schema.sql` and `docs/sql/seed.sql`, containing examples such as:

- Inserting rooms, students, workers, and complaints for testing.
