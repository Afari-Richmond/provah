# Provah

A platform that gives African university final-year capstone projects visibility beyond the grading panel: students showcase their projects, and industry professionals discover and connect with the talent behind them. See `context/project-overview.md` for the full product overview, and the rest of `context/` for architecture, code standards, UI conventions, the AI-assisted workflow rules, and current build progress.

## Layout

- `mobile-app/`: React Native (Expo, TypeScript) app, single codebase for both roles
  (Student, Industry Professional) branching at onboarding. **Not yet scaffolded.**
- `server/`: Go backend module (own `go.mod`), shared by both roles. **Not yet scaffolded.**
  - `server/cmd/api/`: Go API entrypoint (Gin).
  - `server/internal/platform/`: shared backend infrastructure (DB, auth, file-upload issuance).
  - `server/internal/modules/`: one folder per domain area (auth, students, professionals, projects, discovery, connections, notifications).
  - `server/migrations/`: versioned SQL migrations (golang-migrate).
- `context/`: the six-file context system (see `ai-workflow-rules.md`).

## Status

Pre-build. Planning complete; context system scaffolded (mirroring `~/laundria`'s
structure). UI designed in FlutterFlow (see `context/ui-context.md` for the share link and
screen inventory). `mobile-app/` and `server/` not yet started; see
`context/progress-tracker.md` for current phase and next steps.

## Development

Neither `mobile-app/` nor `server/` is runnable yet; not yet scaffolded. See
`context/progress-tracker.md` Next Up.

## Commit messages

This repo follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
(`type(scope): subject`, e.g. `feat(mobile-app): add onboarding role picker`), enforced
locally via a `commit-msg` git hook (commitlint). See `commitlint.config.mjs`.

## Landing page

[provah.richmondafari.me](https://provah.richmondafari.me)
