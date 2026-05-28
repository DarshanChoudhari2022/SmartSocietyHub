# Authentication Flow

## Purpose

This document defines the authentication architecture and user session flow for SmartSocietyHub.

It standardizes:

- login flow
- session handling
- protected routes
- authentication lifecycle
- security expectations

This file acts as the authentication source of truth for all AI agents.

---

# Authentication Goals

The authentication system must be:

```txt
Secure
Predictable
Scalable
Mobile-Friendly
Production Ready
```

---

# Current Stack

## Authentication Provider

Current implementation uses:

```txt
NextAuth
```

---

# Authentication Responsibilities

Authentication handles:

- identity verification
- session creation
- login state
- protected access

Authorization handles:

- permissions
- role access
- ownership validation

These are separate systems.

---

# Core Authentication Flow

# Recommended Login Lifecycle

```txt
User Login
 ↓
Credential Validation
 ↓
User Lookup
 ↓
Password Verification
 ↓
Session Creation
 ↓
Role/Permission Injection
 ↓
Protected Dashboard Access
```

---

# Supported Authentication Methods

## Current

Likely current support:

- email/password

---

# Future Support (Optional)

Potential future additions:

- OTP login
- phone authentication
- social login
- society invite links

---

# Login Flow

# Step 1 — User Submits Credentials

Example:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

---

# Step 2 — Validate Input

Required validation:

- email format
- password presence
- payload sanitization

Use:

```txt
zod
```

---

# Step 3 — User Lookup

Check:

- user exists
- user is active
- account not suspended

---

# Step 4 — Password Verification

Requirements:

- hashed password comparison
- secure verification

Never:

- store plain passwords
- log passwords

---

# Step 5 — Session Creation

After successful login:

- create session
- attach user identity
- attach role
- attach permissions

---

# Step 6 — Redirect to Dashboard

Redirect based on:

- role
- onboarding status
- access level

---

# Session Architecture

# Session Requirements

Sessions must include:

```ts
{
  user: {
    id: string;
    role: string;
    permissions: string[];
    societyId?: string;
  }
}
```

---

# Important Rule

Never fetch permissions ONLY from frontend state.

Server-side validation is mandatory.

---

# Protected Route Flow

# Dashboard Protection

Protected routes require:

```txt
Authenticated Session
```

---

# Recommended Route Protection Flow

```txt
User Requests Route
 ↓
Middleware Checks Session
 ↓
Permission Validation
 ↓
Access Granted or Denied
```

---

# Protected Areas

Examples:

- dashboard
- billing
- complaints
- visitor approvals
- admin pages

---

# Middleware Strategy

# Required Middleware

## Authentication Middleware

Responsibilities:

- verify session
- redirect unauthenticated users

---

## Authorization Middleware

Responsibilities:

- validate permissions
- validate roles
- validate access scope

---

# Example Middleware Flow

```txt
Request
 ↓
Auth Middleware
 ↓
Permission Middleware
 ↓
Route Access
```

---

# Session Expiration Strategy

# Recommended Rules

Sessions should:

- expire automatically
- refresh securely
- invalidate on logout

---

# Security Requirements

## Invalidate Session On

- logout
- password change
- account suspension
- permission revocation

---

# Role Injection Strategy

# Recommended Session Data

Inject:

- role
- permissions
- societyId
- ownership context

Avoid:

- sensitive financial data
- large payloads

---

# Permission Validation Flow

# Critical Rule

Authentication DOES NOT equal authorization.

Even authenticated users must validate:

- permissions
- ownership
- access scope

---

# Example

A resident can:

```txt
view own bills
```

A resident cannot:

```txt
view all society bills
```

---

# Forgot Password Flow

# Recommended Lifecycle

```txt
Request Reset
 ↓
Generate Secure Token
 ↓
Email/SMS Verification
 ↓
Password Reset
 ↓
Invalidate Old Sessions
```

---

# Security Requirements

Reset tokens must:

- expire quickly
- be one-time use
- be securely stored

---

# Registration Flow

# Recommended Registration Lifecycle

```txt
User Registration
 ↓
Validation
 ↓
Role Assignment
 ↓
Flat Mapping
 ↓
Verification
 ↓
Account Activation
```

---

# Important Validation Rules

Validate:

- duplicate email
- flat existence
- society association

---

# Invitation-Based Registration (Recommended)

For better control:

```txt
Admin Creates Invite
 ↓
Resident Receives Invite
 ↓
Resident Completes Registration
```

Benefits:

- prevents unauthorized signups
- improves society integrity

---

# Logout Flow

# Required Behavior

Logout must:

- invalidate session
- clear cookies/tokens
- remove cached auth state

---

# Mobile Authentication Considerations

Since Capacitor/mobile support exists:

Authentication must support:

- mobile sessions
- persistent login
- secure token handling

Avoid:

- browser-only assumptions

---

# Session Security Rules

# Mandatory Security Practices

## Use Secure Cookies

Production requirements:

- httpOnly
- secure
- sameSite protection

---

## Avoid Storing Sensitive Data in Client

Never expose:

- internal permissions
- sensitive admin metadata
- raw auth tokens

---

# Brute Force Protection

Recommended:

- login rate limiting
- temporary lockouts
- suspicious activity detection

---

# Multi-Session Considerations

Future support:

- device management
- active session tracking
- remote logout

---

# Audit Logging Requirements

Authentication-sensitive actions must log:

- login attempts
- failed logins
- password resets
- permission changes
- session revocations

---

# High-Risk Security Areas

## Critical Risks

| Area | Risk |
|---|---|
| Session Hijacking | CRITICAL |
| Permission Bypass | CRITICAL |
| Insecure Reset Flow | HIGH |
| Weak Password Policy | HIGH |

---

# Recommended Password Policy

Minimum requirements:

- strong password length
- mixed characters
- secure hashing

Never:

- store plain passwords
- expose password fields

---

# API Authentication Rules

Every protected API must validate:

- session
- permissions
- ownership

Never trust:

```txt
frontend auth state
```

---

# Recommended Auth Utilities

# Example Helpers

```ts
requireAuth()
requireRole()
requirePermission()
```

Centralize auth utilities.

Avoid:

- repeating auth logic everywhere

---

# Forbidden Authentication Practices

## AI Agents MUST NEVER

### Trust Client Roles

Always validate server-side.

---

### Store Plain Passwords

Never.

---

### Bypass Middleware

All protected routes require middleware.

---

### Hardcode Permission Logic

Centralize permissions.

---

### Return Sensitive Session Data

Keep sessions minimal and secure.

---

# Testing Requirements

Authentication testing is REQUIRED for:

- login flow
- logout flow
- session expiration
- protected routes
- permission enforcement
- password reset flow

---

# Recommended Future Enhancements

## MFA / Two-Factor Authentication

Potential future support:

- OTP verification
- authenticator apps

---

## Device Tracking

Future support:

- session devices
- login history
- suspicious activity detection

---

## SSO Support

Potential enterprise support:

- Google
- Microsoft
- Society SSO

---

# Final Authentication Philosophy

The authentication system must become:

```txt
Secure
Centralized
Auditable
Permission-Aware
Production Hardened
```

The security of the entire platform depends on:

- strong session handling
- strict authorization
- predictable middleware behavior
- centralized permission enforcement
