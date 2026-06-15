# Swiss Brutalist Redesign Plan: theme-layout-brutalist

This plan overhauls the personal portfolio of Kshitiz Kumar from the typical tech startup theme (cyan accents, glassmorphism, rounded card bento boxes) to a raw, high-contrast **Swiss Brutalist / Swiss Punk** style (**Option B**).

---

## 📋 Project Information
- **Project Type**: WEB (Next.js App Router)
- **Primary Agent**: `frontend-specialist`
- **Active Skills**: `frontend-design`, `tailwind-patterns`, `nextjs-react-expert`, `web-design-guidelines`

---

## 🎯 Success Criteria
1. **Visual Identity**: Completely eliminate all shades of blue/cyan and soft glows. Implement a pure Swiss Brutalist design:
   - Primary BG: Pure black (`#000000`) or very dark gray (`#0D0D0D`).
   - Accent: Swiss Crimson Red (`#D90429`).
   - Border: Solid high-contrast white/gray borders (`1px`/`2px`), zero soft shadows, zero glows.
2. **Geometry**: Complete removal of soft rounded corners (`rounded-lg`, `rounded-2xl`, etc.). All components must have sharp, crisp edges (`rounded-none` / `0px` radius).
3. **Layout Overhaul**:
   - Redesign the Hero section to use an asymmetric typographic layout rather than the standard 50/50 split grid.
   - Restructure grid systems (Bento grids) into raw list columns, overlapping blocks, or asymmetric borders.
4. **Verification**: Compile and pass Next.js build, linting checks, and UX/accessibility checks.

---

## 🛠️ Proposed Changes & File Structure

### Global Styling / Design System

#### [MODIFY] [globals.css](file:///home/void999/Documents/projects/mypf/app/globals.css)
- Reconfigure CSS custom properties:
  - `--bg-primary` -> `#000000` (Pure Black)
  - `--bg-secondary` -> `#0A0A0A` (Stark dark)
  - `--bg-card` -> `#0D0D0D` (Dark gray card background)
  - `--accent-primary` -> `#D90429` (Swiss Crimson Red)
  - `--accent-secondary` -> `#9B0218` (Darker Crimson)
  - `--border-color` -> `rgba(255, 255, 255, 0.12)`
  - `--border-hover` -> `#D90429`
- Set all component border-radii properties (e.g. scrollbar, buttons, cards) to sharp (`0px`).
- Replace glow shadows with raw offset solid shadows (e.g. `4px 4px 0px #D90429`).

#### [MODIFY] [tailwind.config.ts](file:///home/void999/Documents/projects/mypf/tailwind.config.ts)
- Replace color mappings of `cyan` with `crimson` (`#D90429`).
- Update keyframes and animations to remove cyan glow keyframes. Add custom brutalist animation transitions.

---

### Components Redesign

#### [MODIFY] [Navbar.tsx](file:///home/void999/Documents/projects/mypf/app/components/Navbar.tsx)
- Restructure navbar to feel raw and asymmetric.
- Set container bounds to stark, sharp border-bottom, removing glassmorphism blur and rounded buttons.

#### [MODIFY] [Hero.tsx](file:///home/void999/Documents/projects/mypf/app/components/Hero.tsx)
- Redesign the section typography: huge display headlines (Syne) centered or stark left-aligned with asymmetric letter sizing.
- Replace the `FloatingCredentialCard` glassmorphism and rounded layout with a solid black/crimson block offset card with `0px` border radius and solid raw border outline.
- Re-adjust hls.js video styling to sit in an overlapping asymmetrical container rather than a balanced 50/50 split grid.

#### [MODIFY] [About.tsx](file:///home/void999/Documents/projects/mypf/app/components/About.tsx) & [ExpertiseGrid.tsx](file:///home/void999/Documents/projects/mypf/app/components/ExpertiseGrid.tsx)
- Swap standard grid structures for raw stacked containers separated by thick solid borders.
- Replace rounding and gradients with brutalist solid fills and stark high-contrast typography.

#### [MODIFY] [ProjectGallery.tsx](file:///home/void999/Documents/projects/mypf/app/components/ProjectGallery.tsx) & [ProjectCard.tsx](file:///home/void999/Documents/projects/mypf/app/components/ProjectCard.tsx)
- Set card corner radius to `0px`.
- Re-style hover effects: replace subtle opacity/glows with stark position translations and solid crimson offsets.

#### [MODIFY] [Testimonials.tsx](file:///home/void999/Documents/projects/mypf/app/components/Testimonials.tsx), [FAQ.tsx](file:///home/void999/Documents/projects/mypf/app/components/FAQ.tsx), [CTA.tsx](file:///home/void999/Documents/projects/mypf/app/components/CTA.tsx) & [Footer.tsx](file:///home/void999/Documents/projects/mypf/app/components/Footer.tsx)
- Remove all rounded corners, cyan gradients, and soft visual buffers.
- Align with the stark black/crimson palette.

---

## 📅 Task Breakdown

### Task 1: Global Design Tokens Initialization
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `tailwind-patterns`
- **Priority**: P0
- **INPUT**: Current `app/globals.css` and `tailwind.config.ts`.
- **OUTPUT**: Updated design tokens: Swiss Crimson Red (`#D90429`) primary accent, pure black layout foundations, sharp `0px` border radius defaults, and solid offset shadows.
- **VERIFY**: Run `npm run build` to ensure tailwind configuration compiles without errors.

### Task 2: Redesign Global Navigation & Layout Shell
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P1
- **INPUT**: `app/components/Navbar.tsx` and `app/layout.tsx`.
- **OUTPUT**: Stark, asymmetric navigation navbar with sharp corners, thick border-b, and red accent cues.
- **VERIFY**: Visual checking of the top section at `http://localhost:3001/` in the browser.

### Task 3: Redesign Hero Section Layout
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P1
- **INPUT**: `app/components/Hero.tsx`.
- **OUTPUT**: Overlapping asymmetrical typography structure, video background constrained in an offset raw container, credential card styled as a solid sharp badge with zero radius and bold red borders.
- **VERIFY**: Ensure the video compiles using hls.js and stats/badges render without TS errors.

### Task 4: Re-style Main Body & Project Grid Components
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P2
- **INPUT**: `app/components/About.tsx`, `app/components/ExpertiseGrid.tsx`, `app/components/ProjectGallery.tsx`, `app/components/ProjectCard.tsx`.
- **OUTPUT**: Stacked raw elements, sharp borders, layout grid offsets, and hover transitions using solid offsets instead of shadows/glows.
- **VERIFY**: Check layout rendering in both mobile and desktop viewports.

### Task 5: Re-style Call-To-Action, FAQ, Testimonials & Footer
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`
- **Priority**: P2
- **INPUT**: `app/components/Testimonials.tsx`, `app/components/FAQ.tsx`, `app/components/CTA.tsx`, `app/components/Footer.tsx`.
- **OUTPUT**: Consistent Swiss Brutalist borders, zero radii, stark typography blocks, and crimson themes.
- **VERIFY**: Expand accordion FAQs to verify no broken borders or animations.

---

## 🏁 Phase X: Verification Plan

### Automated Checks
- Run typescript compilation: `npx tsc --noEmit`
- Run project build: `npm run build`
- Run quality audits:
  ```bash
  python .agents/skills/frontend-design/scripts/ux_audit.py .
  ```

### Manual Checks
- [ ] No purple/violet color hex values used.
- [ ] No cyan or fintech blue/teal accents remaining.
- [ ] Rounded corners completely eliminated (0px radius).
- [ ] Predictions: Hero section does not contain a 50/50 column split.
