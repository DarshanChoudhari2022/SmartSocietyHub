# Vercel Production Environment

These variables are required for production login and database access.

## Required

`DATABASE_URL`

Use the Neon pooled connection string:

```text
postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require
```

`DIRECT_URL`

Use the Neon direct connection string:

```text
postgresql://USER:PASSWORD@HOST.REGION.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require
```

`SESSION_SECRET`

Used to sign the app session cookie. Must be at least 32 characters.

Generate one locally:

```bash
openssl rand -base64 32
```

The app also accepts `AUTH_SECRET` or `NEXTAUTH_SECRET`, but `SESSION_SECRET` is preferred for this custom auth system.

## Optional

`NEXT_PUBLIC_VAPID_PUBLIC_KEY`

Required only for web push notifications.

`VAPID_PRIVATE_KEY`

Required only for sending web push notifications.

`VAPID_SUBJECT`

Example:

```text
mailto:admin@example.com
```

## Vercel Steps

1. Open Vercel Project Settings.
2. Go to Environment Variables.
3. Add the variables above for Production, Preview, and Development as needed.
4. Redeploy the project after saving.

## Common Production Errors

`CRITICAL: SESSION_SECRET or AUTH_SECRET or NEXTAUTH_SECRET must be set in production!`

Fix: add `SESSION_SECRET` in Vercel and redeploy.

`Can't reach database server at base`

Fix: your `DATABASE_URL` is wrong or incomplete in Vercel. Paste the full Neon PostgreSQL URL, not a variable name or partial host.

SSL warning from `pg`

Fix: use `sslmode=verify-full` in Neon URLs.
