# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

College Hostel Management System - a web-based application for managing hostel operations including student registration, complaint management, emergency handling, worker management, and room allocation.

**Tech Stack:**
- Backend: Node.js + Express + MongoDB (Mongoose)
- Frontend: Not yet implemented (planned: React)
- Authentication: JWT-based with role-based access control

## Development Commands

### Backend

Navigate to Backend directory first:
```powershell
cd Backend
```

**Start Development Server:**
```powershell
npm run dev
```
Uses nodemon for hot-reloading during development.

**Start Production Server:**
```powershell
npm start
```

**Install Dependencies:**
```powershell
npm install
```

**Health Check:**
Test if the server is running:
```powershell
curl http://localhost:5000/api/health
```

### Environment Setup

Backend requires `.env` file in `Backend/` directory with:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `PORT` - Server port (defaults to 5000)

## Architecture

### Role-Based System

Four user roles with distinct permissions:
- **STUDENT** - Create complaints/emergencies, view own data
- **WORKER** - View assigned tasks, update complaint status
- **WARDEN** - Manage complaints, assign workers, handle emergencies
- **ADMIN** - Full system access, manage users and configuration

### Data Models

Core entities and their relationships:

**Student** → linked to Room (roomNo), creates Complaints and Emergencies
**Worker** → assigned to Complaints, tracks Attendance
**Admin** → manages system (role: ADMIN or WARDEN)
**Complaint** → references Student, Worker, Admin; tracks status through lifecycle
**Emergency** → references Student, higher priority than complaints
**Notification** → sent to any user type (Student/Worker/Admin/Warden)
**ComplaintHistory** → audit trail for all complaint status changes
**Room** → tracks capacity and occupancy
**Attendance** → tracks worker clock-in/clock-out

### Complaint Lifecycle

Status flow: `Pending` → `Assigned` → `InProgress` → `Completed` (or `Escalated`)

Every status change is logged in ComplaintHistory with:
- Old and new status
- Who made the change (changedBy + changedByType)
- Timestamp and optional notes

### Authentication Flow

Three separate login endpoints:
- `POST /api/auth/login/student` - email + password
- `POST /api/auth/login/admin` - email + password (returns ADMIN or WARDEN role)
- `POST /api/auth/login/worker` - phone + password

All return JWT token with user ID and role. Token must be sent as `Authorization: Bearer <token>` header.

Middleware `authMiddleware.js` validates JWT and enforces role restrictions on routes.

### API Structure

Routes are organized by domain:
- `/api/auth/*` - Authentication (auth.routes.js)
- `/api/complaints/*` - Complaint management (complaint.routes.js)
- `/api/emergencies/*` - Emergency handling (emergency.routes.js)
- `/api/students/*` - Student operations (referenced in server.js, file missing)
- `/api/workers/*` - Worker management (referenced in server.js, file missing)
- `/api/rooms/*` - Room allocation (referenced in server.js, file missing)
- `/api/notifications/*` - Notifications (referenced in server.js, file missing)

**Note:** server.js references several route files that don't exist yet (student.routes.js, worker.routes.js, room.routes.js, notification.routes.js). These need to be created.

## Important Patterns

### Model References
When creating Mongoose models, use `mongoose.Schema.Types.ObjectId` with `ref` for relationships:
```javascript
student: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Student',
  required: true
}
```

### Password Handling
Always use `bcryptjs` for password hashing:
- Hash passwords with `bcrypt.hash()` before storing
- Compare with `bcrypt.compare()` during login
- Never store or log plain-text passwords

### Route Protection
Wrap protected routes with auth middleware:
```javascript
router.post('/', auth(['STUDENT']), async (req, res) => {
  // req.user contains decoded JWT: { id, role }
});
```

### Error Handling
Maintain consistent error responses:
- Return appropriate HTTP status codes (400/401/403/404/500)
- Include descriptive message in JSON: `{ message: 'Error description' }`
- Log errors with context for debugging

## File Naming Inconsistencies

**Known Issue:** `complaintHistory.model.js` is misspelled as `complainHIstory.model.js` in the filesystem. The import in complaint.routes.js correctly references it as `ComplaintHistory` (capital H).

When working with complaint history:
- File path: `Backend/models/complainHIstory.model.js`
- Import name: `require('../models/complaintHistory.model')`
- Model name: `ComplaintHistory`

## Design Documentation

High-level and low-level design documents are in `docs/`:
- `docs/HLD.md` - System architecture, modules, actors, and MVP scope
- `docs/LLD.md` - Detailed schemas, API specs, workflows, and business rules

Reference these documents when:
- Adding new features or endpoints
- Understanding entity relationships
- Clarifying business rules (SLA, escalation, worker assignment logic)
- Planning Phase 2 features (mess billing, visitor management, leave requests, etc.)

## Frontend Development

Frontend directory exists but is currently empty. When implementing:
- Follow role-based UI patterns (different dashboards for Student/Worker/Warden/Admin)
- Use JWT from login response for authenticated API calls
- Reference API endpoints and models documented in LLD.md
