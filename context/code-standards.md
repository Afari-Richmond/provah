# Code Standards

## General Principles

- Optimize for consistency across modules over cleverness within a single module. Every module should feel like it was written by the same person, because it will be read/extended by an AI agent session after session.
- No module reaches into another module's internal package. Cross-module interaction happens only via exported interfaces (see `architecture.md`).
- No payment/money fields or logic anywhere in the codebase while Payments is Out of Scope (`project-overview.md`).

---

## Backend (Go)

### API Style

- Plain REST over JSON. No GraphQL, no gRPC, no RPC-style internal frameworks.
- Routes follow resource-based nesting: `/api/v1/{module}/{resource}`, e.g. `/api/v1/projects/{id}`, `/api/v1/discovery/projects`.
- Standard HTTP verbs map to standard CRUD semantics: `GET` (read), `POST` (create), `PATCH` (partial update), `DELETE` (soft-delete where applicable, e.g. a student removing their own project).
- All request/response bodies are JSON, except file upload endpoints (multipart, or presigned-URL issuance; see `architecture.md`).
- Every response follows a consistent envelope:

```go
type APIResponse struct {
    Data  interface{} `json:"data,omitempty"`
    Error *APIError   `json:"error,omitempty"`
    Meta  *Meta       `json:"meta,omitempty"` // pagination, etc.
}

type APIError struct {
    Code    string `json:"code"`    // e.g. "invalid_input", "not_found", "forbidden"
    Message string `json:"message"` // human-readable, safe to show in UI
}
```

### Project Structure (per module)

Every module under `/server/internal/modules/{name}` follows the same internal layout: `handler.go` (HTTP handlers only, no business logic), `service.go` (business logic), `repository.go` (all DB access for this module's tables), `types.go` (module-local types/DTOs).

### Testing

- Any code enforcing ownership/access control (a student editing only their own project, a user only reading their own messages) requires a passing unit test before the unit is considered done. This is Provah's highest-risk category of bug, given everything is user-generated content and direct messaging between strangers.

---

## Frontend: Mobile App (React Native / Expo, TypeScript)

- Functional components + hooks only, no class components.
- Navigation via React Navigation; screens organized by flow (`onboarding/`, `auth/`, `discovery/`, `projects/`, `connections/`, `profile/`), with role-specific screens (Student vs Professional home/profile) living in their own subfolders rather than branching heavily inside one shared screen component.
- All API calls go through a single typed client (`lib/api/`) mirroring the Go backend's `APIResponse` envelope. No ad hoc `fetch` calls scattered through screens.
- Role branching (Student vs Professional) happens at the navigation level (which stack/tabs are mounted after onboarding), not via scattered `if (role === ...)` checks inside shared screens.

## UI Component Library

- No component library chosen yet; plain `StyleSheet` until `ui-context.md`'s tokens (colors, type, radii) are pulled from the FlutterFlow source of truth and confirmed. No raw hex values once tokens exist; use the theme tokens.

---

## Git / Commits

- Conventional Commits (`type(scope): subject`), enforced via commitlint + a husky `commit-msg` hook. See `commitlint.config.mjs` for the allowed scopes.
- One logical change per commit; do not bundle backend and frontend changes for unrelated features in the same commit.
