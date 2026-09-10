# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Pre-Phase 0. Planning complete, context system scaffolded, build not started.

## Current Goal

- Scaffold `mobile-app/` (React Native/Expo, TypeScript) and `server/` (Go, Gin) boilerplate,
  then begin real Phase 0 feature work: auth/user models for both roles, onboarding role
  picker, and basic profile setup (see `project-overview.md`).

## Completed

- Product concept defined: a platform giving African university final-year capstone
  projects visibility beyond the grading panel, connecting students to industry
  professionals/institutions (see `project-overview.md`).
- UI designed by the user in FlutterFlow Designer and reviewed via browser screenshots
  (2026-09-10): 10 frames covering Splash, Onboarding (role picker), Auth, Student Home,
  Professional Discovery, Project Feed, Project Details, Project Upload Flow, Student
  Profile, Professional Profile; full inventory in `ui-context.md`.
- Stack decided: React Native (Expo) for the single mobile app, Go + Gin for the backend,
  PostgreSQL, S3-compatible object storage for media/documents. See `architecture.md`.
- Repo scaffolded from the six-file context methodology (mirroring the sibling `laundria`
  project's setup, per explicit user request): `context/` (this file plus
  `project-overview.md`, `architecture.md`, `code-standards.md`, `ai-workflow-rules.md`,
  `ui-context.md`).
- Repo published to GitHub as a public repo at `github.com/Afari-Richmond/provah`, with a
  description and the landing page URL (`https://provah.richmondafari.me`) set.

## In Progress

- None yet.

## Next Up

- Scaffold `mobile-app/` (Expo, TypeScript, React Navigation); not yet created.
- Scaffold `server/` (Go module, Gin); not yet created.
- Pull exact color/type/spacing tokens from the FlutterFlow project into
  `mobile-app/src/theme/` (see `ui-context.md` What needs to be decided).
- Decompose Phase 0 into buildable units and save the result as
  `context/specs/00-build-plan.md`.

## Open Questions

- What "Express Interest" actually does on the Project Details screen (opens a chat
  thread? sends a notification-only signal? triggers an email?): the single most
  important interaction in the app and currently undefined. Do not build it without
  resolving this.
- Student email verification mechanism: the Auth screen implies a university email
  (`name@university.edu`) but the actual verification logic (domain allowlist? OTP only?
  manual review?) isn't decided.
- Professional verification/trust signal: students get a "Verified Student" badge;
  professionals have no equivalent in the current mockups. Flagged as a product gap.
- Whether/when a WebSocket layer is needed for messaging, or whether simple
  store-and-poll/push-notification messaging is sufficient for v1. See `architecture.md`.
- Monetization model: not discussed at all yet; Payments is explicitly Out of Scope in
  `project-overview.md` until a model is chosen.
- Whether an institution/department-level bulk-upload account type gets built, and if so,
  when: currently just a flagged idea, not scoped (see `project-overview.md`).
- Exact FlutterFlow visual tokens (colors, type, spacing): need to be pulled from the
  FlutterFlow project directly rather than estimated from screenshots (see `ui-context.md`).
- Whether light/dark mode are both required for v1: not yet discussed with the user.

## Architecture Decisions

- One React Native app with role-based branching (Student vs Industry Professional) at
  onboarding, not two separate apps. See `architecture.md` Roles and App Branching.
- Single shared Go + Gin backend, single PostgreSQL database, single `users` table with a
  `role` enum rather than two separate identity systems.
- No event bus / WebSocket hub introduced speculatively. Provah's v1 workflows don't yet
  have Laundria's stateful order-pipeline complexity that justified one there.

## Session Notes

- This project's context system was bootstrapped by copying the *structure* (not the
  content) of `~/laundria`'s six-file context setup, per explicit user request ("go into
  the project, it has a context folder containing important files, replicate the same
  thing for this app"). Content throughout was written fresh for Provah based on this
  project's own conversation history and the actual FlutterFlow mockups; nothing was
  copied verbatim from Laundria's product/business specifics.
- Unlike Laundria (two client surfaces: customer app + operator web dashboard), Provah is
  a single mobile app with two roles branching from one onboarding screen: a simpler
  system boundary, reflected throughout `architecture.md`.
- `ui-context.md`'s screen inventory comes from a live review of the user's actual
  FlutterFlow project (via browser automation screenshots), not from Pinterest references
  like Laundria's early UI passes; the FlutterFlow project itself is the source of truth
  going forward, not these notes.
