# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Pre-Phase 0. Planning complete, context system scaffolded, build not started.

## Current Goal

- Scaffold `server/` (Go, Gin) boilerplate, then begin real Phase 0 feature work: auth/user
  models for both roles, wiring the mobile app's mock-backed `lib/api/` calls to real
  endpoints, and basic profile setup (see `project-overview.md`).

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
- `mobile-app/` scaffolded (2026-09-10): `create-expo-app` (blank-typescript template) +
  React Navigation (native-stack + bottom-tabs) + `@/*` → `src/*` path alias
  (`babel-plugin-module-resolver`, installed as a top-level devDependency alongside
  `babel-preset-expo` for the same reason noted in Laundria's own build history: Expo's
  nested copy isn't visible to Node's babel config resolution otherwise). Frontend-first,
  mock-backed, mirroring Laundria's pattern: `src/lib/{types,mocks,api}/` per domain
  (`user`, `project`), `src/lib/api/envelope.ts` mirroring the Go backend's `APIResponse`
  shape from `code-standards.md`. Navigation: root `AppNavigator` (Splash → Onboarding →
  Auth → role branch), `StudentTabNavigator` (HomeTab nested-stack with Home/ProjectFeed/
  ProjectDetail, UploadTab, ProfileTab) and `ProfessionalTabNavigator` (DiscoveryTab
  nested-stack with Discovery/ProjectDetail, ProfileTab) per `architecture.md` Roles and
  App Branching. `useAuth` context tracks the onboarding-selected role for the session
  only (no real auth yet, matching the Open Architecture Question in `architecture.md`).
  All 10 FlutterFlow screens have a corresponding built screen; `ProjectDetailScreen`'s
  "Message Student" / "Express Interest" buttons are present but intentionally
  non-functional (their behavior is an unresolved Open Question below), same
  chrome-only-until-decided pattern as Laundria's early Account tab. No component library
  or brand color tokens yet (`ui-context.md` still flags these as unpulled from
  FlutterFlow) — plain `StyleSheet` with a neutral placeholder palette only. Verified:
  `tsc --noEmit` clean, `eslint .` clean (`eslint-config-expo`, installed via
  `expo lint`'s first-run setup; note the `expo lint` wrapper itself fails in this
  environment with a "Cannot find module 'eslint'" resolution error even though eslint is
  correctly installed — run `eslint .` directly instead), `expo export --platform ios`
  bundles successfully (995 modules). Visually checked in the iOS Simulator (booted
  `iPhone 17`): a fresh cold launch renders Onboarding correctly (role cards, disabled
  Continue button); the Student tab bar, nested Home stack, and mock-data-backed Project
  Feed were also confirmed rendering correctly. Full continuous tap-through (Onboarding →
  Auth → Home → Feed → Detail) wasn't scripted end-to-end in this session — this
  environment has no Accessibility permission for System Events and no `cliclick`
  installed, so simulator taps can't be automated; the dev server was left running for
  the user to tap through manually if desired.

## In Progress

- None yet.

## Next Up

- Scaffold `server/` (Go module, Gin); not yet created.
- Wire `mobile-app/src/lib/api/*` from mock data to real `fetch` calls once `server/`
  exists.
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
