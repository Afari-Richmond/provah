# Provah: Project Overview

## Overview

A platform that gives final-year university capstone/final-year projects (Africa-first) a life beyond the grading panel. Today these projects, often genuinely solving real problems, get graded once and then disappear inside a university archive. Provah gives students a public, structured showcase for their project (problem, solution, tech stack, team, documents, demo links) and gives industry professionals/organizations a way to discover, evaluate, and reach out to the students behind them.

## Goals

1. Ship a demoable v1: student can create a profile, upload a project with full detail (problem/solution, tech stack, team, documents, external links), and a professional can discover it, view it, and express interest, end to end, self-serve.
2. Seed the supply side first. Get a meaningful number of real student projects on the platform (via direct student signup and/or university/department partnerships) before actively marketing to industry, since a professional's first visit with an empty feed kills the platform's credibility permanently.
3. Keep this buildable and maintainable by a small/solo technical team, on low-cost infrastructure, through the pilot phase.
4. Validate that "Express Interest" (or messaging) from a professional to a student is something students actually want and respond to. This is the platform's core value hypothesis and is currently unproven.

## Core User Flow

**Student:**
1. Signs up, self-serve (see Auth: university email intended as a trust signal, exact verification mechanism is an open question, see `progress-tracker.md`).
2. Sets up profile (name, university, field of study).
3. Uploads a project: visuals/media, problem statement, solution, tech stack, team members, documentation (PDF/report), external links (GitHub repo, live demo/hosted link).
4. Project appears in the public feed/discovery surface once submitted.
5. Receives messages / expressions of interest from professionals; views own project's stats (views, bookmarks).

**Industry Professional:**
1. Signs up, self-serve.
2. Browses/searches projects by keyword, field, university, category.
3. Opens a project's detail page: problem, solution, tech stack, team, documents.
4. Messages the student and/or expresses interest in the project.
5. Bookmarks/saves projects for later; maintains a profile others can see.

## Features

### Two roles, one app (Phase 0–1)
- Single React Native app; role selected at onboarding (Student vs Industry Professional) and branches the rest of the UX from there, not two separate apps. See `architecture.md`.
- Auth + profile setup for both roles.

### Project Upload & Management (Phase 1)
- Multi-step upload flow: project visuals/media, problem/solution write-up, tech stack tags, team members, documentation upload (PDF), external links (GitHub, live demo).
- Student can edit/manage their own submitted projects.

### Discovery & Project Detail (Phase 1)
- Search by keyword/field/university; category/field filter chips.
- Project feed (browse) and a "featured project" surface.
- Project detail page: Problem/Solution tabs, Tech Stack, Team, Documents, view/like counts.

### Connection (Phase 2)
- "Express Interest" and "Message Student" actions from a project detail page. **Exact behavior of "Express Interest" is not yet defined**; see Open Questions in `progress-tracker.md`. Do not build this ahead of that decision being made.
- Basic messaging between a professional and a student.

### Trust & Profiles (Phase 2–3)
- Student and Professional profile pages: stats (views, connections), saved/bookmarked projects, achievement badges (e.g. "Verified Student", competition/award badges).
- Student verification signal exists in the UI ("Verified Student" badge); verification *mechanism* is undecided (see Open Questions).
- Professional verification/trust signal does not yet exist in the UI and is flagged as a gap; see `progress-tracker.md`.

### Institutional Accounts (Phase 4, later; not yet scoped)
- A department/faculty-level account able to bulk-list a cohort's projects, to make it easier to seed supply via university partnerships rather than one student at a time. Not designed yet; flagged as a possible future account type, not committed.

### Growth Features (Phase 5, later)
- Notifications/push, richer analytics for students (who's viewing/interested), possible monetization (see Open Questions, no model decided), multi-country/multi-university expansion.

## In Scope

- One React Native app, two roles (Student, Industry Professional), shared Go backend, shared PostgreSQL database.
- Public project showcase: upload, browse, search, detail view.
- Professional-to-student connection via messaging / expressed interest.
- Africa-first, university-agnostic (not locked to one country/institution at launch).

## Out of Scope (for now)

- Payments/transactions of any kind. This is not a marketplace with money changing hands in v1. If a monetization model is adopted later it needs its own design pass (see Open Questions).
- Institutional/department bulk-management accounts, flagged as a future idea, not in the current build scope.
- Automated professional verification (e.g. LinkedIn/company-domain checks), not designed yet.
- In-app video calls or scheduling; messaging only.
- Web version of the app; mobile (React Native) only for v1.

## Success Criteria

1. A student can complete signup, build a profile, upload a full project (all fields from the Upload Flow), and have it appear in discovery, entirely self-serve.
2. A professional can complete signup, search/browse, open a project detail page, and send a message or express interest, entirely self-serve.
3. At least one real "expression of interest" or message, sent by a real professional to a real student's real project, is delivered and read, validating the core connection loop end to end.
4. The project feed has enough real (non-seed/fake) student projects that a first-time professional visitor doesn't see an empty or obviously-sparse feed.
