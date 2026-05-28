# Coding Standards

## Purpose

This document defines mandatory development standards for:

- AI agents
- contributors
- reviewers
- future maintainers

The goal is to keep the SmartSocietyHub codebase:

- scalable
- predictable
- maintainable
- production-ready
- AI-agent friendly

---

# Core Philosophy

The codebase should prioritize:

```txt
Consistency > Cleverness
```

and

```txt
Maintainability > Shortcuts
```

---

# General Rules

## Rule 1 — Never Assume Existing Patterns Are Correct

The repository contains:

- prototype code
- demo logic
- inconsistent implementations

AI agents must NOT blindly copy patterns from existing files.

Always follow:

```txt
documented standards
```

NOT:

```txt
existing inconsistencies
```

---

## Rule 2 — Prefer Simplicity

Avoid:

- overengineering
- deeply abstracted systems
- unnecessary complexity

Prefer:

- readable code
- predictable structures
- modular logic

---

## Rule 3 — Production Mindset Only

No:

- fake production logic
- temporary hacks
- silent failures
- hidden mock data

---

# TypeScript Standards

## Strict Typing Required

Avoid:

```ts
any
```

Use:

```ts
interfaces
types
zod inference
```

---

# Example

## Bad

```ts
const user: any = data;
```

---

## Good

```ts
interface User {
  id: string;
  name: string;
}
```

---

# Shared Types

Shared types belong in:

```txt
/shared/types/
/modules/*/types/
```

Do NOT duplicate types across modules.

---

# Component Standards

# Component Categories

## Shared Components

Location:

```txt
/shared/ui/
```

Purpose:

- generic reusable UI

Examples:

- Button
- Modal
- Table
- Input
- Card

---

## Feature Components

Location:

```txt
/modules/<feature>/components/
```

Purpose:

- feature-specific UI

Examples:

- ComplaintCard
- VisitorApprovalForm
- BillSummaryTable

---

# Component Rules

## Keep Components Small

Avoid:

- giant components
- mixed responsibilities

Preferred:

- composable components
- isolated logic

---

## Avoid Deep Prop Drilling

Use:

- composition
- local state
- scoped context

Avoid:

- excessive prop chains

---

## Separate UI from Logic

Avoid:

- large business logic inside components

Use:

- hooks
- services
- utilities

---

# State Management Standards

# Allowed State Types

## Local UI State

Use:

```ts
useState
```

For:

- modals
- toggles
- temporary form state

---

## Server State

Recommended:

```txt
TanStack Query
```

For:

- API fetching
- caching
- mutations
- synchronization

---

## Global State

Recommended:

```txt
Zustand
```

ONLY for:

- auth session
- global preferences
- lightweight shared state

Avoid massive global stores.

---

# API Standards

# Standard API Response

## Success

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

---

## Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request"
  }
}
```

---

# API Rules

## Every API Must

- validate input
- validate permissions
- sanitize responses
- handle errors consistently

---

## Never

- expose raw Prisma errors
- trust frontend permissions
- return inconsistent formats

---

# Validation Standards

# Required Library

```txt
zod
```

---

# Validation Requirements

Validate:

- request body
- params
- query values
- environment variables

---

# Frontend Validation

Frontend validation improves UX.

Backend validation is ALWAYS mandatory.

Never rely only on frontend validation.

---

# Database Standards

# Prisma Rules

## Only Backend/Repository Layers Access Prisma

Forbidden:

```txt
UI → Prisma
```

Required:

```txt
UI → API → Service → Repository → Prisma
```

---

# Repository Layer Rules

Repositories should contain:

- database queries only

Repositories should NOT contain:

- business logic
- workflows
- permissions

---

# Service Layer Standards

# Service Responsibilities

Services handle:

- workflows
- business rules
- transactions
- orchestration
- notifications

---

# Example

```txt
/services/complaint.service.ts
```

Responsibilities:

- create complaint
- assign complaint
- update status
- trigger notifications

---

# Authentication Standards

# Authentication

Handled by:

- NextAuth
- session validation

---

# Authorization

Must ALWAYS be server-side.

Never trust:

```txt
frontend role checks
```

---

# Permission Standards

Every sensitive operation must validate:

- role
- ownership
- access scope

---

# File Naming Standards

# Components

Use:

```txt
PascalCase.tsx
```

Example:

```txt
ComplaintCard.tsx
```

---

# Hooks

Use:

```txt
useSomething.ts
```

Example:

```txt
useComplaints.ts
```

---

# Utilities

Use:

```txt
camelCase.ts
```

Example:

```txt
formatCurrency.ts
```

---

# Folder Naming

Use:

```txt
kebab-case
```

Example:

```txt
visitor-management
```

---

# Styling Standards

# TailwindCSS Rules

Prefer:

- reusable utility patterns
- component consistency

Avoid:

- random spacing systems
- inconsistent typography

---

# Design Consistency

Use consistent:

- spacing
- radius
- typography
- shadows
- colors

---

# Loading & Error States

# Mandatory Requirement

Every async UI must have:

- loading state
- empty state
- error state

---

# Example

## Required

```txt
Loading...
No Data Found
Something Went Wrong
```

Never leave blank screens.

---

# Error Handling Standards

# Backend Errors

Always:

- sanitize errors
- log internally
- return safe responses

---

# Frontend Errors

Always:

- show user-friendly messages
- avoid silent failures

---

# Logging Standards

# Important Actions Must Log

Examples:

- login attempts
- payments
- complaint updates
- visitor approvals
- permission changes

---

# Security Standards

# Never Trust Client Input

Always validate:

- permissions
- ownership
- payloads

---

# Forbidden Practices

## AI Agents MUST NEVER

### Use `any`

Unless absolutely unavoidable.

---

### Duplicate Logic

Reuse shared utilities/services.

---

### Hardcode Business Values

Avoid:

```ts
if(role === "ADMIN")
```

Prefer centralized constants/enums.

---

### Write Business Logic in UI

UI should remain presentation-focused.

---

### Bypass Validation

Every API requires validation.

---

### Create Giant Components

Split responsibilities.

---

### Add Random Utility Files

Shared utilities must remain organized.

---

### Mix Mock & Production Logic

Demo logic should be progressively removed.

---

# Testing Standards

# Required Testing Areas

Critical systems:

- auth
- permissions
- billing
- visitor approvals
- complaint workflows

---

# Required Test Types

- integration tests
- API tests
- permission tests
- regression tests

---

# AI-Agent Collaboration Standards

# Before Editing Any Module

Agents must:

1. understand ownership boundaries
2. read related docs
3. follow existing contracts

---

# Frontend & Backend Communication

Must use:

```txt
API_CONTRACTS.md
```

---

# Database Changes

ONLY database agent may:

- modify schema
- generate migrations

---

# Code Review Standards

Every PR should check:

- type safety
- validation
- permissions
- consistency
- duplication
- architecture alignment

---

# Refactoring Standards

Refactor ONLY when:

- reducing complexity
- improving maintainability
- improving consistency

Avoid:

- unnecessary rewrites

---

# Performance Standards

# Avoid

- overfetching
- giant queries
- deep nested Prisma includes
- unnecessary rerenders

---

# Prefer

- pagination
- selective queries
- memoization when necessary
- optimized API responses

---

# Accessibility Standards

UI should support:

- keyboard navigation
- readable contrast
- accessible forms
- semantic HTML

---

# Final Development Philosophy

The SmartSocietyHub project should evolve into:

```txt
Stable
Predictable
Secure
Scalable
AI-Agent Maintainable
```

The most important priority is NOT speed.

The most important priority is:

```txt
Long-Term Architectural Stability
```
