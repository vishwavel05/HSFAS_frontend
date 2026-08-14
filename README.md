# HSFAS Frontend — HITS Smart Face Attendance System

Production frontend for the HSFAS demo, built against the Django backend
documented in `Backend_final.md`. Next.js 15 (App Router) + TypeScript +
Tailwind CSS + React Query + Axios + Framer Motion.

## Setup

```bash
npm install
cp .env.local.example .env.local
# edit .env.local — set NEXT_PUBLIC_API_BASE_URL to your Django backend
npm run dev
```

Open http://localhost:3000. Production build: `npm run build && npm run start`.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the Django backend, no trailing slash. |
| `NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT` | Login endpoint — see **Known gaps** below. |

## Screen flow

Login → Start Attendance → Image Preview → Processing → Attendance Result & Verification,
matching the PRD exactly. Each screen lives under `src/app/<route>/page.tsx`.

## Architecture notes

- **`AttendanceFlowContext`** (`src/context`) owns picked images, class
  scope, the `POST /api/attendance/` mutation, the review/correction state,
  and the `POST /api/attendance/update/` mutation. It's mounted once in
  the root layout, so it survives client-side navigation between screens —
  this is what the Processing screen relies on to safely wait for a
  response no matter how its own component remounts.
- **`useProcessingAnimation`** (`src/hooks`) drives the fixed 10s-per-stage
  animation from the PRD independently of the network request, using
  `setTimeout` chains with real cleanup (safe under React 18 StrictMode's
  dev-only double-invoke).
- **`apiClient.ts`** is the single Axios instance: it never sets
  `Content-Type` on `FormData` bodies (letting the browser generate the
  multipart boundary) and normalizes every failure into an `ApiError` with
  a real message, so no screen is left with a silent/opaque failure.

## Known gaps versus the provided spec

- **Login endpoint.** `Backend_final.md` documents `/api/enrollments/`,
  `/api/attendance/`, and `/api/attendance/update/` — no auth endpoint.
  The Login screen calls `NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT`
  (`/api/auth/login/` by default) expecting `{ token, user? }` back. Point
  it at your real Django auth view; until then, Sign In will surface
  whatever error that endpoint currently returns rather than faking success.
- **Department / Year / Section fields.** `POST /api/attendance/` requires
  these, but no screen in the PRD or mockup collects them. They're added
  as a compact "Class Details" selector on the Image Preview screen, in
  the blank space the mockup already leaves there — the least invasive
  option that still avoids sending a request the backend will reject.

## Error handling

Every request path (image count, network failure, timeout, invalid
response, save failures) renders a real error state with a retry action —
see `src/components/common/ErrorState.tsx` — nothing fails silently.
