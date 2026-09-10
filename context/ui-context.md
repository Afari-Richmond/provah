# UI Context

## Status: Mockups exist in FlutterFlow, reviewed 2026-09-10; no app code built yet

The user designed the full UI flow in FlutterFlow Designer and shared a share-link
(`https://share.ffdesigner.app/d63d519a-4b1d-419e-a00d-f17fd359a5e1`, resolves to
`https://designer.flutterflow.io/remix/{id}`). Reviewed via browser screenshots in the same
session this context system was created. **This FlutterFlow project is the source of truth
for screen inventory and layout; treat it as the spec, not these notes.** Re-open it (or
export from it directly) before building any screen rather than relying on the descriptions
below from memory, and pull exact color/spacing/font tokens from the FlutterFlow project
itself (its own inspector/export), not from eyeballing screenshots; the notes below are
observational, not measured.

## Screen Inventory (10 frames, as of the reviewed version)

1. **Splash Screen**: "Provah" wordmark, purple on light background.
2. **Onboarding**: "Showcase Your Best Work" value prop, then an "I am a..." role picker:
   **Student** ("I want to showcase my project") vs **Industry Professional** ("I'm looking
   for innovative ideas"). This is the role-branch point for the whole app; see
   `architecture.md` Roles and App Branching.
3. **Auth**: "Welcome back" / "Welcome Back" login card: email address (placeholder
   `name@university.edu`, implies a university-affiliated email is expected from students,
   mechanism undecided, see `progress-tracker.md`), password, "Sign In" primary button,
   "Continue with Google" social option, sign-up link. Has a step-progress indicator
   (dots) suggesting a short multi-step signup beyond this single screen.
4. **Student Home**: greeting header ("Hello, David"), a projects-viewed stat card,
   "Explore Projects" and "Active Professionals" quick-access cards, a recent-activity feed.
5. **Professional Discovery**: search bar (keyword/field/university), category/field filter
   chips (Engineering, Fintech, Health, Agri, ...), a featured project card, a "Recent
   Submissions" grid with tags (e.g. Featured, NFT, Blockchain) and view/like counts.
6. **Project Feed**: similar browse surface to Discovery: search bar, category chips
   (All/Engineering/Tech/Health/Social), sort control, project card grid.
7. **Project Details**: the most fully-specified screen: media header, title, university +
   team lead byline, stat row (views, likes, comments), a Problem/Solution tabbed section,
   Tech Stack (tag chips, e.g. Python, TensorFlow, OpenCV, Flutter), Team (member avatars),
   Documents (e.g. a technical documentation PDF, a demo video), and two primary CTAs:
   **"Message Student"** and **"Express Interest."** The exact behavior behind "Express
   Interest" is undefined; see Open Questions in `progress-tracker.md`. Do not build it
   without that decision first.
8. **Project Upload Flow**: multi-step ("Step 2 of 4", "75% Complete"): project
   visuals/media upload, documentation upload (PDF), external links (GitHub repository URL,
   live demo/portfolio URL), with Back/Continue navigation.
9. **Student Profile**: avatar, name, university/field, a stats row (projects, total
   views, connections), achievement badges ("Top Project 2023", "Engineering Week Winner",
   "Verified Student"), and a "My Projects" grid.
10. **Professional Profile**: avatar, name, role/company, location, an edit-profile /
    share-profile action pair, a stats row (rated, connects, interests), "Areas of
    Interest" tag chips, and a "Saved Projects" grid. No verification/trust badge exists
    for this role; flagged as a gap in `project-overview.md`.

## Visual Direction (observed, not yet formalized into tokens)

- Primary brand color reads as a purple/violet (buttons, active states, wordmark).
  **Exact hex not yet pulled from the FlutterFlow source; do not guess it from
  screenshots.**
- Cards use a rounded, moderate-radius style (not full pill) with light hairline borders,
  closer to the "oread-erp card mechanics" precedent (neutral gray scale + one brand
  color + semantic status colors) than to Laundria's full-pill/Nunito direction, but this
  has not been discussed with the user for Provah specifically and should not be assumed.
- Tag/chip components (tech stack, categories, badges) are used heavily throughout;
  worth building as one shared, reusable component early rather than per-screen.

## What needs to be decided

- Exact color tokens, typography, and spacing scale: pull from the FlutterFlow project
  directly (export or inspector), then formalize into `mobile-app/src/theme/`.
- Whether to build screens 1:1 from the FlutterFlow layouts or use them as a direction
  and adapt for React Native idioms/performance (e.g. list virtualization on
  Discovery/Feed); not yet discussed with the user.
- Light/dark mode: not yet discussed for this project (Laundria treats both as required
  by default; not assumed to carry over here without asking).
- A verification/trust visual treatment for the Professional role, to match the
  Student side's "Verified Student" badge (see Screen 10 above).

## Component Library

- Not yet chosen. Default to plain `StyleSheet` (React Native) until a decision is made,
  per `code-standards.md`.

## Modes

- Not yet decided whether light and dark mode are both required; ask before assuming
  either way (unlike Laundria, where this was already settled).

## Data Visualization

- Student/Professional profile and home screens show simple stat numbers today, not
  charts. If richer analytics (Phase 5 in `project-overview.md`) introduces real charts
  later, validate the chart palette with the `dataviz` skill at that point.
