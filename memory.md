# 🧠 SchoolERP — Project Memory

> Persistent context file that tracks the current state of the project so any developer (or AI assistant) can quickly get up to speed.

---

## Current State

| Property         | Value                                    |
| ---------------- | ---------------------------------------- |
| **Phase**        | Phase 1 — Project Foundation (Complete)  |
| **Frontend**     | Fully built with React 19 + Vite + Tailwind CSS 4 |
| **Backend**      | Skeleton created, no APIs implemented    |
| **Database**     | Not connected yet                        |
| **Auth**         | Frontend mock auth via localStorage      |
| **Deployment**   | Not deployed                             |

---

## Project Context

### What is SchoolERP?
SchoolERP Admin Suite is a web-based school management system designed for early education and primary academies. It provides modules for:
- **Dashboard** — KPI overview with key metrics
- **Students** — Full CRUD with search, filter, and detailed profiles
- **Parents** — Guardian management linked to students
- **Classes** — Class and section management
- **Attendance** — Daily attendance marking and history
- **Fees** — Fee structure definition, collection, and pending tracking
- **Payments** — Payment recording and receipt generation
- **Reports** — Analytics and data export
- **Settings** — School configuration

### Architecture Decisions
- **Monorepo layout**: `frontend/` and `backend/` as independent packages under one root.
- **Service-layer pattern** in frontend: each module has a dedicated service file using Axios.
- **Mock data store** (`data/store.js`) uses localStorage for persistence during development.
- **TypeScript** for the React entry points (`App.tsx`, `main.tsx`); component files use `.jsx`.
- **Material Design 3** inspired design system with custom color tokens in `index.css`.

---

## Tech Stack Summary

| Layer       | Stack                                          |
| ----------- | ---------------------------------------------- |
| Frontend    | React 19, Vite 8, Tailwind CSS 4, TypeScript   |
| Backend     | Express.js 4, Mongoose, JWT                    |
| Database    | MongoDB (planned)                              |
| Fonts       | Inter, Plus Jakarta Sans                       |
| Icons       | Lucide React, Material Symbols Outlined        |
| Animations  | Framer Motion (via `motion` package)          |

---

## Key Files

| File/Path                          | Purpose                              |
| ---------------------------------- | ------------------------------------ |
| `frontend/src/App.tsx`           | Root component, defines all routes   |
| `frontend/src/services/api.js`  | Axios instance with interceptors     |
| `frontend/src/data/store.js`    | Mock localStorage data store         |
| `frontend/src/data/mockData.js` | Seed data for all modules            |
| `frontend/src/context/`         | AuthContext and ToastContext          |
| `backend/src/app.js`            | Express application setup            |
| `backend/server.js`             | Server entry point                   |

---

## What Comes Next
1. Install backend dependencies
2. Connect MongoDB
3. Implement JWT authentication
4. Build Student CRUD API (first module)

---

*Last updated: 2026-09-24*
