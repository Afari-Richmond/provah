# Architecture Context

**Status: pre-build.** Everything below is the planned architecture, not yet implemented; no application code has been written against it yet (only initial scaffolding). Treat this file as the spec to build toward, and update it the moment implementation reveals it wrong (see `ai-workflow-rules.md`).

## Stack

| Layer | Technology | Role |
|---|---|---|
| Mobile app | React Native (Expo) | Single app, both roles (Student, Industry Professional) branch from the same codebase post-onboarding; iOS + Android from one codebase |
| Backend | Go + Gin | HTTP API, business logic, all domain code, shared by both roles |
| Database | PostgreSQL | Single source of truth: users (students/professionals), projects, team members, documents/links, connections/messages |
| File/object storage | S3-compatible (e.g. Cloudflare R2 or AWS S3) | Project media (images/video), documentation (PDFs); uploaded directly from the client via presigned URLs issued by the Go API, never proxied through the API |
| Auth | JWT (access + refresh), issued by the Go backend | Two roles (`student`, `professional`) on one identity system; see Auth and Access Model below |
| Real-time / messaging | Undecided; start with simple request/response (send message, stored in Postgres, recipient polls or receives a push notification), upgrade to WebSocket only if usage shows it's needed | See Open Questions in `progress-tracker.md`; do not build a WebSocket hub speculatively |
| Search | PostgreSQL full-text search (keyword/field/university on Discovery and Feed) | Sufficient at expected scale; do not reach for Elasticsearch/Algolia until proven necessary |
| Hosting (MVP) | Render/Fly.io (backend) + a managed Postgres (Neon/Supabase) + Expo (mobile build/deploy) | Low/no-cost to start |

## System Boundaries

- `/server`: the Go backend module (own `go.mod`), containing everything below.
- `/server/cmd/api`: main entrypoint; routing, middleware, startup/bootstrapping only.
- `/server/internal/platform`: shared infrastructure: DB connection/pooling, auth (JWT), file-upload/presigned-URL issuance, config loading, structured logging. No business logic lives here.
- `/server/internal/modules/{auth,students,professionals,projects,discovery,connections,notifications}`: one folder per domain area. Each module owns its own DB tables (via migrations), HTTP handlers, service/business logic. Modules do not import each other's internal packages directly; cross-module interaction happens only through clearly exported interfaces (no event bus yet, since Provah's v1 workflows are simpler than a stateful order pipeline; introduce one only if a real cross-module async need appears).
- `/server/migrations`: versioned SQL migrations (golang-migrate). No hand-edited schema changes.
- `/mobile-app` (React Native / Expo): owns all UI, navigation, and calls to the Go API for both roles. Never talks to Postgres directly.

## Storage Model

- **PostgreSQL (primary database)**: all structured data, including `users` (shared identity, `role` = student|professional), `student_profiles`, `professional_profiles`, `projects`, `project_team_members`, `project_documents`, `project_links`, `connections`/`messages`, `bookmarks`.
- **Object/file storage**: project images/video, uploaded documentation (PDFs). Referenced from Postgres by URL/key, never stored as blobs in the DB.

## Roles and App Branching

Provah is **one mobile app**, not two. A user picks a role (Student or Industry Professional) during onboarding (matches the FlutterFlow "I am a..." screen), and the app's navigation/home surface branches from there:

- Student → Student Home (own stats, explore projects, active professionals).
- Professional → Professional Discovery (search/browse, featured project, recent submissions).

Both roles share the Project Detail screen, Project Feed, and the Auth/Onboarding flow. Only Students see the Project Upload Flow. Both roles have a Profile screen, with different content (Student: my projects, achievements; Professional: saved projects, areas of interest).

## Auth and Access Model

- Single `users` table with a `role` enum (`student`, `professional`), each with a role-specific profile table (`student_profiles`, `professional_profiles`), not two separate identity systems, since both roles share one auth/session flow and can both message/browse.
- **Student signup**: self-serve, with a university-affiliated email field shown in the FlutterFlow Auth screen (`name@university.edu`). The exact verification mechanism (domain allowlist? email OTP only? manual review?) is **undecided**; see Open Questions in `progress-tracker.md`. Do not build a verification mechanism without resolving this first.
- **Professional signup**: self-serve today in the FlutterFlow mockups, with no defined verification/trust signal; flagged as a product gap in `project-overview.md`. Do not invent a verification flow (company domain checks, LinkedIn, manual review) without a decision; see Open Questions.
- **Access control enforcement**: always server-side. Client-side hiding of actions (e.g. only Students seeing the Upload flow) is a UX convenience only, never the actual security boundary. A user's session can only ever modify their own resources (their own project, their own profile).

## Invariants

1. Neither client surface talks to Postgres directly or bypasses the Go API for any data access.
2. Access control is enforced server-side on every request, never inferred from what the client UI shows/hides.
3. A project's ownership (which student/team it belongs to) is immutable by any user other than its owner(s); only the owning student can edit or delete their project.
4. File uploads (media, documents) go directly from client to object storage via a presigned URL; request handlers never proxy large file bytes through the API process.
5. Request handlers never perform long-running work synchronously; anything slow (e.g. sending a notification) is deferred, not inlined into the request path.
6. No payment or money-related field/logic is introduced anywhere in the codebase while Payments remain Out of Scope in `project-overview.md`.

## Open Architecture Questions

Carried in detail in `progress-tracker.md` Open Questions; do not resolve these by guessing in code:

- What "Express Interest" actually does (notification? opens a chat thread? sends an email?).
- Student email verification mechanism.
- Professional verification/trust mechanism.
- Whether/when a WebSocket layer is actually needed for messaging.
