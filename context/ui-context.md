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
   `architecture.md` Roles and App Branching. **Split into two screens 2026-09-10** — see
   Visual Direction below (Onboarding carousel + persisted session) for what changed and
   why; the role picker itself is unchanged, just moved to its own `RoleSelect` screen.
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

## Visual Direction: implemented (2026-09-10)

The user provided a Pinterest reference
([pin 827325394087592648](https://www.pinterest.com/pin/827325394087592648/), "E-Study
Online Learning Mobile App - Minimal EdTech UI") and asked for the whole app to be
restyled to match it, explicitly approving the change ahead of time. This **supersedes**
the earlier "not yet pulled from FlutterFlow" placeholder tokens below and is now the
active, implemented style system across every screen in `mobile-app/`. Adapted for
Provah's own content (projects, not courses); no text or assets were copied from the
reference, only the visual language.

- **Colors** (`mobile-app/src/theme/colors.ts`): primary purple `#6C4CE0` (buttons, active
  tab badges, active icon badges, headline accents), accent orange `#FF7A30` (notification
  badge, alternating icon badges/tags), tinted `primaryMuted`/`accentMuted` backgrounds for
  tag chips, near-white `surface` (`#F6F4FC`) for search bars/input fields, `chipActiveBg`
  (near-black) for active filter-chip fill. Both purple and orange came directly from the
  pin, not inferred.
- **Cards**: white background, large radius (`radii.xl` = 26), soft drop shadow
  (`theme/shadow.ts` `cardShadow`, not a border) — matches the pin's card mechanic exactly.
- **Icon badges** (`components/IconBadge.tsx`): rounded-square colored background (purple
  or orange, alternating) with a white Ionicon, used on Onboarding role cards, Student
  Home quick-access cards, and document/activity rows — the pin's dominant recurring motif.
- **Two distinct chip styles**, matching the pin's two chip patterns:
  `components/FilterChip.tsx` (category filters — solid dark fill when active, plain text
  when not) and `components/TagChip.tsx` (tech stack / badges / areas of interest — tinted
  pill, purple or orange).
- **Progress bar** (`components/ProgressBar.tsx`): light gray track, colored fill,
  full-pill radius — reused directly for the Project Upload flow's step progress, which
  maps naturally onto the pin's lesson-completion progress bar.
- **Tab bar**: white bar, active tab = filled purple circle behind the icon, inactive =
  plain gray icon, no labels — matches the pin's bottom nav exactly.
- **Typography**: bold system-default weights only (`theme/fonts.ts`), large tight-tracked
  headlines (e.g. Student Home's "Let's Get Your Work Seen"). No custom font family
  installed yet — the pin's font hasn't been identified/licensed, so this is a weight-only
  match, not a full typographic match.
- Verified: `tsc --noEmit` clean, `eslint .` clean, `expo export --platform ios` bundles
  (1074 modules). Visually confirmed against the pin in the iOS Simulator: Onboarding
  matches closely (icon badges, card shadows, pill button, headline weight). Other screens
  share the same theme/components so are structurally consistent, but weren't each
  individually screenshotted against the pin in this pass — full tap-through wasn't
  scriptable in this environment (see `progress-tracker.md`).
- **Buttons** (2026-09-10, second pass): a further Pinterest reference
  ([pin 1125055550685477475](https://www.pinterest.com/pin/1125055550685477475/), "Minimal
  Login Screen UI – Axis App Design"), aimed at the Auth screen, called for fuller-pill
  button radius and more generous padding than the first pass had. `PrimaryButton`
  (`mobile-app/src/components/PrimaryButton.tsx`) now uses `radii.pill` (was `radii.lg`)
  with `paddingVertical: spacing.md + 4` and `paddingHorizontal: spacing.lg`. Applied
  app-wide since it's one shared component, not scoped to Auth alone — see
  `progress-tracker.md` for the judgment-call note.
- **Feedback modal** (2026-09-10, third pass): a Pinterest reference
  ([pin 716916834477537954](https://www.pinterest.com/pin/716916834477537954/), "Minimal
  Success Confirmation UI") for "success toasts" turned out to be a bottom-sheet
  confirmation modal, not a small transient toast — built as that instead (a real toast
  would lose the reference's badge/title/subtitle/button layout). New
  `components/FeedbackSheet.tsx`: dimmed backdrop, white sheet with rounded top corners,
  a scalloped `MaterialCommunityIcons` "check-decagram" / "alert-decagram" badge on a
  tinted circle (green `colors.success` / red `colors.danger`), bold title, subtitle, and
  a full-width `PrimaryButton` to dismiss. The user asked to "replicate for errors" — one
  component with a `variant` prop covers both rather than a separate error design, since
  the reference's mechanics (badge + title + subtitle + button) are identical, only the
  icon/color change. Wired into two real spots: `ProjectUploadScreen`'s submit success
  (replacing its old inline success view) and `AuthScreen`'s empty-field validation error
  (the only client-side error condition that exists without a real backend yet — see
  Open Architecture Questions in `architecture.md`, no fake network-error state was
  invented). Verified: `tsc --noEmit` clean, `eslint .` clean. Visually confirmed both
  variants directly in the iOS Simulator via a temporary debug shortcut (forced
  `AppNavigator`'s `initialRouteName` to `"Auth"` and `showError` to `true`, screenshotted
  both variants, then fully reverted before committing — `git diff` confirmed zero residue)
  since simulator taps still aren't automatable in this environment.
- **Onboarding carousel + persisted session** (2026-09-10, fourth pass): a Pinterest
  reference ([pin 37154765671383298](https://www.pinterest.com/pin/37154765671383298/),
  "Zevoa Travel & Logistics App Onboarding UI Design") showed a splash screen (centered
  wordmark on plain white, no tint) followed by a swipeable welcome-carousel screen
  (illustration, headline, subtitle, dot pagination). The user asked for 3 such slides
  before Auth/home, "in case the person is logged in" — read as also wanting persisted
  session skip, not just the carousel. This **restructures navigation**: what was one
  `Onboarding` screen (value-prop text + role picker together) is now two —
  `Onboarding` (new 3-slide carousel, original copy, not copied from the reference: capstone
  showcase → industry discovery → direct connection, each with a large Ionicon inside a
  tinted circle standing in for the reference's illustration artwork, since no real
  illustration asset exists or was sourced) and `RoleSelect` (the original "I am a..." role
  picker, moved verbatim, unstyled otherwise). `SplashScreen` now checks
  `lib/session.ts`'s `getPersistedRole()` (installed `@react-native-async-storage/
  async-storage`) before deciding where to go: found → `navigation.reset` straight into
  `StudentApp`/`ProfessionalApp`, skipping onboarding/role-select/auth entirely; not found
  → the carousel. `AuthScreen`'s mock "Sign In" now calls `persistRole()` on success. This
  is still not real auth (see `architecture.md` Open Architecture Questions) — just a
  remembered role flag across app restarts, clearly commented as such in `session.ts`.
  Splash's background changed from the tinted `colors.surface` to plain `colors.background`
  to match the reference. No logout UI exists yet to clear the persisted role for
  re-testing/demoing the first-run flow — flagged as a gap, see `progress-tracker.md`.
  Verified: `tsc --noEmit` clean, `eslint .` clean, `expo export --platform ios` bundles.
  Visually confirmed the carousel's first slide directly in the iOS Simulator (illustration
  circle, headline, subtitle, 3-dot pagination with active pill dot, full-pill "Next"
  button — matches the reference's mechanics closely); the top-right "Skip" link exists in
  code but was occluded in the screenshot by the Console Ninja VS Code extension's debug
  overlay (confirmed unrelated to app code, same false-positive Laundria's session history
  already flagged), so it wasn't independently visually confirmed. The persisted-session
  skip path (Splash → straight into the app) also wasn't visually confirmed — would need
  either tap automation to complete a real Sign In first, or another temporary debug
  shortcut to seed `AsyncStorage` directly; not done this pass, reasoned through via code
  review instead (a small, low-risk async/await + `navigation.reset` call).

## What's still undecided

- Whether to build screens 1:1 from the FlutterFlow layouts' *content/structure* now that
  the *visual* direction has switched to the Pinterest reference — currently treating
  FlutterFlow as the screen-inventory/content spec and the Pinterest pin as the visual
  spec, layered together; not explicitly confirmed with the user as the intended split.
- Light/dark mode: not yet discussed for this project (Laundria treats both as required
  by default; not assumed to carry over here without asking). Current implementation is
  light-only.
- A verification/trust visual treatment for the Professional role, to match the
  Student side's "Verified Student" badge (see Screen 10 above).
- Real font family (the pin's headline font hasn't been identified/licensed).

## Component Library

- No third-party component library. Plain `StyleSheet` + a small set of shared components
  (`IconBadge`, `TagChip`, `FilterChip`, `ProgressBar`, `PrimaryButton`, `ProjectCard`) in
  `mobile-app/src/components/`, per `code-standards.md`.

## Modes

- Not yet decided whether light and dark mode are both required; ask before assuming
  either way (unlike Laundria, where this was already settled).

## Data Visualization

- Student/Professional profile and home screens show simple stat numbers today, not
  charts. If richer analytics (Phase 5 in `project-overview.md`) introduces real charts
  later, validate the chart palette with the `dataviz` skill at that point.
