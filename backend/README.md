# SchoolERP — Backend

> Express.js REST API server with layered architecture for the SchoolERP Admin Suite.

---

## 🏗 Architecture Overview

The backend follows a strict **layered architecture** pattern to enforce separation of concerns:

`
Request Flow:

  Client Request
       │
       ▼
  ┌─────────┐
  │  Routes  │  Define endpoints, attach middleware
  └────┬─────┘
       │
       ▼
  ┌──────────────┐
  │  Controllers │  Parse request, call service, send response
  └──────┬───────┘
         │
         ▼
  ┌──────────┐
  │ Services │  Business logic, validation, orchestration
  └────┬─────┘
       │
       ▼
  ┌──────────────┐
  │ Repositories │  Data access, database queries
  └──────┬───────┘
         │
         ▼
  ┌────────┐
  │ Models │  Mongoose schemas & static methods
  └────┬───┘
       │
       ▼
    MongoDB
`

---

## 📁 Folder Structure

`
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   └── jwt.js           # JWT settings
│   │
│   ├── controllers/     # Request handlers (thin layer)
│   │   └── .gitkeep
│   │
│   ├── middleware/       # Express middleware
│   │   ├── auth.js          # JWT authentication & authorization
│   │   ├── errorHandler.js  # Global error handler
│   │   └── notFoundHandler.js # 404 catch-all
│   │
│   ├── models/          # Mongoose schema definitions
│   │   └── .gitkeep
│   │
│   ├── repositories/    # Data access layer
│   │   └── .gitkeep
│   │
│   ├── routes/          # API route definitions
│   │   └── .gitkeep
│   │
│   ├── services/        # Business logic layer
│   │   └── .gitkeep
│   │
│   ├── validators/      # Request validation schemas
│   │   └── .gitkeep
│   │
│   ├── utils/           # Shared utilities
│   │   ├── ApiError.js      # Custom error class
│   │   ├── asyncHandler.js  # Async route wrapper
│   │   └── responseHelper.js # Standard response formatter
│   │
│   ├── constants/       # Application constants & enums
│   │   └── index.js
│   │
│   ├── docs/            # API documentation (Swagger/OpenAPI)
│   │   └── .gitkeep
│   │
│   └── app.js           # Express application setup
│
├── server.js            # Server entry point
├── package.json         # Dependencies & scripts
├── .env.example         # Environment variable template
├── .gitignore           # Git exclusions
└── README.md            # This file
`

---

## 📂 Folder Responsibilities

| Folder            | Responsibility                                                          |
| ----------------- | ----------------------------------------------------------------------- |
| `config/`       | Database connection, JWT config, and other environment-dependent setup  |
| `controllers/`  | Parse request params/body, call the appropriate service, return response. **No business logic.** |
| `middleware/`    | Cross-cutting concerns: authentication, error handling, logging, validation |
| `models/`       | Mongoose schema definitions with validations and virtual fields        |
| `repositories/` | Raw database operations (find, create, update, delete). **No business logic.** |
| `routes/`       | Map HTTP methods + paths to controller functions. Attach auth/validation middleware. |
| `services/`     | **All business logic lives here.** Orchestrates repositories, applies rules, throws errors. |
| `validators/`   | Input validation schemas (using express-validator or Joi)               |
| `utils/`        | Shared helper functions and classes                                     |
| `constants/`    | Application-wide enums, status codes, config values                    |
| `docs/`         | OpenAPI/Swagger specification files                                     |

---

## 🔄 Request Lifecycle

A typical API request flows through these stages:

1. **Route** receives the HTTP request.
2. **Middleware** runs (auth check, rate limit, body parsing).
3. **Validator** validates the request body/params.
4. **Controller** extracts data from the request.
5. **Service** executes business logic.
6. **Repository** performs the database operation.
7. **Response** is formatted and sent back to the client.
8. **Error Handler** catches any thrown errors and returns a standardized error response.

---

## 🔐 Middleware Flow

`
Request
  │
  ├── helmet()              # Security headers
  ├── cors()                # Cross-origin configuration
  ├── rateLimit()           # Request rate limiting
  ├── express.json()        # Body parsing
  ├── morgan()              # Request logging
  │
  ├── authenticate()        # JWT token verification (protected routes)
  ├── authorize(roles...)   # Role-based access control
  ├── validate(schema)      # Input validation
  │
  ├── controller()          # Request handling
  │
  ├── notFoundHandler()     # 404 for unmatched routes
  └── errorHandler()        # Global error formatting
`

---

## 🔑 JWT Authentication Flow

`
┌────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
│                                                             │
│  1. POST /api/auth/login                                    │
│     └── Validate credentials                                │
│     └── Generate JWT + Refresh Token                        │
│     └── Return tokens to client                             │
│                                                             │
│  2. Subsequent Requests                                     │
│     └── Client sends: Authorization: Bearer <token>         │
│     └── auth.js middleware verifies token                    │
│     └── Attaches user to req.user                           │
│     └── Route handler proceeds                              │
│                                                             │
│  3. Token Refresh                                           │
│     └── POST /api/auth/refresh                              │
│     └── Validate refresh token                              │
│     └── Issue new access token                              │
│                                                             │
│  4. Logout                                                  │
│     └── Client removes token from localStorage              │
│     └── Optional: POST /api/auth/logout (blocklist token)   │
└────────────────────────────────────────────────────────────┘
`

---

## ⚠️ Error Handling Strategy

### Custom Error Class
`javascript
import { ApiError } from './utils/ApiError.js';

// Usage in services:
throw new ApiError(404, 'Student not found');
throw new ApiError(400, 'Email already registered');
throw new ApiError(403, 'Insufficient permissions');
`

### Global Error Handler
- Catches all errors thrown or passed to `next(error)`.
- Returns standardized JSON error responses.
- Includes stack traces only in development mode.
- Logs errors to console (and optionally to a log file).

### Async Error Handling
All async route handlers are wrapped with `asyncHandler()` to automatically catch rejected promises:

`javascript
import { asyncHandler } from '../utils/asyncHandler.js';

router.get('/students', asyncHandler(async (req, res) => {
  const students = await studentService.getAll(req.query);
  sendResponse(res, { data: students });
}));
`

---

## 🌐 Environment Variables

| Variable                  | Description                     | Default                     |
| ------------------------- | ------------------------------- | --------------------------- |
| `PORT`                  | Server port                     | `5000`                    |
| `NODE_ENV`              | Environment mode                | `development`             |
| `MONGODB_URI`           | MongoDB connection string       | —                           |
| `JWT_SECRET`            | Secret key for signing JWTs     | —                           |
| `JWT_EXPIRES_IN`        | Access token expiry             | `7d`                      |
| `JWT_REFRESH_EXPIRES_IN`| Refresh token expiry            | `30d`                     |
| `CLIENT_URL`            | Frontend origin for CORS        | `http://localhost:5173`   |

---

## 📐 API Conventions

### Base URL
`
http://localhost:5000/api
`

### Endpoint Naming
| Method   | Endpoint                    | Description            |
| -------- | --------------------------- | ---------------------- |
| GET      | `/api/students`           | List all students      |
| GET      | `/api/students/:id`       | Get single student     |
| POST     | `/api/students`           | Create a student       |
| PUT      | `/api/students/:id`       | Update a student       |
| DELETE   | `/api/students/:id`       | Delete a student       |

### Query Parameters
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 20, max: 100)
- `search` — Text search across relevant fields
- `sort` — Sort field (prefix with `-` for descending)
- `filter` — JSON filter criteria

### Response Format
`json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
`

---

## 💻 Development Commands

`ash
# Install dependencies
npm install

# Start with hot reload (nodemon)
npm run dev

# Start production server
npm start

# Run linter
npm run lint

# Run tests
npm run test
`

---

## 🏥 Health Check

`ash
GET /api/health
`

Returns server status, uptime, and timestamp. Always available, no authentication required.
