# Role & Permission System

## Purpose

This document defines the authorization architecture for SmartSocietyHub.

It standardizes:

- user roles
- permissions
- access scopes
- protected operations
- module access rules

This system must become the single source of truth for authorization.

---

# Core Security Principle

Authentication answers:

```txt
Who are you?
```

Authorization answers:

```txt
What are you allowed to do?
```

Both are mandatory.

---

# Important Security Rule

Frontend role checks are NOT security.

All permissions must be enforced:

- server-side
- API-side
- middleware-side

Never trust the client.

---

# Authorization Architecture

## Recommended RBAC Structure

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

# Core User Roles

## SUPER_ADMIN

Highest system-level role.

Purpose:

- full system control
- infrastructure access
- emergency overrides

Access:

- everything

Important:

- should be extremely restricted

---

## ADMIN

Society administrator.

Responsibilities:

- manage society
- manage residents
- manage finances
- configure operations
- assign permissions

Access:

- almost all modules

Restrictions:

- cannot bypass infrastructure-level protections

---

## SECRETARY

Operational management role.

Responsibilities:

- notices
- complaints
- resident coordination
- event approvals
- society communication

Restrictions:

- limited financial authority

---

## TREASURER

Financial operations role.

Responsibilities:

- maintenance billing
- expenses
- budgets
- payment tracking

Restrictions:

- cannot manage system security

---

## SECURITY

Gate/security management role.

Responsibilities:

- visitor management
- package handling
- incident logging
- blacklist management

Restrictions:

- no financial access
- no resident management

---

## STAFF

Operational worker role.

Responsibilities:

- assigned maintenance tasks
- complaint handling
- operational duties

Restrictions:

- limited visibility

---

## RESIDENT

Flat owner or official resident.

Responsibilities:

- complaints
- visitor approvals
- maintenance payments
- notices
- bookings

Restrictions:

- only own data access

---

## TENANT

Temporary resident role.

Responsibilities:

- visitor approvals
- notices
- complaints

Restrictions:

- limited compared to owners

---

# Permission Design Philosophy

Avoid:

```txt
role === ADMIN
```

Instead use:

```txt
permissions
```

---

# Recommended Permission Structure

## Example

```ts
CAN_CREATE_NOTICE
CAN_APPROVE_VISITOR
CAN_MANAGE_BILLING
CAN_VIEW_FINANCIAL_REPORTS
```

---

# Permission Categories

# Authentication Permissions

| Permission | Description |
|---|---|
| CAN_LOGIN | Access system |
| CAN_ACCESS_DASHBOARD | Access dashboard |
| CAN_MANAGE_SESSIONS | Session controls |

---

# Resident Management Permissions

| Permission | Description |
|---|---|
| CAN_VIEW_RESIDENTS | View resident list |
| CAN_CREATE_RESIDENT | Add resident |
| CAN_EDIT_RESIDENT | Modify resident |
| CAN_DELETE_RESIDENT | Remove resident |
| CAN_ASSIGN_FLATS | Manage flat assignments |

---

# Complaint Permissions

| Permission | Description |
|---|---|
| CAN_CREATE_COMPLAINT | Raise complaint |
| CAN_VIEW_ALL_COMPLAINTS | View all complaints |
| CAN_ASSIGN_COMPLAINT | Assign complaint |
| CAN_UPDATE_COMPLAINT | Change complaint status |
| CAN_CLOSE_COMPLAINT | Resolve complaint |

---

# Visitor Management Permissions

| Permission | Description |
|---|---|
| CAN_CREATE_VISITOR | Create visitor request |
| CAN_APPROVE_VISITOR | Approve entry |
| CAN_REJECT_VISITOR | Reject visitor |
| CAN_VIEW_VISITOR_LOGS | Access gate logs |
| CAN_MANAGE_BLACKLIST | Manage blocked visitors |

---

# Financial Permissions

| Permission | Description |
|---|---|
| CAN_GENERATE_BILLS | Create maintenance bills |
| CAN_RECORD_PAYMENTS | Record payments |
| CAN_VIEW_FINANCIAL_REPORTS | Access financial analytics |
| CAN_MANAGE_EXPENSES | Manage expenses |
| CAN_MANAGE_BUDGETS | Manage budgets |

---

# Notice & Communication Permissions

| Permission | Description |
|---|---|
| CAN_CREATE_NOTICE | Publish notices |
| CAN_EDIT_NOTICE | Modify notices |
| CAN_DELETE_NOTICE | Remove notices |
| CAN_SEND_EMERGENCY_ALERTS | Send critical alerts |

---

# Staff & Vendor Permissions

| Permission | Description |
|---|---|
| CAN_MANAGE_STAFF | Manage staff |
| CAN_MANAGE_VENDORS | Manage vendors |
| CAN_ASSIGN_TASKS | Assign operational work |

---

# Community Permissions

| Permission | Description |
|---|---|
| CAN_CREATE_EVENT | Create events |
| CAN_MANAGE_POLLS | Manage polls |
| CAN_CREATE_MARKETPLACE_LISTING | Add marketplace items |

---

# Role Permission Mapping

# SUPER_ADMIN

Access:

```txt
ALL PERMISSIONS
```

---

# ADMIN

Typical permissions:

- resident management
- complaints
- visitors
- finances
- notices
- reports

Restrictions:

- infrastructure-level controls

---

# SECRETARY

Typical permissions:

- complaints
- notices
- events
- resident communication

Restrictions:

- major financial operations

---

# TREASURER

Typical permissions:

- billing
- payments
- expenses
- reports

Restrictions:

- operational security modules

---

# SECURITY

Typical permissions:

- visitors
- gate logs
- packages
- blacklist

Restrictions:

- finances
- resident management

---

# STAFF

Typical permissions:

- assigned complaints
- operational tasks

Restrictions:

- admin operations

---

# RESIDENT

Typical permissions:

- own complaints
- own visitors
- own bills
- own bookings

Restrictions:

- society administration

---

# TENANT

Typical permissions:

- limited resident capabilities

Restrictions:

- ownership-level actions

---

# Ownership-Based Authorization

## Critical Rule

Roles alone are NOT enough.

Example:
A resident should only access:

```txt
their own complaints
their own bills
their own visitors
```

---

# Required Ownership Checks

Validate:

- resource ownership
- flat ownership
- assigned permissions
- society isolation

---

# API Authorization Rules

Every protected API must validate:

## 1. Authentication

Example:

```txt
Is user logged in?
```

---

## 2. Role Permission

Example:

```txt
Can this role perform this action?
```

---

## 3. Ownership Access

Example:

```txt
Does this complaint belong to the resident?
```

---

# Middleware Strategy

# Required Middleware

## Auth Middleware

Checks:

- session
- authentication

---

## Permission Middleware

Checks:

- permissions
- role access

---

## Ownership Middleware

Checks:

- entity ownership
- society access scope

---

# Recommended Permission Utilities

# Example

```ts
hasPermission(user, "CAN_CREATE_NOTICE")
```

---

# Avoid

```ts
if (user.role === "ADMIN")
```

throughout the codebase.

Centralize permission checks.

---

# Frontend Permission Strategy

Frontend checks are ONLY for:

- UX visibility
- conditional rendering

Example:

- hide admin buttons

---

# Important Rule

Frontend checks DO NOT replace:

- backend validation
- API authorization

---

# Database-Level Considerations

Sensitive entities:

- payments
- resident data
- security logs
- visitor history

must always validate:

- role
- ownership
- society access

---

# Audit Logging Requirements

Critical permission-sensitive actions must log:

- user
- action
- timestamp
- target entity

Examples:

- bill generation
- visitor approvals
- resident deletion
- complaint closure

---

# Permission Escalation Risks

High-risk operations:

- changing roles
- modifying payments
- deleting residents
- approving blacklisted visitors

Require:

- strict validation
- audit logs

---

# Recommended Future Enhancements

## Granular Permissions

Future support:

```txt
module-level permissions
feature flags
temporary access grants
```

---

## Multi-Society Isolation

Future SaaS support should isolate:

```txt
society-specific permissions
```

---

# Forbidden Authorization Practices

## AI Agents MUST NEVER

### Trust Frontend Permissions

Never.

---

### Hardcode Roles Everywhere

Use centralized permission utilities.

---

### Skip Ownership Validation

Critical security risk.

---

### Expose Sensitive APIs

All sensitive APIs require authorization.

---

# Testing Requirements

Permission testing is REQUIRED for:

- admin routes
- billing operations
- resident ownership access
- visitor approvals
- complaint management

---

# Final Authorization Philosophy

The authorization system must become:

```txt
Centralized
Predictable
Auditable
Secure
Scalable
```

The entire application security depends on:

- permission consistency
- ownership validation
- server-side enforcement
