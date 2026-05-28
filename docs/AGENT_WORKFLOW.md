# AI Agent Workflow

## Purpose

This document defines:

- AI agent responsibilities
- ownership boundaries
- execution order
- collaboration rules
- conflict prevention strategy

This file is REQUIRED for multi-agent development.

Without strict workflow control:

- agents overwrite each other
- architecture becomes inconsistent
- duplicate logic spreads
- production quality collapses

---

# Core Development Philosophy

The project must evolve as:

```txt
Modular
Predictable
Documented
AI-Agent Maintainable
Production Ready
```

---

# Critical Multi-Agent Rules

## Rule 1 — Agents Must Have Ownership Boundaries

Every AI agent must own ONLY specific responsibilities.

Agents must NEVER:

- freely edit the entire codebase
- redesign unrelated modules
- bypass standards
- duplicate architecture

---

## Rule 2 — No Direct Prisma Access in UI

Frontend agents must NEVER:

- write Prisma queries
- embed database logic
- bypass APIs

---

## Rule 3 — Business Logic Must Stay Centralized

Business logic belongs ONLY in:

- services
- workflows
- backend domain logic

NOT inside:

- React components
- API route handlers
- utility files

---

## Rule 4 — Every API Must Be Validated

All APIs require:

- request validation
- permission validation
- standardized responses
- centralized error handling

---

## Rule 5 — Demo Logic Must Be Removed

AI agents must progressively remove:

- hardcoded arrays
- static metrics
- placeholder APIs
- local fake state

---

# Agent Hierarchy

## Recommended Agent Order

```txt
1. Architecture Agent
2. Database Agent
3. Auth/Security Agent
4. Backend Agent
5. Frontend Agent
6. Reviewer Agent
7. Testing Agent
8. Deployment Agent
```

---

# Agent Definitions

# 1. Architecture Agent

## Responsibilities

Owns:

- folder structure
- architectural consistency
- module boundaries
- dependency cleanup
- standardization
- technical debt reduction

---

## Allowed To Modify

```txt
src/
shared/
config/
architecture-related files
```

---

## Must NOT

- implement business features
- redesign database schema
- create production workflows

---

## Main Goals

### Stabilize Architecture

Convert:

```txt
prototype structure
```

into:

```txt
scalable production architecture
```

---

### Standardize Conventions

Ensure:

- naming consistency
- folder consistency
- reusable abstractions
- centralized utilities

---

# 2. Database Agent

## Responsibilities

Owns:

- Prisma schema
- migrations
- indexes
- relational integrity
- query optimization

---

## Allowed To Modify

```txt
prisma/
database-related services
repository layer
```

---

## Must NOT

- redesign UI
- modify frontend flows
- create business UI logic

---

## Main Goals

### Harden Database Design

Tasks:

- add enums
- optimize relationships
- add indexes
- add audit fields
- improve financial consistency

---

### Prevent Schema Chaos

ONLY database agent can:

- alter schema
- generate migrations

No other agents may modify schema.

---

# 3. Auth & Security Agent

## Responsibilities

Owns:

- authentication
- authorization
- RBAC
- route protection
- API permissions
- middleware security

---

## Allowed To Modify

```txt
middleware/
auth/
permissions/
security utilities
```

---

## Must NOT

- redesign unrelated modules
- modify financial logic
- redesign UI

---

## Main Goals

### Centralized RBAC

Implement:

```txt
User
 ↓
Role
 ↓
Permissions
 ↓
Protected Actions
```

---

### Secure APIs

Every protected route must validate:

- authentication
- permissions
- ownership access

---

# 4. Backend Agent

## Responsibilities

Owns:

- APIs
- services
- workflows
- business logic
- validation integration

---

## Allowed To Modify

```txt
app/api/
services/
repositories/
validations/
```

---

## Must NOT

- redesign database schema
- create unrelated UI systems

---

## Main Goals

### Create Service Layer

Move business logic OUT of:

- route handlers
- React components

---

### Standardize APIs

All APIs should follow:

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

---

### Add Validation

Use:

- zod
- centralized validators

---

# 5. Frontend Agent

## Responsibilities

Owns:

- pages
- forms
- UX
- responsiveness
- state handling
- loading/error states

---

## Allowed To Modify

```txt
components/
frontend pages/
feature UI
```

---

## Must NOT

- access Prisma directly
- create backend logic
- modify schema

---

## Main Goals

### Production-Ready UI

Add:

- loading states
- empty states
- validation feedback
- accessibility
- responsive layouts

---

### Remove UI Inconsistency

Standardize:

- cards
- forms
- tables
- spacing
- typography

---

# 6. Reviewer Agent

## Responsibilities

Owns:

- code quality review
- consistency validation
- architecture auditing
- duplicate detection
- standards enforcement

---

## Allowed To Modify

Small fixes only.

Large architectural changes require architecture agent approval.

---

## Main Goals

### Detect Problems

Examples:

- duplicate logic
- API mismatches
- type inconsistencies
- security holes
- permission bypasses

---

### Enforce Standards

Reviewer agent acts as:

```txt
Quality Gatekeeper
```

---

# 7. Testing Agent

## Responsibilities

Owns:

- test setup
- integration tests
- API tests
- workflow tests
- regression testing

---

## Main Goals

### Production Reliability

Ensure:

- critical workflows work
- auth cannot be bypassed
- financial operations remain consistent

---

# 8. Deployment Agent

## Responsibilities

Owns:

- CI/CD
- deployment configs
- Docker
- environment setup
- production optimization

---

# Recommended Execution Flow

# Phase 1 — Architecture Stabilization

Agent:

```txt
Architecture Agent
```

Tasks:

- clean structure
- remove dead code
- standardize folders
- isolate modules

---

# Phase 2 — Database Hardening

Agent:

```txt
Database Agent
```

Tasks:

- finalize schema
- create enums
- optimize indexes
- stabilize migrations

---

# Phase 3 — Security Foundation

Agent:

```txt
Auth/Security Agent
```

Tasks:

- RBAC
- middleware
- permission system
- protected APIs

---

# Phase 4 — Backend Stabilization

Agent:

```txt
Backend Agent
```

Tasks:

- service layer
- validation
- business workflows
- standardized APIs

---

# Phase 5 — Frontend Productionization

Agent:

```txt
Frontend Agent
```

Tasks:

- forms
- UX polish
- responsive fixes
- workflow completion

---

# Phase 6 — QA & Review

Agents:

- Reviewer Agent
- Testing Agent

Tasks:

- audit
- consistency checks
- regression testing

---

# Phase 7 — Deployment

Agent:

```txt
Deployment Agent
```

Tasks:

- production configs
- monitoring
- deployment pipeline

---

# Branching Strategy

## Recommended Git Strategy

Each agent should work on:

```txt
feature/<agent-name>/<module>
```

Examples:

```txt
feature/frontend/complaints
feature/backend/maintenance
feature/auth/rbac
feature/database/schema-v2
```

---

# Merge Rules

## Before Merge

Every PR must pass:

- lint
- type checks
- reviewer audit
- permission validation
- architecture consistency

---

# Forbidden Practices

## AI Agents MUST NEVER

### Modify Random Files

No uncontrolled edits.

---

### Duplicate Utilities

Always reuse shared utilities.

---

### Bypass Validation

Every API requires validation.

---

### Add Temporary Mock Logic

No fake production behavior.

---

### Break Ownership Boundaries

Agents stay within responsibilities.

---

# Communication Rules Between Agents

## APIs Must Be Contract-Driven

Frontend and backend agents communicate through:

```txt
API_CONTRACTS.md
```

---

## Database Changes Must Be Announced

Database agent must document:

- migration changes
- enum changes
- relationship changes

before merge.

---

# Recommended AI Tools

## Suggested Usage

### GPT

Best for:

- architecture
- planning
- reviewing
- workflow design

---

### Claude / Codex

Best for:

- implementation
- large feature generation
- refactoring

---

### Cursor / Windsurf

Best for:

- execution environment
- iterative development
- agent orchestration

---

# Critical Success Factor

The success of multi-agent development depends on:

```txt
STRICT EXECUTION DISCIPLINE
```

NOT:

```txt
more agents
```

Poorly coordinated agents create:

- chaos
- duplicated logic
- inconsistent systems

Well-structured agents create:

- scalable development
- fast implementation
- maintainable architecture

---

# Final Workflow Philosophy

The project should evolve through:

```txt
Small Controlled Improvements
```

NOT:

```txt
massive uncontrolled AI rewrites
```

Architecture stability must always be prioritized before feature expansion.
