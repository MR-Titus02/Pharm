## PharMS – Project Tracking

### 1. Project Overview
- **Name**: PharMS – Pharmacy Management System  
- **Backend**: Node.js, Express, MongoDB, JWT auth, RBAC (user/admin), Multer for uploads, centralized error handling, prescription enforcement. Backend is considered **stable** and production-ready for current feature scope.
- **Frontend**: React + React Router v6, Context API for auth, Axios + instance, TailwindCSS, stable routing/layout/auth foundation.
- **Goal**: Deliver a production-grade SaaS-ready pharmacy management frontend on top of the existing backend, with a focus on scalability, maintainability, security, and UX polish.

### 2. Completed Features
- **F1 – Authentication (Frontend)**  
  - Login and Register pages implemented.  
  - JWT stored in `localStorage` and attached via Axios instance.  
  - Role information stored in auth context and used for routing decisions.

- **F2 – Auth State & Protected Routing (Frontend)**  
  - `AuthContext` with persistent login across refresh.  
  - `ProtectedRoute` with `adminOnly` support.  
  - Role-based redirection and layout separation for user/admin.

- **F3 – Layout & Routing Architecture (Frontend)**  
  - `UserLayout` and `AdminLayout` implemented with nested routes via `Outlet`.  
  - Basic dashboards wired for user (`/`) and admin (`/admin`).  
  - Navigation skeleton for Medicines and Requests in both layouts.

> ✅ Status: F1–F3 are considered **functionally complete** and stable enough to build on. Further tweaks may be applied during F6/F7.

### 3. Pending Phases
- **F4 – Medicines Module (Frontend)**  
  - **User-side**:  
    - View medicines list.  
    - View medicine details.  
    - Display stock status.  
    - Indicate whether prescription is required.  
    - Loading & error states, empty states.  
    - Data access through a dedicated medicines service (no direct Axios in components).  
    - Reusable UI components for cards, badges, and layout sections.  
  - **Admin-side**:  
    - View medicines list (with search/filter hooks for F8).  
    - Add new medicine (form with validation).  
    - Edit existing medicine.  
    - Delete medicine (with confirmation).  
    - Optional: upload medicine images (respect backend Multer constraints).  
    - Separate admin services and pages, with robust error handling.

- **F5 – Requests Module (Frontend)**  
  - User: create request (with conditional prescription upload), list own requests, see status changes.  
  - Admin: view all requests, approve/reject, filter by status.  
  - File upload integration, clear status badges, and robust error states.

- **F6 – UI & UX Refinement**  
  - Consistent layout spacing, mobile responsiveness, status color system, toasts, empty states.

- **F7 – Optimization & Production Readiness**  
  - Axios global error interceptors, token expiration handling, refactors, env config cleanup, code deduplication.

- **F8 – Optional Enhancements**  
  - Pagination, search/filtering, dashboard stats, file previews, confirmation dialogs, polish.

- **F9 – Extended Requirements (Spec 4.x–5.x)**  
  - Some advanced features (payments, notifications, delivery tracking, recommendations, multi-language, admin reporting) are not yet implemented and are tracked below for future phases.

### 4. Feature Checklists

#### F4 – Medicines Module (Frontend)
- [x] **F4-U1**: Medicines service layer (`medicineService`) encapsulating all API calls.  
- [x] **F4-U2**: User medicines list page (`/medicines`) with loading, error, and empty states.  
- [x] **F4-U3**: Medicine details page (`/medicines/:id`) with stock status and prescription requirement.  
- [x] **F4-U4**: Reusable UI components (e.g., `MedicineCard`, `StatusBadge`, skeleton/loader).  
- [x] **F4-U5**: Role-safe integration into `UserLayout` routes (no admin-only data leakage).  
- [x] **F4-A1**: Admin medicines list page (`/admin/medicines`) with basic filtering hooks.  
- [x] **F4-A2**: Admin add medicine page with validation and error display.  
- [x] **F4-A3**: Admin edit medicine page with optimistic UI or clear reload path.  
- [x] **F4-A4**: Admin delete medicine with confirmation dialog.  
- [ ] **F4-A5**: Optional medicine image upload UI wired to backend limits.  

#### F5 – Requests Module (Frontend)
- [x] **F5-U1**: Requests service layer (`requestService`) encapsulating request APIs.  
- [x] **F5-U2**: User request creation flow with file upload (when required).  
- [x] **F5-U3**: User requests list with status badges and empty state.  
- [x] **F5-A1**: Admin requests list with filters by status.  
- [x] **F5-A2**: Admin approve/reject flows with clear feedback.  
- [x] **F5-A3**: Robust error handling and permission-aware responses.

#### F6 – UI & UX Refinement
- [x] **F6-1**: Global status color system (e.g., success/warning/error/info + stock/prescription variants).  
- [x] **F6-2**: Toast notifications for success and error events.  
- [x] **F6-3**: Consistent spacing and typography scale for main layouts.  
- [x] **F6-4**: Empty states for key lists (medicines, requests, dashboards).  
- [x] **F6-5**: Mobile responsiveness checks for user/admin core views.

#### F7 – Optimization & Production Readiness
- [x] **F7-1**: Axios global error interceptor for auth errors and generic failures.  
- [x] **F7-2**: Token expiration handling and auto-logout / refresh behavior.  
- [ ] **F7-3**: Refactor duplicated UI and service logic.  
- [x] **F7-4**: Environment configuration review and cleanup.  
- [ ] **F7-5**: Light performance review (bundle size, unnecessary re-renders).

#### F8 – Optional Enhancements
- [ ] **F8-1**: Pagination for medicines and requests.  
- [x] **F8-2**: Search and filtering UX on medicines and requests.  
- [ ] **F8-3**: Admin dashboard statistics and quick-glance KPIs.  
- [x] **F8-4**: File preview (PDF/image) for prescriptions and medicine images.  
- [x] **F8-5**: Confirmation dialogs for destructive actions across the app.

#### F9 – Extended Requirements (Customer/User)
- [x] **F9-U1**: Sign up & log in (with NIC captured at registration).  
- [x] **F9-U2**: View all available tablets/medicines.  
- [x] **F9-U3**: Client-side search tablets by name.  
- [x] **F9-U4**: Client-side filters by category, price range, availability using existing medicine fields.  
- [x] **F9-U5**: View tablet details (name, description, price, manufacturer, prescription required).  
- [x] **F9-U6**: Request tablets with prescription upload when required.  
- [x] **F9-U7**: Capture and persist NIC per request where required.  
- [ ] **F9-U8**: Make online payments after approval (frontend + backend integration).  
- [ ] **F9-U9**: Show in-app notifications for key events (request submitted/approved/rejected, payment, delivery).  
- [ ] **F9-U10**: Track delivery status per request (frontend views).  
- [ ] **F9-U11**: Provide feedback on orders/medicines.

#### F9 – Extended Requirements (Admin)
- [x] **F9-A1**: Login securely (JWT-based).  
- [x] **F9-A2**: Add, update, delete tablets (medicines).  
- [ ] **F9-A3**: Manage tablet categories (CRUD/categories UI on top of `medicine.category`).  
- [x] **F9-A4**: View prescription uploads attached to requests.  
- [x] **F9-A5**: Approve or reject medicine/tablet requests.  
- [x] **F9-A6**: Manage users (basic user list and status management).  
- [ ] **F9-A7**: Manage payments and transactions (payments list, statuses).  
- [ ] **F9-A8**: Control delivery flow and status transitions.  
- [x] **F9-A9**: Reports: orders, users, medicines overview dashboards.

#### F9 – Cross-cutting Features
- [ ] **F9-X1**: Online payment integration (card now, wallet/UPI ready).  
- [ ] **F9-X2**: Email/SMS notifications for key events (signup, request, payment, delivery).  
- [ ] **F9-X3**: Recommendation section on tablet details (related medicines based on category/history).  
- [ ] **F9-X4**: Language selector and i18n plumbing (default English).  
- [ ] **F9-X5**: Persisted language preference per user and across sessions.  

### 5. Iteration Log
> Format: `YYYY-MM-DD – [Phase/Area] – Summary of work and rationale`

- **2026-02-17 – Tracking Setup** – Created `PROJECT_TRACKING.md` to manage phases F4–F8, defined detailed F4 checklist, and documented existing completed features F1–F3 for ongoing reference.
- **2026-02-17 – F4 User Medicines** – Implemented medicines service, user medicines list and detail pages, and shared loading/error/empty/status components with a pharmacy-focused color theme. Integrated routes under `UserLayout` while keeping business logic in the service layer.
- **2026-02-17 – F4 Admin Medicines** – Implemented admin medicines list, create/edit form, and delete with confirmation dialog using the shared service layer and UI primitives. Aligned admin UI with the medical color system and ensured role-based access via protected admin routes.
- **2026-02-17 – F6 Theming Pass** – Applied a cohesive dark, clinical pharmacy theme with gradient backgrounds and card-based shells across auth, user, and admin layouts. Centralized status colors through `StatusBadge` variants and ensured list/empty/loading/error states visually align with the new design.
- **2026-02-17 – F6/F7 Polish & Errors** – Added toast notifications for key flows, implemented a global Axios response interceptor with token expiration handling, and wired session-expiry messaging into the login experience. Confirmed responsive behavior on auth, user, and admin cores and validated env-driven API base URL usage.
- **2026-02-17 – F5 Requests Module** – Implemented request service, user request creation with file upload, user request history view, and admin review interface with status filters and approve/reject actions. Status badges and file links follow the global medical UI system and honor backend permission rules.

### 6. Refactor Notes
> Use this to record architectural improvements and refactor debt paydown.

- **Planned**:  
  - Extract shared UI primitives (buttons, badges, cards, layout sections) as F4/F5 progress to avoid duplication.  
  - Consolidate any repeated loading/error UI into dedicated components during F6/F7.


### 7. Technical Debt
> Use this to track known issues or compromises that should be addressed before/around F7.

- **TD-1**: Auth loading UX is currently a simple text `Loading...` in `ProtectedRoute`. This should be replaced with a consistent skeleton or spinner component during F6 to avoid abrupt transitions.
- **TD-2**: Dashboards for user and admin are placeholders. Real metrics/summary cards should be designed in F8 to better leverage the layouts.
- **TD-3**: `client/src/api/axios.js` is unused and duplicates `client/src/utils/axiosInstance.js`. Scheduled for removal.
- **TD-4**: `adminRequest.controller.js` isolates admin logic, which is good, but need to ensure routes are clean.

### 8. Agent Transition Audit (2026-02-17)
> Summary of findings during handover.

- **State Match**: Project state matches `PROJECT_TRACKING.md` closely. Frontend features F1-F5 are implemented.
- **Code Quality**: Generally good. Separation of concerns is maintained.
- **Security Check**:
  - Auth: JWT + BCrypt used correctly.
  - Uploads: Multer with file type/size limits in place.
  - RBAC: Middleware `protect` and `admin` (implied) usage needs final verification in routes.
- **Action Items**:
  1. Remove `client/src/api/axios.js`.
  2. Verify `request.routes.js` wiring.
  3. Resume development at **F9**.



