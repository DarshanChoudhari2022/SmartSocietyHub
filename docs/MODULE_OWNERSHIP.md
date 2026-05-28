# Module Ownership

## Purpose

Defines strict ownership boundaries for AI agents to prevent:

- conflicting edits
- duplicated logic
- architectural inconsistency
- uncontrolled refactors

Every AI agent must stay within its assigned scope.

---

# Core Rule

Agents must NOT:

- modify unrelated modules
- redesign architecture without approval
- duplicate utilities/services
- bypass standards

---

# Ownership Model

```txt
One Module
=
One Responsible Agent
```

Shared areas require coordination.

---

# Architecture Agent

## Owns

```txt
/shared
/config
/core architecture
folder structure
```

## Responsibilities

- architecture consistency
- dependency cleanup
- standardization
- module boundaries

## Must NOT

- implement feature workflows
- modify business logic deeply

---

# Database Agent

## Owns

```txt
/prisma
database schema
migrations
indexes
```

## Responsibilities

- schema updates
- relational integrity
- enums
- migrations
- query optimization

## Must NOT

- redesign UI
- change frontend logic

---

# Auth & Security Agent

## Owns

```txt
/auth
/middleware
/permissions
/security utilities
```

## Responsibilities

- RBAC
- auth middleware
- permission validation
- protected APIs

## Must NOT

- redesign unrelated modules

---

# Backend Agent

## Owns

```txt
/api
/services
/repositories
/validations
```

## Responsibilities

- APIs
- workflows
- business logic
- validation
- transactions

## Must NOT

- modify Prisma schema
- redesign UI

---

# Frontend Agent

## Owns

```txt
/components
/pages
/frontend UI
```

## Responsibilities

- forms
- responsiveness
- UX
- loading/error states

## Must NOT

- access Prisma directly
- implement backend logic

---

# Reviewer Agent

## Responsibilities

- detect duplicate logic
- enforce standards
- validate architecture
- review permissions/security
- catch API mismatches

## Authority

Can block merges if:

- standards violated
- architecture inconsistent
- security risk exists

---

# Testing Agent

## Owns

```txt
/tests
testing setup
workflow validation
```

## Responsibilities

- integration tests
- auth tests
- workflow tests
- regression prevention

---

# Deployment Agent

## Owns

```txt
deployment
CI/CD
monitoring
environment configs
```

## Responsibilities

- production deployment
- build optimization
- monitoring
- infrastructure setup

---

# Shared Ownership Rules

## Shared Areas

Require coordination:

```txt
/shared
/types
/config
```

---

# Forbidden Practices

## Agents MUST NEVER

### Edit Random Files

Only modify owned areas.

---

### Duplicate Utilities

Reuse shared logic.

---

### Bypass API Contracts

Frontend/backend must follow:

```txt
API_CONTRACTS.md
```

---

### Modify Schema Without Approval

Only Database Agent controls schema.

---

# Merge Rules

Every PR must:

- pass lint
- pass type checks
- follow ownership rules
- pass reviewer checks

---

# Recommended Git Branching

Examples:

```txt
feature/frontend/complaints
feature/backend/visitors
feature/auth/rbac
feature/database/schema-v2
```

---

# Communication Rules

## Frontend ↔ Backend

Communicate through:

```txt
API_CONTRACTS.md
```

---

## Backend ↔ Database

Coordinate:

- migrations
- enums
- relationship changes

---

# Conflict Resolution

If ownership overlaps:

1. Architecture Agent decides structure
2. Reviewer Agent validates consistency
3. Database Agent has final schema authority

---

# Final Principle

The project scales safely ONLY when:

```txt
ownership boundaries are respected
```

More agents do NOT guarantee better results.

Better coordination does.
