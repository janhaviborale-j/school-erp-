# SchoolERP — Frontend

> React 19 + Vite 8 + Tailwind CSS 4 admin dashboard for school management.

---

## 🏗 Architecture Overview

The frontend follows a **modular page-based architecture** with a centralized service layer:

`
src/
├── components/            # Reusable UI components
│   ├── auth/              # Authentication-related components
│   │   └── ProtectedRoute.jsx   # Route guard for authenticated pages
│   ├── common/            # Shared components used across modules
│   │   ├── ConfirmationModal.jsx
│   │   ├── EmptyState.jsx
│   │   ├── KpiCard.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── Modal.jsx
│   │   ├── ReceiptModal.jsx
│   │   └── StatusBadge.jsx
│   └── layout/            # Application shell components
│       ├── AppLayout.jsx  # Main layout with sidebar + header
│       ├── Header.jsx     # Top navigation bar
│       └── Sidebar.jsx    # Side navigation menu
│
├── context/               # React Context providers
│   ├── AuthContext.jsx    # Authentication state & methods
│   └── ToastContext.jsx   # Toast notification system
│
├── data/                  # Local data layer (to be replaced by API)
│   ├── mockData.js        # Seed/demo data for all modules
│   └── store.js           # localStorage-backed in-memory store
│
├── pages/                 # Route-level page components
│   ├── attendance/        # Attendance marking & history
│   ├── auth/              # Login page
│   ├── classes/           # Class/section management
│   ├── dashboard/         # KPI dashboard overview
│   ├── fees/              # Fee structure, collection, pending
│   ├── parents/           # Parent/guardian management
│   ├── payments/          # Payment recording & receipts
│   ├── reports/           # Analytics & reports
│   ├── settings/          # School settings configuration
│   └── students/          # Student CRUD & profiles
│
├── services/              # API communication layer
│   ├── api.js             # Axios instance with interceptors
│   ├── attendanceService.js
│   ├── authService.js
│   ├── classService.js
│   ├── feeService.js
│   ├── parentService.js
│   ├── paymentService.js
│   ├── reportService.js
│   ├── settingsService.js
│   └── studentService.js
│
├── App.tsx                # Root component with route definitions
├── main.tsx               # Application entry point
└── index.css              # Tailwind config + design tokens
`

---

## 🗂 Folder Responsibilities

| Folder        | Responsibility                                                                 |
| ------------- | ------------------------------------------------------------------------------ |
| `components/` | Reusable, stateless (mostly) UI building blocks                              |
| `context/`    | Global state providers (auth, notifications)                                 |
| `data/`       | Mock data store — **will be removed** when backend APIs are connected        |
| `pages/`      | Full page components mapped to routes, contain page-level logic              |
| `services/`   | All HTTP calls to the backend API, one file per module                       |

---

## 🧩 State Management Strategy

| State Type     | Solution                | Example                          |
| -------------- | ----------------------- | -------------------------------- |
| Auth state     | `AuthContext`          | Current user, login/logout       |
| Notifications  | `ToastContext`         | Success/error toast messages     |
| Page-level     | `useState` / `useEffect` | Form data, filters, pagination |
| Server data    | Service layer + local state | Fetched lists, CRUD results   |

**Rules:**
- No Redux or Zustand — React Context + hooks are sufficient for this scale.
- Components call services, services call the API, API handles interceptors.
- Keep business logic in services, not in components.

---

## 🔌 API Service Layer

Each module has a dedicated service file in `services/`. All services import the shared Axios instance from `api.js`.

### `api.js` — Shared Axios Instance
- Base URL from `VITE_API_BASE_URL` environment variable.
- **Request interceptor:** Attaches JWT from `localStorage`.
- **Response interceptor:** Handles 401 (auto-logout), network errors, and standard error formatting.

### Service File Convention
`javascript
// services/studentService.js
import api from './api';

export const getStudents = (params) => api.get('/students', { params });
export const getStudent = (id) => api.get(/students/);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(/students/, data);
export const deleteStudent = (id) => api.delete(/students/);
`

---

## 🛣 Route Structure

| Path                    | Page Component      | Module     |
| ----------------------- | ------------------- | ---------- |
| `/login`              | Login               | Auth       |
| `/dashboard`          | Dashboard           | Dashboard  |
| `/students`           | Students            | Students   |
| `/students/add`       | AddStudent          | Students   |
| `/students/:id`       | StudentDetails      | Students   |
| `/students/edit/:id`  | EditStudent         | Students   |
| `/parents`            | Parents             | Parents    |
| `/classes`            | Classes             | Classes    |
| `/attendance`         | Attendance          | Attendance |
| `/attendance/history` | AttendanceHistory   | Attendance |
| `/fees`               | FeeCollection       | Fees       |
| `/fees/pending`       | PendingFees         | Fees       |
| `/fees/structure`     | FeeStructure        | Fees       |
| `/payments`           | Payments            | Payments   |
| `/reports`            | Reports             | Reports    |
| `/settings`           | Settings            | Settings   |

All routes except `/login` are wrapped in `ProtectedRoute` and `AppLayout`.

---

## 🌐 Environment Variables

| Variable              | Description              | Default                      |
| --------------------- | ------------------------ | ---------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL     | `http://localhost:5000/api` |

Copy `.env.example` to `.env` before running.

---

## 💻 Development Commands

`ash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run lint
`

---

## 🎨 Design System

The UI is built on a **Material Design 3-inspired** custom design system:

- **Fonts:** Inter (body), Plus Jakarta Sans (headings)
- **Icons:** Lucide React + Material Symbols Outlined
- **Colors:** Custom M3 color tokens defined in `index.css` `@theme` block
- **Animations:** Framer Motion (via `motion` package)
- **Scrollbars:** Custom styled WebKit scrollbars
