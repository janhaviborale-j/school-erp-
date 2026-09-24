# SchoolERP — Admin Suite

<p align="center">
  <strong>A modern, full-stack school management system built with the MERN stack.</strong><br/>
  Manage students, classes, attendance, fees, payments, and reports — all from one clean dashboard.
</p>

---

## 🏗 Architecture

`
┌─────────────────────────────────────────────────────────────────┐
│                         SchoolERP                               │
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────────┐     │
│  │   Frontend        │  REST API   │   Backend             │     │
│  │   React + Vite    │────────────▶│   Express.js          │     │
│  │   Tailwind CSS    │◀────────────│   Mongoose + MongoDB  │     │
│  │   Port 5173       │   JSON      │   Port 5000           │     │
│  └──────────────────┘              └──────────────────────┘     │
│                                           │                     │
│                                           ▼                     │
│                                    ┌──────────────┐             │
│                                    │  MongoDB      │             │
│                                    │  Database     │             │
│                                    └──────────────┘             │
└─────────────────────────────────────────────────────────────────┘
`

---

## 📁 Folder Structure

`
SchoolERP/
├── frontend/          # React + Vite client application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── data/          # Mock data & local store
│   │   ├── pages/         # Route-level page components
│   │   ├── services/      # API service layer (Axios)
│   │   ├── App.tsx        # Root component with routing
│   │   └── main.tsx       # Application entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/           # Express.js REST API server
│   ├── src/
│   │   ├── config/        # DB and JWT configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/     # Auth, error handling, validation
│   │   ├── models/        # Mongoose schemas
│   │   ├── repositories/  # Data access layer
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic layer
│   │   ├── validators/    # Input validation schemas
│   │   ├── utils/         # Shared utilities
│   │   ├── constants/     # Enums and constants
│   │   └── app.js         # Express app setup
│   ├── server.js
│   └── package.json
│
├── docs/              # Project documentation
│   ├── api/               # API endpoint docs
│   ├── architecture/      # System design docs
│   ├── database/          # Schema & ERD docs
│   └── deployment/        # Deployment guides
│
├── phases.md          # Development roadmap
├── memory.md          # Session context & decisions
├── rules.md           # Coding standards & conventions
├── decision.md        # Architecture Decision Records
├── log.md             # Development changelog
└── README.md          # This file
`

---

## ⚙️ Tech Stack

| Layer       | Technology                                      |
| ----------- | ----------------------------------------------- |
| Frontend    | React 19, TypeScript, Vite 8, Tailwind CSS 4    |
| Backend     | Node.js, Express.js 4                           |
| Database    | MongoDB with Mongoose ODM                       |
| Auth        | JWT (JSON Web Tokens) with bcrypt               |
| HTTP Client | Axios with interceptors                         |
| UI          | Lucide React icons, Material Symbols, Framer Motion |
| Fonts       | Inter, Plus Jakarta Sans (Google Fonts)          |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or **bun**)
- **MongoDB** ≥ 7.x (local or Atlas)

### 1. Clone the Repository

`ash
git clone https://github.com/your-username/SchoolERP.git
cd SchoolERP
`

### 2. Setup Frontend

`ash
cd frontend
cp .env.example .env
npm install
npm run dev
`

The frontend will be available at **http://localhost:5173**.

### 3. Setup Backend

`ash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
`

The API server will start at **http://localhost:5000**.

---

## 📋 Available Scripts

### Frontend

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`   | Start Vite dev server          |
| `npm run build` | Production build               |
| `npm run preview` | Preview production build     |
| `npm run lint`  | Run TypeScript type checker    |

### Backend

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`   | Start with nodemon (hot reload)|
| `npm start`     | Start production server        |
| `npm run lint`  | Run ESLint                     |
| `npm run test`  | Run Jest test suite            |

---

## 🌐 Deployment Overview

1. **Frontend** — Build with `npm run build`, deploy `dist/` to any static host (Vercel, Netlify, S3 + CloudFront).
2. **Backend** — Deploy to any Node.js host (Render, Railway, AWS EC2, DigitalOcean).
3. **Database** — Use MongoDB Atlas for managed cloud hosting.

Set `VITE_API_BASE_URL` in the frontend build to point to the deployed backend URL.

---

## 🤝 Contributors

| Name | Role |
| ---- | ---- |
| *Your Name* | Full-Stack Developer |

---

## 📄 License

This project is private and proprietary. All rights reserved.
"# school-erp-" 
