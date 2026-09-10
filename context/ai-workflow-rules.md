# AI Workflow Rules

## Approach

Build this project incrementally using a spec-driven workflow. Context files (`project-overview.md`, `architecture.md`, `code-standards.md`, `ui-context.md`) define what to build, how to build it, and the rules the codebase must never violate. `progress-tracker.md` defines the current state of the build. Always implement against these specs; do not infer or invent behavior, module boundaries, or business logic from scratch. This platform carries real students' identities, real project documents, and direct messaging between strangers (students and industry professionals); when in doubt, the safe default is to stop and ask rather than guess, especially anywhere auth/verification, access control, or the student-professional connection flow is involved.

## Scoping Rules

- Work on one feature unit at a time, following the build plan in `context/specs/00-build-plan.md` (created once the project moves from planning into build breakdown).
- Prefer small, verifiable increments over large speculative changes. A unit should be demoable end to end before moving on.
- Do not combine unrelated system boundaries in a single implementation step (e.g. do not touch both the mobile app's UI and the Go API's business logic in one unit unless the unit is explicitly about the shared API contract connecting them).
- Never build ahead of the current phase in the roadmap (see `project-overview.md`), e.g. do not start on Connection/messaging (Phase 2) while Discovery (Phase 1) is still incomplete, even if it seems convenient.
- Never introduce a new dependency, library, or infrastructure piece (a WebSocket hub, a new npm/Go package, a new SDK) unless the current unit explicitly requires it. Install just-in-time, not speculatively.

## When to Split Work

Split an implementation step if it combines:

- UI changes and backend/API changes in the same step (build the API route first, then wire the client to it; see `code-standards.md`)
- Changes across more than one module boundary (`/server/internal/modules/{name}`)
- Any behavior not clearly defined in `project-overview.md` or `architecture.md`. If it's not written down, it doesn't get built yet.
- Schema/migration changes bundled with unrelated business logic changes
- Auth/verification logic or access-control logic bundled with anything else. These should always be their own isolated, tested step.

If a change cannot be verified end to end quickly, the scope is too broad; split it.

## Handling Missing Requirements

- Do not invent product behavior, verification rules, or the exact mechanics of "Express Interest" / messaging not defined in the context files.
- If a requirement is ambiguous (e.g. exact validation rules for a field), resolve it by checking `architecture.md` and `project-overview.md` first; if still unclear, make the smallest reasonable assumption, clearly flag it in the response, and log it in `progress-tracker.md` under Open Questions rather than silently deciding.
- If a requirement is genuinely missing (e.g. no spec exists yet for student email verification, or for what "Express Interest" actually triggers), stop and add it as an open question in `progress-tracker.md` before continuing. Do not guess your way through an auth, verification, or cross-user-contact decision.
- Never silently change an established architectural decision (e.g. letting a client talk to Postgres directly, proxying large files through the API, or adding a payment field) to make something "work" faster.

## Protected Files

Do not modify the following unless explicitly instructed:

- `/server/internal/platform/*`, shared infrastructure (auth, config, file-upload issuance). Changes here affect every module; treat as high-risk and requiring explicit sign-off.
- `/server/migrations/*`, never hand-edit an existing migration file once it has been applied; always create a new migration.
- Generated/base UI primitives in the mobile app (per `ui-context.md`).
- Any third-party library internals (`node_modules`, Go module cache); fix problems by changing how the library is used, never by patching it directly.
- `context/*.md` files themselves; these are updated deliberately (see below), not incidentally as a side effect of a code change.

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- **`architecture.md`**: if system boundaries, the storage model, the auth model, an invariant, or a module's responsibilities change or are finalized.
- **`code-standards.md`**: if a new convention is adopted (e.g. a new pattern for handling a specific type of error) that should apply project-wide going forward.
- **`project-overview.md`**: if feature scope changes (something moves in/out of scope, a phase's feature list changes).
- **`progress-tracker.md`**: after every meaningful implementation change, without exception.

If implementation reveals that a context file is wrong or outdated, fix the context file before continuing; do not let the code and the docs drift apart.

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope, and matches its spec file in `context/specs/`.
2. No invariant defined in `architecture.md` was violated (server-side access control, project-ownership immutability, direct-to-storage file uploads, no synchronous long-running work in handlers, no client bypassing the API, no payment fields).
3. `progress-tracker.md` reflects the completed work, updated Open Questions (if any), and any new Architecture Decisions made along the way.
4. `go build ./...` and the mobile app's build check (`tsc --noEmit`, `expo lint` or equivalent) both pass with zero errors.
5. If the unit touched auth, verification, or access-control logic, a corresponding unit/integration test exists and passes.
