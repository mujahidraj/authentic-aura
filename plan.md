
## High-End Portfolio Website — "Unthinkably Unique"

### Project Overview
A cinematic, dark, immersive personal portfolio that blends data visualization with editorial design. Every element reacts to the user, and all content is driven by local JSON files — making updates as simple as editing a text file.

---

### 1. Data Architecture
A `src/data/` folder with 9 JSON files, each populated with rich mock content so the UI is fully visible from day one:
- `projects.json`, `demo_projects.json`, `data_science_works.json`, `wordpress_works.json`, `works.json`
- `education.json`, `experiences.json`, `publications.json`, `pricing.json`

A central `usePortfolioData` hook aggregates all sources, and a unified tag extraction utility powers the smart filtering system.

---

### 2. The Hero — 3D Interactive Globe
- Deep space void background with a subtle film-grain noise texture overlay
- An auto-rotating 3D globe built with `react-globe-gl`, centered and locked onto **Bangladesh** (23.68°N, 90.35°E)
- A pulsing, glowing beacon marker over Bangladesh that breathes with a soft amber/gold animation
- Overlaid editorial typography: name, title, and a one-line manifesto — large, bold, with a monospaced accent color
- Custom animated cursor visible throughout the site that morphs on hover (default: dot → code brackets over DS projects → eye icon over publications)

---

### 3. Bento Grid Layout
- The main content area uses a masonry/bento grid — not a boring list. Cards vary in size organically based on content weight
- A **Tag Cloud / Smart Filter Bar** sits above the grid, derived from all JSON tags. Clicking "Python" filters the grid to only show matching DS, project, and demo items. Clicking "WordPress" shows only CMS work
- Smooth Framer Motion layout animations when the grid re-arranges after filtering

---

### 4. Rich Project Cards
Each card displays:
- Title, subtitle, and a short teaser description
- Tech stack pills (color-coded by category)
- A hover state with parallax depth effect (the card "lifts" toward the cursor)
- **Data Science cards** get a special Jupyter/VS Code window chrome treatment — dark terminal aesthetic with a syntax-highlighted code snippet preview

---

### 5. Full-Screen Detail Overlay
Clicking any card opens an immersive full-screen overlay (not a small modal):
- Hero image / gallery carousel at the top
- Title, deep description with **Markdown rendering**
- "Story behind the work" section in italicized editorial type
- Tech stack tags + live links (Demo, GitHub, Research Paper) as magnetic buttons
- For DS items: a syntax-highlighted code block (via `react-syntax-highlighter`) rendered from the JSON's `codeSnippet` field
- Smooth entry/exit animation (slide up + fade)

---

### 6. The "Life Journey" Timeline
A dedicated section that visualizes `education.json` and `experiences.json` as a connected vertical timeline:
- Each node is a card: role/degree, institution, date range, location, and key achievements
- **Scroll-linked Globe Spin**: as the user scrolls to each timeline node, the 3D globe smoothly rotates to that node's geographic coordinates (stored in JSON)
- Framer Motion scroll progress drives the globe rotation

---

### 7. Editorial Contact Panel
- A floating **"Let's Talk"** button in the corner
- Clicking it slides in a glassmorphism side panel from the right
- Fields: Name, Email, Project Type (dropdown from `pricing.json` categories), Message
- Full validation via React Hook Form + Zod
- Subtle noise texture on the glass panel

---

### 8. "Live Resume" — PDF Generated On-The-Fly
- A floating action button: **"Download CV"**
- Uses `@react-pdf/renderer` to generate a fresh, beautifully formatted PDF resume at click time, pulling live data from `education.json`, `experiences.json`, and `works.json`
- No stale static PDF — the CV is always in sync with the site content

---

### 9. Micro-Interactions & Polish
- **Film grain noise overlay**: a subtle SVG/CSS noise texture on the background for a tactile, non-digital feel
- **Custom cursor**: morphs between states (dot, brackets `{}`, eye `◉`) based on what's being hovered
- **Magnetic buttons**: key CTAs subtly attract toward the cursor on hover
- **Framer Motion entry animations** on every section: staggered fade-up as elements enter the viewport
- **Large editorial typography**: section headers are oversized, with a mix of Inter (clean) and a monospaced font for data labels and tech tags

---

### Tech Stack Summary
| Layer | Technology |
|---|---|
| Framework | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| 3D Globe | `react-globe-gl` |
| Syntax Highlight | `react-syntax-highlighter` |
| Markdown | `react-markdown` |
| PDF Generation | `@react-pdf/renderer` |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
