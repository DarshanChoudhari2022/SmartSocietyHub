# State Management Architecture

## Purpose

This document defines the state management strategy for SmartSocietyHub.

It standardizes:

- local state usage
- server state handling
- global state rules
- caching strategy
- data synchronization patterns

This file acts as the state architecture source of truth for all frontend AI agents.

---

# Core Philosophy

The application should avoid:

```txt
Uncontrolled Global State
```

The preferred architecture is:

```txt
Minimal Global State
+
Centralized Server State
+
Localized UI State
```

---

# State Categories

The application state is divided into:

| State Type | Purpose |
|---|---|
| Local UI State | Temporary component state |
| Server State | API data |
| Global App State | Shared app-wide state |
| Persistent State | Saved client state |

---

# Recommended Libraries

| Purpose | Recommended Tool |
|---|---|
| Server State | TanStack Query |
| Global State | Zustand |
| Forms | React Hook Form |
| Validation | zod |

---

# Local UI State

# Use Cases

Local UI state should handle:

- modal visibility
- dropdown state
- toggles
- temporary filters
- form UI interactions

---

# Recommended Tools

Use:

```ts
useState
useReducer
```

---

# Examples

## Good Local State Usage

```ts
const [isOpen, setIsOpen] = useState(false);
```

---

## Bad Local State Usage

Avoid storing:

- global auth state
- large API datasets
- shared business data

inside component state.

---

# Server State

# Definition

Server state is:

```txt
data coming from APIs
```

Examples:

- complaints
- residents
- visitors
- bills
- notices

---

# Recommended Tool

Use:

```txt
TanStack Query
```

---

# Why TanStack Query

Benefits:

- caching
- background refetching
- deduplication
- loading states
- mutation support
- retry handling

---

# Query Standards

# Query Keys

Use predictable query keys.

Example:

```ts
["complaints"]
["complaints", complaintId]
["visitors", filters]
```

Avoid:

```ts
["data"]
```

---

# Query Organization

Recommended structure:

```txt
/modules/<feature>/queries/
```

---

# Mutation Standards

Mutations should:

- invalidate relevant queries
- show success/error feedback
- support optimistic updates when safe

---

# Example Mutation Flow

```txt
Create Complaint
 ↓
API Call
 ↓
Invalidate Complaint Queries
 ↓
Refetch Updated Data
```

---

# Global State

# Purpose

Global state should remain SMALL.

Only store:

- auth session
- theme
- lightweight shared state

---

# Recommended Tool

Use:

```txt
Zustand
```

Avoid:

```txt
large Redux-style architecture
```

unless absolutely necessary.

---

# Recommended Global State Structure

Example:

```ts
{
  user,
  theme,
  sidebarOpen
}
```

Avoid:

- storing entire datasets globally
- syncing server data manually

---

# Forbidden Global State Usage

Do NOT store:

- complaints list
- visitor tables
- resident datasets
- financial reports

inside global state.

These belong in:

```txt
server state
```

---

# Form State Management

# Recommended Stack

Use:

```txt
React Hook Form + zod
```

---

# Form Standards

Every form should support:

- validation
- loading state
- submission state
- reset handling
- error feedback

---

# Validation Flow

```txt
User Input
 ↓
Frontend Validation
 ↓
API Validation
 ↓
Backend Validation
```

Backend validation is ALWAYS required.

---

# Caching Strategy

# Query Caching Rules

Cache:

- frequently accessed data
- dashboard summaries
- notices
- residents

---

# Avoid Over-Caching

Do NOT aggressively cache:

- sensitive financial operations
- permissions
- rapidly changing approval flows

---

# Refetching Strategy

# Recommended Refetch Rules

Refetch:

- after mutations
- after approvals
- after critical actions

Avoid:

- unnecessary constant polling

---

# Realtime Strategy (Future)

Potential future support:

- websocket updates
- realtime notifications
- live visitor approvals

---

# Offline Support (Future)

Potential future support:

- cached notices
- offline-friendly mobile flows

---

# Derived State Rules

Avoid:

```txt
duplicating derived values in state
```

Prefer:

```txt
compute derived values
```

---

# Example

## Bad

```ts
const [completedCount, setCompletedCount]
```

---

## Better

```ts
const completedCount = tasks.filter(...)
```

---

# Component State Rules

# Keep State Close to Usage

State should live:

```txt
as low as possible
```

Avoid:

- unnecessary lifting
- giant parent state containers

---

# Shared State Rules

If multiple unrelated components require state:

- evaluate context
- evaluate Zustand
- avoid prop drilling

---

# Context Usage Guidelines

Use React Context ONLY for:

- auth
- theme
- lightweight shared app concerns

Avoid:

- massive feature state inside context

---

# Pagination State

Pagination should remain:

- URL-driven when possible

Example:

```txt
?page=2
&status=pending
```

Benefits:

- shareable URLs
- browser navigation support
- predictable state

---

# Filter State

Filters should support:

- URL synchronization
- persistence where useful

---

# Persistent Client State

# Allowed Persistence

Safe persistence examples:

- theme
- sidebar preference
- non-sensitive filters

---

# Forbidden Persistence

Never persist:

- tokens
- sensitive permissions
- financial data

inside insecure storage.

---

# Authentication State

# Important Rule

Auth state should NEVER rely ONLY on frontend memory.

Always validate session server-side.

---

# Recommended Auth Flow

```txt
Frontend Session State
 +
Server Validation
```

---

# Error State Handling

Every async flow must support:

- loading
- error
- retry

---

# Recommended Error UX

Example:

```txt
Failed to load complaints.
Retry
```

Avoid:

```txt
silent failures
```

---

# Optimistic Updates

Allowed ONLY when:

- rollback is safe
- UX benefits significantly

Examples:

- liking posts
- lightweight updates

Avoid optimistic updates for:

- payments
- billing
- critical approvals

---

# Performance Considerations

# Avoid

- unnecessary rerenders
- giant contexts
- duplicated state
- manual sync complexity

---

# Prefer

- memoization where necessary
- query caching
- isolated state ownership

---

# Module State Isolation

Each feature module should manage its own:

- queries
- mutations
- local state
- forms

Avoid:

```txt
cross-module hidden dependencies
```

---

# AI-Agent State Rules

## Frontend Agents MUST NEVER

### Store Server Data Globally

Use TanStack Query.

---

### Duplicate State Everywhere

Maintain single sources of truth.

---

### Bypass Query Invalidation

Keep data synchronized.

---

### Use Massive Context Providers

Avoid performance issues.

---

# Testing Requirements

State-related testing should validate:

- cache invalidation
- mutation updates
- loading states
- error recovery
- pagination behavior

---

# Recommended Future Enhancements

## Realtime Data Layer

Potential future:

- websocket synchronization
- live dashboards
- live visitor updates

---

## Background Sync

Potential future:

- silent refresh
- background data updates

---

## Advanced Offline Support

Potential future:

- mobile offline caching
- retry queues

---

# Final State Management Philosophy

The SmartSocietyHub state architecture should become:

```txt
Predictable
Minimal
Performant
Scalable
Maintainable
```

The most important principle is:

```txt
Server Data Belongs To Server State
```

NOT:

```txt
global frontend stores
```
