# API Contracts

## Purpose

This document defines standardized API structures for:

- frontend agents
- backend agents
- testing agents
- reviewer agents

This file acts as the communication layer between frontend and backend development.

---

# Core API Principles

## Standardized Responses

Every API must follow a consistent response format.

---

# Success Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

---

# Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body"
  }
}
```

---

# Validation Rules

Every API must validate:

- request body
- params
- query values
- permissions
- ownership access

Validation library:

```txt
zod
```

---

# Authentication Rules

Protected APIs require:

- authenticated session
- role validation
- permission checks

Never trust frontend authorization.

---

# Common Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 500 | Internal server error |

---

# Authentication APIs

# POST /api/auth/login

## Purpose

Authenticate user.

---

## Request

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

---

## Success Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "role": "ADMIN"
    },
    "token": "jwt_or_session"
  },
  "message": "Login successful"
}
```

---

# GET /api/auth/session

## Purpose

Return authenticated user session.

---

## Success Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "role": "ADMIN"
    }
  }
}
```

---

# Resident Management APIs

# GET /api/residents

## Purpose

Fetch residents list.

---

## Query Parameters

```txt
?page=1
&limit=10
&search=
```

---

## Success Response

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  }
}
```

---

# POST /api/residents

## Purpose

Create resident.

---

## Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9999999999",
  "flatId": "flat_id"
}
```

---

## Validation Rules

- email must be unique
- flat must exist
- phone required

---

# Complaint APIs

# GET /api/complaints

## Purpose

Fetch complaints list.

---

## Query Parameters

```txt
?page
&limit
&status
&priority
&search
```

---

## Success Response

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {}
  }
}
```

---

# POST /api/complaints

## Purpose

Create complaint.

---

## Request

```json
{
  "title": "Water leakage",
  "description": "Leakage in bathroom",
  "category": "PLUMBING",
  "priority": "HIGH"
}
```

---

## Validation Rules

- title required
- description required
- category required
- authenticated resident only

---

# PATCH /api/complaints/:id

## Purpose

Update complaint status.

---

## Request

```json
{
  "status": "IN_PROGRESS"
}
```

---

## Permission Rules

Allowed roles:

- ADMIN
- SECRETARY
- ASSIGNED_STAFF

---

# Visitor Management APIs

# POST /api/visitors

## Purpose

Create visitor request.

---

## Request

```json
{
  "visitorName": "Rahul Sharma",
  "phone": "9999999999",
  "purpose": "Delivery",
  "visitDate": "2026-05-10"
}
```

---

# PATCH /api/visitors/:id/approve

## Purpose

Approve visitor entry.

---

## Permission Rules

Allowed roles:

- RESIDENT
- OWNER
- ADMIN

---

## Success Response

```json
{
  "success": true,
  "message": "Visitor approved"
}
```

---

# Maintenance APIs

# GET /api/maintenance/bills

## Purpose

Fetch maintenance bills.

---

# POST /api/maintenance/bills

## Purpose

Generate maintenance bill.

---

## Request

```json
{
  "flatId": "flat_id",
  "amount": 5000,
  "dueDate": "2026-06-01"
}
```

---

# POST /api/maintenance/payments

## Purpose

Record payment.

---

## Important Rule

Payments must be:

- transactional
- auditable
- immutable

---

# Notice APIs

# GET /api/notices

## Purpose

Fetch notices.

---

# POST /api/notices

## Purpose

Create notice.

---

## Request

```json
{
  "title": "Water Shutdown",
  "content": "Water supply will be unavailable tomorrow.",
  "targetAudience": "ALL"
}
```

---

# Event APIs

# GET /api/events

## Purpose

Fetch society events.

---

# POST /api/events

## Purpose

Create event.

---

# Poll APIs

# POST /api/polls/:id/vote

## Purpose

Submit poll vote.

---

## Important Rule

Users must NOT:

- vote multiple times
- manipulate results

---

# Marketplace APIs

# POST /api/marketplace

## Purpose

Create marketplace listing.

---

## Validation Rules

- title required
- price required
- seller identity required

---

# Standard Pagination Format

## Response Structure

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

# Standard Error Codes

| Error Code | Meaning |
|---|---|
| VALIDATION_ERROR | Invalid request |
| UNAUTHORIZED | Login required |
| FORBIDDEN | Permission denied |
| RESOURCE_NOT_FOUND | Entity missing |
| DUPLICATE_ENTRY | Conflict |
| INTERNAL_ERROR | Server failure |

---

# Validation Standards

## Required Validation Library

```txt
zod
```

---

# Required Validation Areas

Every API must validate:

- body
- params
- query
- auth session
- permissions

---

# API Security Rules

## Mandatory Security Checks

### Authentication

Verify session.

---

### Authorization

Verify permissions.

---

### Ownership Validation

Ensure user owns or can access resource.

---

### Input Sanitization

Prevent:

- malformed data
- injection attacks

---

# Forbidden Backend Practices

## Backend Agents MUST NEVER

### Return Raw Prisma Errors

Always sanitize errors.

---

### Expose Internal Fields

Never expose:

- internal IDs unnecessarily
- hidden financial fields
- private metadata

---

### Skip Validation

Every API requires validation.

---

### Trust Frontend Roles

Permissions must be enforced server-side.

---

# API Versioning Strategy

Future recommendation:

```txt
/api/v1/
/api/v2/
```

Useful for:

- mobile compatibility
- gradual upgrades
- backward compatibility

---

# Realtime Event Considerations

Future architecture may include:

- websocket events
- realtime visitor approvals
- live notifications
- live dashboard updates

---

# Logging Requirements

Every important API action should log:

- user
- action
- entity
- timestamp

Examples:

- complaint updates
- payment processing
- visitor approvals
- permission changes

---

# Testing Requirements

All critical APIs require:

- validation tests
- auth tests
- permission tests
- edge-case tests

---

# AI-Agent Communication Rule

Frontend agents MUST rely on:

```txt
API_CONTRACTS.md
```

Backend agents MUST maintain:

```txt
contract consistency
```

This prevents:

- API mismatch
- frontend breakage
- inconsistent responses

---

# Final API Philosophy

The API layer should become:

```txt
Predictable
Secure
Validated
Versionable
Scalable
```

Every API should behave consistently regardless of feature domain.
