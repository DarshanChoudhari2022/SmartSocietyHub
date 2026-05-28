# System Architecture

## Architecture Overview

SmartSocietyHub currently follows a dashboard-centric modular architecture using:

- Next.js App Router
- API route backend
- Prisma ORM
- PostgreSQL
- TypeScript

The project structure already supports scalable module separation, but requires further standardization before becoming production ready.

---

# Current High-Level Structure

```txt
src/
│
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── complaint/
│   ├── gate/
│   └── ...
│
├── components/
├── lib/
├── hooks/
├── types/
├── styles/
└── proxy.ts
```

---

# Current Architectural Style

The current project primarily follows:

```txt
UI → API Route → Prisma → Database
```

This is acceptable for prototypes but becomes difficult to maintain at scale.

---

# Recommended Production Architecture

The project should evolve toward:

```txt
UI
 ↓
Feature Layer
 ↓
Validation Layer
 ↓
Service Layer
 ↓
Repository Layer
 ↓
Database
```

---

# Recommended Folder Architecture

## Proposed Production Structure

```txt
src/
│
├── app/
│
├── modules/
│   ├── auth/
│   ├── residents/
│   ├── complaints/
│   ├── maintenance/
│   ├── visitors/
│   ├── notices/
│   ├── events/
│   └── ...
│
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   ├── validations/
│   └── types/
│
├── services/
├── repositories/
├── middleware/
├── lib/
└── config/
```

---

# Routing Architecture

## Current Routing Pattern

The repository already follows App Router architecture.

### Auth Routes

```txt
/auth/login
/auth/register
/auth/join
```

---

### Dashboard Routes

```txt
/dashboard
/dashboard/complaints
/dashboard/maintenance
/dashboard/visitors
/dashboard/notices
/dashboard/events
```

---

### API Routes

```txt
/api/*
```

Feature-oriented route grouping already exists.

This is good for:

- modular scaling
- AI agent isolation
- independent feature ownership

---

# Module Architecture

Every major feature should become an isolated module.

---

## Example Module Structure

```txt
/modules/complaints
│
├── components/
├── services/
├── repositories/
├── validations/
├── hooks/
├── types/
├── constants/
└── utils/
```

---

# Frontend Architecture

## Current Frontend Direction

The frontend already uses:

- reusable components
- dashboard layouts
- route segmentation
- TailwindCSS

However, consistency is not fully guaranteed yet.

---

## Required Frontend Standards

### Component Categories

```txt
shared/ui/
```

Reusable generic UI:

- buttons
- modals
- tables
- inputs
- cards

---

```txt
modules/<feature>/components/
```

Feature-specific UI:

- complaint card
- visitor approval form
- maintenance invoice table

---

# State Management Architecture

## Current State

State management patterns appear mixed.

Possible patterns:

- local state
- prop drilling
- direct API fetching

---

## Recommended State Strategy

### Local UI State

Use:

- React state

For:

- modal state
- form state
- toggles

---

### Server State

Use:

- TanStack Query

For:

- API caching
- mutations
- refetching
- synchronization

---

### Global App State

Use:

- Zustand

Only for:

- auth session
- theme
- shared app state

Avoid large global stores.

---

# Backend Architecture

## Current Backend Direction

Current backend structure appears route-centric.

Likely pattern:

```txt
Route Handler → Prisma Query
```

This creates:

- duplicated logic
- validation inconsistencies
- permission risks

---

# Recommended Backend Structure

## Standard API Flow

```txt
API Route
 ↓
Request Validation
 ↓
Permission Validation
 ↓
Service Layer
 ↓
Repository Layer
 ↓
Database
```

---

# Validation Architecture

## Required Validation Layer

Use:

- zod

Validation locations:

```txt
/shared/validations/
/modules/*/validations/
```

---

## Validation Requirements

Every API must validate:

- request body
- params
- query values
- permissions

Never trust frontend input.

---

# Service Layer Architecture

## Purpose

Business logic should NEVER remain inside:

- route handlers
- React components

---

## Responsibilities

Service layer handles:

- workflows
- transactions
- business rules
- notifications
- orchestration

---

## Example

```txt
/services/complaint.service.ts
```

Responsibilities:

- create complaint
- assign complaint
- update complaint status
- trigger notifications
- track audit logs

---

# Repository Layer

## Purpose

Database access abstraction.

---

## Benefits

- reusable queries
- easier testing
- cleaner services
- AI-agent consistency

---

## Example

```txt
/repositories/complaint.repository.ts
```

Responsibilities:

- Prisma queries only

No business logic.

---

# Database Architecture

## ORM

Prisma ORM with PostgreSQL.

---

## Current Strengths

- strong entity modeling
- modular entities
- scalable relational structure

---

## Required Improvements

### Add Prisma Enums

Avoid excessive:

```prisma
status String
role String
```

Replace with:

```prisma
enum ComplaintStatus
```

---

### Add Indexes

Required for:

- scalability
- analytics
- filtering
- dashboard performance

---

### Add Soft Delete Strategy

Recommended:

```prisma
isDeleted Boolean @default(false)
deletedAt DateTime?
```

---

# Authentication Architecture

## Current Stack

- NextAuth

---

## Required Security Layers

### Authentication

User identity validation.

---

### Authorization

Role + permission validation.

---

### RBAC

Centralized role system.

---

# Recommended Permission Architecture

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

# Middleware Architecture

## Required Middleware

### Auth Middleware

Protect routes.

---

### Role Middleware

Validate permissions.

---

### Rate Limit Middleware

Protect APIs.

---

### Audit Middleware

Track sensitive operations.

---

# Notification Architecture

## Future Recommended System

Notifications should become event-driven.

Example:

```txt
Complaint Created
 ↓
Event Trigger
 ↓
Notification Service
 ↓
Push/Email/In-App Notification
```

---

# Mobile Architecture

## Current Mobile Direction

Capacitor support already exists.

This means architecture should remain:

- API-first
- mobile-compatible
- responsive

Avoid:

- tightly coupled browser-only logic

---

# AI-Agent Architecture Rules

## Critical Rule

AI agents must NEVER:

- directly modify unrelated modules
- duplicate utilities
- bypass service layer
- write Prisma queries inside UI

---

# Agent Ownership Boundaries

## Frontend Agent

Owns:

- pages
- UI
- responsiveness
- forms

Must NOT:

- modify Prisma schema

---

## Backend Agent

Owns:

- services
- APIs
- business logic

Must NOT:

- redesign UI

---

## Database Agent

Owns:

- Prisma schema
- migrations
- indexing
- relational integrity

---

# Scalability Goals

The architecture should eventually support:

- multi-society SaaS
- realtime notifications
- analytics dashboards
- mobile apps
- AI automation
- background jobs
- event processing

---

# Technical Debt Areas

Current likely debt:

- mixed demo logic
- duplicated API logic
- inconsistent validation
- inconsistent folder conventions
- incomplete permission system

These must be stabilized BEFORE large-scale AI development.

---

# Final Architectural Direction

Target architecture philosophy:

```txt
Modular
Scalable
Secure
AI-Agent Maintainable
Production Ready
```

The project should evolve into:

- isolated modules
- centralized standards
- predictable APIs
- strong security boundaries
- reusable infrastructure
