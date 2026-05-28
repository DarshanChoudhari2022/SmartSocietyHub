# UI System & Design Standards

## Purpose

This document defines the UI architecture and design consistency rules for SmartSocietyHub.

It standardizes:

- layouts
- components
- spacing
- typography
- responsiveness
- UX behavior
- visual consistency

This file acts as the design system source of truth for all frontend/UI AI agents.

---

# Design Philosophy

The SmartSocietyHub UI should feel:

```txt
Modern
Clean
Operational
Fast
Professional
Readable
```

This is NOT:

```txt
a flashy startup landing page
```

This IS:

```txt
a productivity-focused operational dashboard system
```

---

# Core UI Goals

The UI should prioritize:

- clarity
- usability
- speed
- operational efficiency
- accessibility
- mobile compatibility

---

# Dashboard Design Direction

## Primary Application Style

The platform is primarily:

```txt
Dashboard-Centric
```

Meaning:

- data visibility is critical
- workflows must be fast
- actions must be obvious
- navigation must be predictable

---

# Recommended Design Style

## Preferred Characteristics

- soft modern UI
- moderate border radius
- clean spacing
- subtle shadows
- strong hierarchy
- minimal clutter

Avoid:

- excessive gradients
- visual overload
- animation-heavy interfaces

---

# Layout Architecture

# Main Layout Structure

```txt
Sidebar
 ↓
Topbar
 ↓
Content Area
```

---

# Desktop Layout

## Recommended Width Strategy

Use:

```txt
max-width containers where needed
```

Avoid:

```txt
ultra-stretched layouts
```

---

# Mobile Layout

Mobile should support:

- collapsible sidebar
- stacked layouts
- touch-friendly actions

---

# Responsive Breakpoints

## Recommended Breakpoints

| Device | Width |
|---|---|
| Mobile | < 768px |
| Tablet | 768px - 1024px |
| Desktop | > 1024px |

---

# Component Architecture

# Component Categories

## Shared Components

Location:

```txt
/shared/ui/
```

Examples:

- Button
- Modal
- Card
- Input
- Table
- Badge

---

## Feature Components

Location:

```txt
/modules/<feature>/components/
```

Examples:

- ComplaintCard
- VisitorApprovalPanel
- BillSummaryTable

---

# UI Consistency Rules

## Reuse Components

Avoid:

- duplicate buttons
- duplicate modal styles
- duplicate form styles

Always reuse shared components.

---

## Consistent Visual Language

Maintain consistency in:

- colors
- spacing
- typography
- border radius
- icon sizing

---

# Spacing System

# Recommended Spacing Scale

Use consistent spacing:

```txt
2
4
6
8
12
16
20
24
32
```

Avoid:

```txt
random spacing values
```

---

# Typography Standards

# Typography Philosophy

Readable first.

Avoid:

- tiny fonts
- excessive font sizes
- inconsistent hierarchy

---

# Recommended Hierarchy

| Usage | Suggested Size |
|---|---|
| Page Title | text-2xl |
| Section Title | text-xl |
| Card Title | text-lg |
| Body Text | text-sm/base |
| Metadata | text-xs |

---

# Color System

# Recommended Direction

Use:

- calm operational colors
- high readability
- subtle accent usage

---

# Status Colors

## Success

Used for:

- completed payments
- resolved complaints
- approvals

---

## Warning

Used for:

- pending tasks
- due payments
- attention-needed states

---

## Danger

Used for:

- rejected requests
- critical alerts
- failed operations

---

# Dark Mode Support

Recommended:

```txt
YES
```

The dashboard system is suitable for dark mode.

Ensure:

- readable contrast
- consistent surfaces
- accessible colors

---

# Card Design Standards

# Card Philosophy

Cards are primary operational containers.

Every card should:

- feel lightweight
- remain readable
- support quick scanning

---

# Card Content Structure

Recommended:

```txt
Title
Metadata
Primary Content
Actions
```

---

# Table Design Standards

Tables are critical for:

- residents
- complaints
- visitors
- billing

---

# Required Table Features

## Support

- pagination
- search
- filtering
- sorting
- responsive overflow

---

# Avoid

- overcrowded tables
- excessive columns
- unreadable layouts

---

# Form Design Standards

# Form Philosophy

Forms should:

- minimize friction
- guide users clearly
- prevent mistakes

---

# Required Form Features

Every form should support:

- validation messages
- loading state
- disabled submit state
- success feedback
- error feedback

---

# Validation UX

## Good UX

Show:

- inline errors
- clear guidance
- specific messages

Avoid:

```txt
Something went wrong
```

without explanation.

---

# Modal Standards

Use modals ONLY for:

- quick actions
- confirmations
- lightweight workflows

Avoid:

- massive multi-step forms inside modals

---

# Loading State Standards

# Every Async UI Requires

## Loading State

Examples:

- skeleton loaders
- spinner states

---

## Empty State

Examples:

```txt
No complaints found
No visitors today
```

---

## Error State

Examples:

```txt
Failed to load data
Please try again
```

---

# Navigation Standards

# Sidebar Rules

Sidebar should:

- remain predictable
- group modules logically
- avoid clutter

---

# Recommended Navigation Groups

## Operations

- complaints
- visitors
- maintenance

---

## Community

- notices
- events
- polls

---

## Administration

- residents
- staff
- reports
- settings

---

# Search UX

Search should support:

- residents
- flats
- complaints
- visitors
- notices

Global search is recommended long-term.

---

# Notification UX

Notifications should support:

- unread states
- categories
- action links

Avoid:

- noisy spammy behavior

---

# Dashboard Analytics UX

Analytics should prioritize:

- clarity
- operational usefulness
- trend visibility

Avoid:

- decorative meaningless charts

---

# Accessibility Standards

# Mandatory Accessibility Goals

Support:

- keyboard navigation
- semantic HTML
- proper labels
- readable contrast

---

# Important Rule

Accessibility is NOT optional.

---

# Mobile UX Standards

# Mobile Priorities

Most important mobile flows:

- visitor approvals
- complaints
- notices
- payments

These flows must remain:

- fast
- touch-friendly
- simplified

---

# Performance UX Standards

Avoid:

- large rerenders
- layout shifts
- slow dashboards

Prefer:

- lazy loading
- pagination
- optimized tables

---

# Animation Standards

# Animation Philosophy

Subtle only.

Use animations for:

- transitions
- feedback
- loading polish

Avoid:

- distracting motion
- excessive effects

---

# Icon System

Recommended:

```txt
lucide-react
```

Maintain:

- consistent sizing
- consistent stroke width

---

# Empty State UX

Empty states should:

- explain situation
- suggest next action

Example:

```txt
No complaints found.
Create a complaint to get started.
```

---

# Error UX Philosophy

Never:

- expose technical stack traces
- show raw backend errors

Always:

- show actionable feedback

---

# UI Agent Responsibilities

Frontend/UI agents are responsible for:

- consistency
- responsiveness
- accessibility
- reusable UI
- UX polish

---

# Forbidden UI Practices

## AI Agents MUST NEVER

### Create Inconsistent Components

Reuse shared UI system.

---

### Hardcode Styles Everywhere

Centralize reusable patterns.

---

### Ignore Mobile Layouts

All pages must be responsive.

---

### Ignore Loading/Error States

Mandatory for all async flows.

---

### Create Overcomplicated Interfaces

Operational simplicity is critical.

---

# Recommended Future Enhancements

## Realtime Dashboards

Potential future:

- live visitor updates
- realtime alerts
- live complaints

---

## Advanced Analytics

Potential future:

- trends
- financial insights
- operational heatmaps

---

## Personalization

Potential future:

- dashboard customization
- widget-based layouts

---

# Final UI Philosophy

The SmartSocietyHub UI should become:

```txt
Operational
Clean
Consistent
Responsive
Accessible
Professional
```

The interface should help users:

- complete tasks quickly
- understand information instantly
- navigate confidently
- manage society operations efficiently
