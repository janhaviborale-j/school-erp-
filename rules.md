# 📏 SchoolERP — Project Rules & Coding Standards

> Enforced conventions for consistency, quality, and maintainability across the codebase.

---

## General Rules

1. **Do not mix frontend and backend code.** Each has its own `package.json` and runs independently.
2. **Never commit `.env` files.** Only `.env.example` with placeholder values.
3. **All new features** must be documented in `log.md` and tracked in `phases.md`.
4. **Architecture decisions** must be recorded in `decision.md` before implementation.

---

## Frontend Rules

### File Naming
- **Components:** PascalCase — `StudentDetails.jsx`
- **Services:** camelCase — `studentService.js`
- **Utilities:** camelCase — `formatCurrency.js`
- **Context providers:** PascalCase — `AuthContext.jsx`

### Component Guidelines
- One component per file.
- Co-locate related components in module folders (e.g., `pages/students/`).
- Use functional components with hooks — no class components.
- Keep components under 300 lines; extract sub-components when exceeding.

### State Management
- Use **React Context** for global state (auth, toasts).
- Use **local component state** (`useState`) for UI-only state.
- Service layer handles all API communication — components never call Axios directly.

### Styling
- Use **Tailwind CSS utility classes** exclusively.
- Custom design tokens are defined in `index.css` under `@theme`.
- No inline `style={{}}` objects unless absolutely necessary.

### Imports
- Group imports: React → third-party → local (components, services, utils).
- Use relative imports within the `src/` directory.

---

## Backend Rules

### File Naming
- **Models:** PascalCase singular — `Student.js`
- **Controllers:** camelCase with `.controller.js` suffix — `student.controller.js`
- **Routes:** camelCase with `.routes.js` suffix — `student.routes.js`
- **Services:** camelCase with `.service.js` suffix — `student.service.js`
- **Middleware:** camelCase — `authenticate.js`

### Architecture Layers
`
Request → Route → Controller → Service → Repository → Model → Database
`
- **Routes:** Define HTTP endpoints and attach middleware.
- **Controllers:** Parse request, call service, send response. No business logic.
- **Services:** All business logic lives here.
- **Repositories:** Database queries only. No business logic.
- **Models:** Mongoose schema definitions only.

### API Response Format
All API responses must follow this structure:
`json
{
  "success": true,
  "message": "Description of result",
  "data": {},
  "meta": { "page": 1, "limit": 20, "total": 150 }
}
`

### Error Response Format
`json
{
  "success": false,
  "error": "Human-readable error message",
  "stack": "Only in development"
}
`

### HTTP Status Codes
| Code | Usage                              |
| ---- | ---------------------------------- |
| 200  | Successful GET, PUT, PATCH         |
| 201  | Successful POST (resource created) |
| 204  | Successful DELETE (no content)     |
| 400  | Validation error                   |
| 401  | Unauthorized (missing/invalid JWT) |
| 403  | Forbidden (insufficient role)      |
| 404  | Resource not found                 |
| 409  | Conflict (duplicate record)        |
| 500  | Internal server error              |

### Security Rules
- Always hash passwords with **bcrypt** (min 12 salt rounds).
- Validate and sanitize all user input.
- Use **helmet** for HTTP security headers.
- Use **rate limiting** on all API routes.
- Never expose stack traces in production.

---

## Git Rules

### Commit Messages
Follow Conventional Commits:
`
feat: add student enrollment API
fix: correct fee calculation rounding error
docs: update API documentation for payments
refactor: extract validation to middleware
chore: upgrade mongoose to v8.10
`

### Branch Naming
`
feature/student-crud-api
fix/fee-calculation-bug
docs/api-endpoints
refactor/auth-middleware
`

---

*These rules are mandatory for all contributors.*
