# 📐 SchoolERP — Architecture Decision Records (ADR)

> This document records all significant architecture and technology decisions with context, rationale, and consequences.

---

## ADR-001: Monorepo with Independent Packages

**Date:** 2026-09-24  
**Status:** Accepted

### Context
The project started as a standalone React frontend. As we prepare to add a backend, we need to decide on the project structure.

### Decision
Use a **monorepo layout** with `frontend/` and `backend/` as independent subdirectories, each with their own `package.json`.

### Rationale
- Both apps can be developed, tested, and deployed independently.
- Simpler than a true monorepo tool (Nx, Turborepo) for a two-package project.
- Clear separation of concerns.
- Each team member can work in their own directory without merge conflicts.

### Consequences
- Must run `npm install` separately in each directory.
- No shared dependency deduplication (acceptable for this project size).
- Need separate CI/CD pipelines for frontend and backend.

---

## ADR-002: Express.js with Layered Architecture

**Date:** 2026-09-24  
**Status:** Accepted

### Context
We need a backend framework and code organization strategy.

### Decision
Use **Express.js** with a strict layered architecture: Routes → Controllers → Services → Repositories → Models.

### Rationale
- Express is the most widely-used Node.js framework with the largest ecosystem.
- Layered architecture enforces separation of concerns and testability.
- Each layer has a single responsibility, making the codebase easy to navigate.
- Services layer can be unit-tested without HTTP concerns.

### Consequences
- More files and directories than a minimal Express setup.
- New developers need to understand the layer boundaries.
- Worth the trade-off for long-term maintainability.

---

## ADR-003: JWT for Authentication

**Date:** 2026-09-24  
**Status:** Accepted

### Context
The admin dashboard needs authentication. We need to decide between session-based auth and token-based auth.

### Decision
Use **JWT (JSON Web Tokens)** stored in localStorage on the frontend.

### Rationale
- Stateless — no server-side session storage required.
- Works well with the existing frontend `AuthContext` pattern.
- The frontend already stores tokens in localStorage (`schoolerp_token`).
- Easy to implement role-based access control with JWT claims.

### Consequences
- Tokens in localStorage are vulnerable to XSS (mitigated by input sanitization and CSP headers).
- Token revocation requires a blocklist or short expiry + refresh tokens.
- Must implement token refresh flow for long-lived sessions.

---

## ADR-004: MongoDB with Mongoose ODM

**Date:** 2026-09-24  
**Status:** Accepted

### Context
We need a database for the school management data.

### Decision
Use **MongoDB** with **Mongoose** as the ODM.

### Rationale
- Schema flexibility suits the evolving nature of school data structures.
- Mongoose provides schema validation, middleware, and query helpers.
- MongoDB Atlas offers a generous free tier for development and small-scale production.
- JSON-native storage aligns naturally with the Express.js + React stack.

### Consequences
- No built-in relational integrity (must enforce in application layer).
- Need to design indexes carefully for query performance.
- Mongoose schemas provide structure while retaining flexibility.

---

*Add new ADRs below. Number them sequentially.*
