import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Section {
  id: string;
  label: string;
  icon: string;
}

const SECTIONS: Section[] = [
  { id: 'overview',      icon: '◈', label: 'Overview'           },
  { id: 'architecture',  icon: '⬡', label: 'Architecture'       },
  { id: 'design',        icon: '◉', label: 'Design System'      },
  { id: 'data',          icon: '∷', label: 'Data Layer'         },
  { id: 'components',    icon: '⬢', label: 'Components'         },
  { id: 'sections',      icon: '≡', label: 'Page Sections'      },
  { id: 'interactions',  icon: '↗', label: 'Micro-Interactions'  },
  { id: 'personalize',   icon: '✦', label: 'Personalizing'      },
];

// ─── Small reusable blocks ────────────────────────────────────────────────────
function Tag({ children, color = 'primary' }: { children: string; color?: string }) {
  const styles: Record<string, React.CSSProperties> = {
    primary:  { background: 'hsl(var(--primary) / 0.15)',  color: 'hsl(var(--primary))',         border: '1px solid hsl(var(--primary) / 0.3)'  },
    accent:   { background: 'hsl(var(--accent) / 0.10)',   color: 'hsl(var(--accent))',           border: '1px solid hsl(var(--accent) / 0.25)'  },
    muted:    { background: 'hsl(var(--muted))',             color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--border))'          },
  };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded font-mono text-xs font-medium" style={styles[color]}>
      {children}
    </span>
  );
}

function Code({ children }: { children: string }) {
  return (
    <code
      className="px-1.5 py-0.5 rounded font-mono text-xs"
      style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--accent))' }}
    >
      {children}
    </code>
  );
}

function CodeBlock({ children, lang = 'json' }: { children: string; lang?: string }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(var(--border))' }}>
      <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'hsl(var(--muted))' }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(0 80% 60%)' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(38 95% 60%)' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(140 70% 50%)' }} />
        <span className="ml-2 font-mono text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{lang}</span>
      </div>
      <pre className="p-5 overflow-x-auto" style={{ background: 'hsl(var(--card))', margin: 0 }}>
        <code className="font-mono text-xs leading-relaxed" style={{ color: 'hsl(var(--foreground) / 0.85)' }}>
          {children}
        </code>
      </pre>
    </div>
  );
}

function InfoBox({ title, children, accent = false }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className="rounded-xl p-5 my-4"
      style={{
        background: accent ? 'hsl(var(--primary) / 0.06)' : 'hsl(var(--card))',
        border: `1px solid ${accent ? 'hsl(var(--primary) / 0.25)' : 'hsl(var(--border))'}`,
      }}
    >
      <p className="font-mono text-xs font-semibold mb-2" style={{ color: accent ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}>
        {accent ? '✦ ' : ''}
        {title}
      </p>
      <div className="text-sm leading-relaxed" style={{ color: 'hsl(var(--foreground) / 0.75)' }}>
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-display text-4xl font-bold mb-2"
      style={{ color: 'hsl(var(--foreground))' }}
    >
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-display text-xl font-bold mb-3 mt-8"
      style={{ color: 'hsl(var(--foreground) / 0.9)' }}
    >
      {children}
    </h3>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-relaxed mb-4" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
      {children}
    </p>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-4 py-3" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
      <span className="font-mono text-xs w-36 shrink-0" style={{ color: 'hsl(var(--muted-foreground))' }}>{label}</span>
      <span className="font-mono text-xs" style={{ color: accent ? 'hsl(var(--accent))' : 'hsl(var(--foreground) / 0.8)' }}>{value}</span>
    </div>
  );
}

// ─── Section content components ───────────────────────────────────────────────
function OverviewSection() {
  return (
    <div>
      <p className="font-mono text-xs mb-4" style={{ color: 'hsl(var(--primary))' }}>// docs / overview</p>
      <SectionTitle>Project Overview</SectionTitle>
      <p className="text-lg mb-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
        A cinematic, dark, fully data-driven personal portfolio. Every pixel reacts to the user.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {[
          { icon: '⬡', label: 'Framework', value: 'React 18 + Vite 5 + TypeScript 5' },
          { icon: '◈', label: 'Styling', value: 'Tailwind CSS + Custom Design Tokens' },
          { icon: '↗', label: 'Animation', value: 'Framer Motion 12' },
          { icon: '◉', label: '3D Visualization', value: 'react-globe.gl (Three.js)' },
          { icon: '∷', label: 'Data Source', value: '9 local JSON files in src/data/' },
          { icon: '✦', label: 'PDF Generation', value: '@react-pdf/renderer' },
          { icon: '≡', label: 'Forms', value: 'React Hook Form + Zod validation' },
          { icon: '⬢', label: 'Markdown', value: 'react-markdown + syntax highlighter' },
        ].map(item => (
          <div
            key={item.label}
            className="flex items-start gap-4 p-4 rounded-xl"
            style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
          >
            <span className="text-xl" style={{ color: 'hsl(var(--primary))' }}>{item.icon}</span>
            <div>
              <p className="font-mono text-xs mb-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.label}</p>
              <p className="font-mono text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <InfoBox title="Core Philosophy" accent>
        The portfolio is intentionally <strong>data-driven</strong> — all content lives in JSON files. To update a project, publication, or work experience, you edit a JSON file, not the source code. The UI reflects changes immediately on next load.
      </InfoBox>

      <SubTitle>Key Design Goals</SubTitle>
      <ul className="space-y-2 mb-6">
        {[
          'Cinematic dark aesthetic — "void black" background, amber gold primary, electric cyan accent',
          'Every section entry-animates via Framer Motion viewport detection',
          'The 3D globe is the hero — not a photo, not a gradient — a living data visualization',
          'Smart tag filtering across ALL content types from a single unified tag cloud',
          'Academic publications rendered with citation counts and venue badges',
          'Freelance pricing presented as elegant cards with deliverable checklists',
          'Custom morphing cursor communicates context (code bracket over DS work, eye over research)',
        ].map((goal, i) => (
          <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
            <span style={{ color: 'hsl(var(--primary))' }}>→</span>
            {goal}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArchitectureSection() {
  return (
    <div>
      <p className="font-mono text-xs mb-4" style={{ color: 'hsl(var(--primary))' }}>// docs / architecture</p>
      <SectionTitle>Architecture</SectionTitle>
      <Prose>The project uses a flat, component-centric architecture. There is no routing beyond the single portfolio page and this docs page. State is managed locally via React's <Code>useState</Code> and <Code>useRef</Code> hooks — no Redux or external state manager needed.</Prose>

      <SubTitle>Folder Structure</SubTitle>
      <CodeBlock lang="tree">{`src/
├── components/
│   ├── BentoGrid.tsx         ← Works grid with tag filter
│   ├── ContactPanel.tsx      ← Glassmorphism slide-out contact form
│   ├── CustomCursor.tsx      ← Morphing custom cursor
│   ├── DetailOverlay.tsx     ← Full-screen project detail view
│   ├── GlobeHero.tsx         ← 3D interactive globe hero section
│   ├── LifeTimeline.tsx      ← Scroll-linked journey timeline
│   ├── MagneticButton.tsx    ← Physics-based magnetic CTAs
│   ├── NavBar.tsx            ← Fixed nav with scroll-aware active state
│   ├── NavLink.tsx           ← Animated navigation link
│   ├── PricingSection.tsx    ← Freelance pricing cards
│   ├── ProjectCard.tsx       ← Bento card (standard + DS notebook style)
│   ├── PublicationsSection.tsx ← Academic paper cards
│   └── SectionWrapper.tsx   ← Viewport-triggered entry animation wrapper
├── data/
│   ├── projects.json         ← General engineering/product projects
│   ├── demo_projects.json    ← Prototypes and proof-of-concepts
│   ├── data_science_works.json ← ML/DS notebooks with code snippets
│   ├── wordpress_works.json  ← CMS and web design work
│   ├── works.json            ← Employment history
│   ├── education.json        ← Degrees and academic history
│   ├── experiences.json      ← Volunteer, research, leadership roles
│   ├── publications.json     ← Research papers and articles
│   └── pricing.json          ← Freelance service tiers
├── hooks/
│   └── usePortfolioData.ts   ← Central data aggregation hook
├── pages/
│   ├── Index.tsx             ← Main portfolio page
│   └── Docs.tsx              ← This documentation page
└── index.css                 ← Global design tokens (HSL CSS variables)`}</CodeBlock>

      <SubTitle>Data Flow</SubTitle>
      <Prose>All 9 JSON files are imported statically and merged inside <Code>usePortfolioData()</Code>. The hook exports a unified <Code>allPortfolioItems</Code> array (typed as <Code>PortfolioItem[]</Code>), a deduplicated <Code>allTags</Code> string array, a chronologically sorted <Code>timeline</Code>, and the raw <Code>publications</Code> and <Code>pricing</Code> objects.</Prose>

      <CodeBlock lang="typescript">{`// src/hooks/usePortfolioData.ts — simplified
export function usePortfolioData() {
  const allPortfolioItems: PortfolioItem[] = [
    ...projects,          // type: "project"
    ...demoProjects,      // type: "demo"
    ...dataScienceWorks,  // type: "data_science"
    ...wordpressWorks,    // type: "wordpress"
    ...publications.map(p => ({ ...p, type: 'publication' })),
  ];

  const allTags = extractAllTags(allPortfolioItems); // deduplicated, sorted
  const timeline = [...education, ...works, ...experiences]
    .sort((a, b) => b.period.localeCompare(a.period));

  return { allPortfolioItems, allTags, timeline, publications, pricing };
}`}</CodeBlock>
    </div>
  );
}

function DesignSection() {
  return (
    <div>
      <p className="font-mono text-xs mb-4" style={{ color: 'hsl(var(--primary))' }}>// docs / design-system</p>
      <SectionTitle>Design System</SectionTitle>
      <Prose>The entire visual language is defined as HSL CSS custom properties in <Code>src/index.css</Code> and exposed to Tailwind via <Code>tailwind.config.ts</Code>. No raw color values (hex, RGB) appear in components — everything references a semantic token.</Prose>

      <SubTitle>Color Palette</SubTitle>
      <div className="space-y-2 mb-8">
        {[
          { token: '--background',       value: 'hsl(0 0% 3%)',      desc: 'Near-void black — the void canvas',          swatch: 'hsl(0,0%,3%)'    },
          { token: '--foreground',       value: 'hsl(0 0% 92%)',     desc: 'Soft white text',                             swatch: 'hsl(0,0%,92%)'   },
          { token: '--primary',          value: 'hsl(38 95% 60%)',   desc: 'Warm amber gold — core accent',               swatch: 'hsl(38,95%,60%)' },
          { token: '--primary-glow',     value: 'hsl(38 100% 70%)',  desc: 'Brighter amber for glows',                   swatch: 'hsl(38,100%,70%)'},
          { token: '--accent',           value: 'hsl(185 100% 50%)', desc: 'Electric cyan — data, code, links',           swatch: 'hsl(185,100%,50%)'},
          { token: '--muted',            value: 'hsl(0 0% 10%)',     desc: 'Subtle card backgrounds',                     swatch: 'hsl(0,0%,10%)'   },
          { token: '--muted-foreground', value: 'hsl(0 0% 45%)',     desc: 'De-emphasized labels and subtitles',          swatch: 'hsl(0,0%,45%)'   },
          { token: '--border',           value: 'hsl(0 0% 14%)',     desc: 'Card and divider borders',                    swatch: 'hsl(0,0%,14%)'   },
        ].map(c => (
          <div
            key={c.token}
            className="flex items-center gap-4 p-3 rounded-lg"
            style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
          >
            <div className="w-8 h-8 rounded-md shrink-0" style={{ background: c.swatch, border: '1px solid hsl(var(--border))' }} />
            <div className="min-w-0">
              <p className="font-mono text-xs font-medium" style={{ color: 'hsl(var(--foreground))' }}>{c.token}</p>
              <p className="font-mono text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{c.value} — {c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <SubTitle>Typography</SubTitle>
      <div className="space-y-4 mb-8">
        {[
          { name: 'Playfair Display',  class: 'font-display',  role: 'Hero names, section titles, dramatic headings. Serif with editorial gravitas.' },
          { name: 'Inter',             class: 'font-sans',     role: 'Body text, descriptions, general prose. Clean, legible, neutral.' },
          { name: 'JetBrains Mono',   class: 'font-mono',     role: 'Data labels, tags, code snippets, nav links. Signals "technical precision".' },
        ].map(f => (
          <div key={f.name} className="p-4 rounded-xl" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
            <div className="flex items-center gap-3 mb-1">
              <Tag color="muted">{f.class}</Tag>
              <span className="font-mono text-xs" style={{ color: 'hsl(var(--primary))' }}>{f.name}</span>
            </div>
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{f.role}</p>
          </div>
        ))}
      </div>

      <SubTitle>Utility Classes</SubTitle>
      <Prose>A set of reusable classes is defined in <Code>index.css</Code> under <Code>@layer components</Code>:</Prose>
      <div className="space-y-1">
        {[
          { cls: '.glass',              desc: 'Frosted glass panel — backdrop-blur + semi-transparent background' },
          { cls: '.glow-primary',       desc: 'Amber box-shadow glow on hover (used on primary buttons)' },
          { cls: '.text-gradient-primary', desc: 'Amber→gold CSS gradient text (hero name)' },
          { cls: '.section-label',      desc: 'Monospaced uppercase amber label used above section titles' },
          { cls: '.noise-overlay',      desc: 'Film grain SVG texture overlay for the film-like background feel' },
          { cls: '.animate-pulse-beacon', desc: 'Pulsing beacon dot over Bangladesh on the globe' },
          { cls: '.animate-beacon-ring', desc: 'Expanding ring animation for the globe marker' },
        ].map(u => (
          <div key={u.cls} className="flex items-start gap-4 py-2" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
            <Code>{u.cls}</Code>
            <span className="text-sm" style={{ color: 'hsl(var(--foreground) / 0.65)' }}>{u.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataSection() {
  return (
    <div>
      <p className="font-mono text-xs mb-4" style={{ color: 'hsl(var(--primary))' }}>// docs / data-layer</p>
      <SectionTitle>Data Layer</SectionTitle>
      <Prose>All site content lives in <Code>src/data/</Code>. Each file maps to a TypeScript interface defined in <Code>usePortfolioData.ts</Code>. Editing a JSON file is the only action needed to update any section of the site — no code changes required.</Prose>

      <InfoBox title="How to update content" accent>
        Open any file in <strong>src/data/</strong>, edit the JSON, and save. The portfolio hot-reloads instantly in development. For production, re-publish after saving.
      </InfoBox>

      <SubTitle>JSON File Reference</SubTitle>
      <div className="space-y-6">
        {[
          {
            file: 'projects.json',
            type: 'PortfolioItem[]',
            controls: 'Work Grid (type: "project")',
            fields: ['id (string)', 'title', 'subtitle', 'description', 'story', 'tags[]', 'type', 'status', 'year', 'images[]', 'links.{demo,github,paper}', 'featured (bool)', 'size ("small"|"medium"|"large")', 'metrics'],
            sample: `{
  "id": "proj-001",
  "title": "NeuralViz Dashboard",
  "subtitle": "Real-time ML model monitoring",
  "description": "Longer description of the project...",
  "story": "The story behind why you built it...",
  "tags": ["React", "Python", "FastAPI"],
  "type": "project",
  "status": "completed",
  "year": "2024",
  "images": ["https://...image1.jpg"],
  "links": { "demo": "https://...", "github": "https://...", "paper": null },
  "featured": true,
  "size": "large"
}`,
          },
          {
            file: 'data_science_works.json',
            type: 'PortfolioItem[]',
            controls: 'Work Grid (type: "data_science") — rendered as Jupyter-style cards',
            fields: ['Same as projects.json PLUS:', 'notebookType ("Jupyter Notebook"|"Python Script")', 'codeSnippet (string — shown with syntax highlighting in detail view)', 'metrics (object — key/value pairs shown as stats grid)'],
            sample: `{
  "id": "ds-001",
  "title": "Sentiment Engine",
  "type": "data_science",
  "notebookType": "Jupyter Notebook",
  "codeSnippet": "import torch\\nmodel = BERTClassifier()\\n...",
  "metrics": { "Accuracy": "94.2%", "F1 Score": "0.93" }
}`,
          },
          {
            file: 'education.json',
            type: 'EducationItem[]',
            controls: 'Life Timeline section (type badge: "education")',
            fields: ['id', 'degree', 'major', 'institution', 'location', 'coordinates.{lat,lng} ← drives globe rotation on scroll', 'period', 'startDate', 'endDate (null if ongoing)', 'gpa', 'description', 'achievements[]', 'tags[]'],
            sample: `{
  "id": "edu-001",
  "degree": "BSc in Computer Science",
  "major": "Machine Learning",
  "institution": "University of Dhaka",
  "location": "Dhaka, Bangladesh",
  "coordinates": { "lat": 23.7276, "lng": 90.3972 },
  "period": "2019–2023",
  "gpa": "3.9/4.0",
  "achievements": ["Dean's List all semesters"]
}`,
          },
          {
            file: 'experiences.json',
            type: 'ExperienceItem[]',
            controls: 'Life Timeline section (type badge: "experience")',
            fields: ['id', 'title', 'organization', 'location', 'coordinates.{lat,lng}', 'period', 'type (e.g. "Research", "Volunteer")', 'description', 'achievements[]', 'tags[]'],
            sample: null,
          },
          {
            file: 'works.json',
            type: 'WorkItem[]',
            controls: 'Life Timeline section (type badge: "work")',
            fields: ['id', 'company', 'role', 'location', 'coordinates.{lat,lng}', 'period', 'startDate', 'endDate', 'description', 'achievements[]', 'tags[]'],
            sample: null,
          },
          {
            file: 'publications.json',
            type: 'PublicationItem[]',
            controls: 'Publications section AND Work Grid (type: "publication")',
            fields: ['id', 'title', 'subtitle', 'description', 'story', 'tags[]', 'type', 'year', 'venue', 'authors[]', 'images[]', 'links.{paper,github,demo}', 'citations (number|null)', 'featured (bool)'],
            sample: null,
          },
          {
            file: 'pricing.json',
            type: 'PricingData (singleton object)',
            controls: 'Pricing section',
            fields: ['headline', 'currency', 'note', 'categories[].{id, type, description, rateHourly, rateProject, timeline, deliverables[], tags[]}'],
            sample: null,
          },
        ].map(f => (
          <div key={f.file} className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(var(--border))' }}>
            <div className="flex items-center gap-3 px-5 py-3" style={{ background: 'hsl(var(--muted))' }}>
              <span className="font-mono text-sm font-bold" style={{ color: 'hsl(var(--foreground))' }}>{f.file}</span>
              <Tag color="accent">{f.type}</Tag>
              <span className="font-mono text-xs ml-auto" style={{ color: 'hsl(var(--muted-foreground))' }}>{f.controls}</span>
            </div>
            <div className="p-5">
              <p className="font-mono text-xs mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Fields:</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {f.fields.map(field => (
                  <span key={field} className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--foreground) / 0.7)' }}>
                    {field}
                  </span>
                ))}
              </div>
              {f.sample && <CodeBlock lang="json">{f.sample}</CodeBlock>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComponentsSection() {
  return (
    <div>
      <p className="font-mono text-xs mb-4" style={{ color: 'hsl(var(--primary))' }}>// docs / components</p>
      <SectionTitle>Component Reference</SectionTitle>
      <Prose>Every UI piece is a self-contained React component. Below is the complete API for each custom component in the project.</Prose>

      {[
        {
          name: 'GlobeHero',
          file: 'src/components/GlobeHero.tsx',
          description: 'The centerpiece — a full-screen 3D interactive globe powered by react-globe.gl (Three.js). Auto-rotates, centers on Bangladesh, renders arc connections to major tech hubs, and reveals editorial hero text on top.',
          props: [
            { name: 'onScrollToWork', type: '() => void', desc: 'Callback fired when "View My Work" CTA is clicked — triggers smooth scroll to the works grid.' },
          ],
          notes: [
            'Globe is dynamically imported to avoid SSR issues.',
            'Bangladesh coordinates: { lat: 23.685, lng: 90.3563 }.',
            'Arcs connect Dhaka → Boston, Paris, Singapore.',
            'Auto-rotate speed: 0.5. Zoom and pan are disabled.',
            'Globe fades in with opacity transition once the WebGL canvas is ready.',
            'A pulsing beacon (bottom-right) confirms the globe is live.',
          ],
        },
        {
          name: 'BentoGrid',
          file: 'src/components/BentoGrid.tsx',
          description: 'The main content grid. Renders all portfolio items in a CSS grid with Framer Motion layout animations. Contains the tag filter bar above it.',
          props: [
            { name: 'items', type: 'PortfolioItem[]', desc: 'All portfolio items from usePortfolioData().allPortfolioItems.' },
            { name: 'allTags', type: 'string[]', desc: 'Deduplicated, sorted tag list for the filter bar.' },
          ],
          notes: [
            'Filtering is local state — no prop drilling needed.',
            'Priority tags (React, Python, etc.) are shown first; remaining tags fill in.',
            'Grid: grid-cols-3 on desktop, 1 column on mobile.',
            'Uses Framer Motion LayoutGroup + AnimatePresence for smooth reorder on filter change.',
          ],
        },
        {
          name: 'ProjectCard',
          file: 'src/components/ProjectCard.tsx',
          description: 'An individual card in the bento grid. Renders differently based on item.type — "data_science" items get a Jupyter/VS Code window chrome treatment. All cards have a mouse-parallax tilt effect.',
          props: [
            { name: 'item', type: 'PortfolioItem', desc: 'The portfolio item to render.' },
            { name: 'index', type: 'number', desc: 'Position in grid — used for staggered entry delay.' },
            { name: 'onClick', type: '() => void', desc: 'Opens the DetailOverlay for this item.' },
          ],
          notes: [
            'size field ("small"|"medium"|"large") maps to CSS grid column/row span.',
            'DS cards show a green "●" active status bar and notebookType label.',
            'Featured cards get an amber "Featured" badge.',
            'Hover state: card lifts toward cursor via rotateX/rotateY motion values.',
          ],
        },
        {
          name: 'DetailOverlay',
          file: 'src/components/DetailOverlay.tsx',
          description: 'Full-screen immersive detail view. Opens with a slide-up animation. Shows image gallery, Markdown-rendered description, story section, tech tags, and live links. DS items also render a syntax-highlighted code block.',
          props: [
            { name: 'item', type: 'PortfolioItem | null', desc: 'The item to display. null means closed.' },
            { name: 'onClose', type: '() => void', desc: 'Triggered by Escape key or the × button.' },
          ],
          notes: [
            'Traps scroll (body overflow:hidden) while open.',
            'Listens for Escape keydown to close.',
            'Markdown rendered via react-markdown.',
            'Code snippets highlighted via react-syntax-highlighter (oneDark theme).',
            'Links (Demo, GitHub, Paper) rendered as MagneticButtons.',
          ],
        },
        {
          name: 'LifeTimeline',
          file: 'src/components/LifeTimeline.tsx',
          description: 'Vertical connected timeline visualizing the merged education + work + experience history. Each node entry-animates on scroll.',
          props: [
            { name: 'items', type: 'TimelineItem[]', desc: 'Chronologically sorted, merged from education.json, works.json, experiences.json.' },
          ],
          notes: [
            'Type badges: "education" (amber), "work" (cyan), "experience" (muted).',
            'Each item shows: role, organization, period, location, description, achievements list, and tags.',
            'Entry animation: fade-up with staggered delay per item.',
            'Coordinates stored in each item power the future globe-scroll-link feature.',
          ],
        },
        {
          name: 'PublicationsSection',
          file: 'src/components/PublicationsSection.tsx',
          description: 'Grid of academic paper cards. Featured publications render larger. Each card shows the venue badge, citation count, authors list, and a hover-reveal "story" section.',
          props: [
            { name: 'publications', type: 'PublicationItem[]', desc: 'From usePortfolioData().publications.' },
          ],
          notes: [
            'Eye cursor is activated when hovering publication cards.',
            'Citation count rendered with a "◎ N citations" badge.',
            'Venue shown as a monospaced pill (e.g. "NeurIPS 2024").',
            '"Story" expands on hover via AnimatePresence.',
          ],
        },
        {
          name: 'PricingSection',
          file: 'src/components/PricingSection.tsx',
          description: 'Freelance service tier cards derived from pricing.json. Each card shows hourly rate, project rate, timeline estimate, and a deliverables checklist.',
          props: [
            { name: 'pricing', type: 'PricingData', desc: 'The singleton pricing.json object.' },
            { name: 'onContact', type: '() => void', desc: 'Opens the ContactPanel when a "Get Quote" CTA is clicked.' },
          ],
          notes: [
            'First category card gets a "Most Popular" or featured treatment.',
            'Deliverables rendered as checkmark lists.',
            'Tags on each card (e.g. "React", "ML") are color-coded pills.',
          ],
        },
        {
          name: 'ContactPanel',
          file: 'src/components/ContactPanel.tsx',
          description: 'A glassmorphism slide-in panel from the right. Contains a validated contact form: Name, Email, Project Type (dropdown from pricing categories), Message.',
          props: [
            { name: 'isOpen', type: 'boolean', desc: 'Controls panel visibility.' },
            { name: 'onClose', type: '() => void', desc: 'Closes the panel.' },
            { name: 'pricing', type: 'PricingData', desc: 'Used to populate the Project Type dropdown options.' },
          ],
          notes: [
            'Validated with React Hook Form + Zod schema.',
            'Closes on Escape key or clicking the backdrop.',
            'Glass effect: backdrop-blur-xl + semi-transparent card background.',
          ],
        },
        {
          name: 'CustomCursor',
          file: 'src/components/CustomCursor.tsx',
          description: 'A globally mounted custom cursor that replaces the system cursor. Changes shape based on what is being hovered.',
          props: [],
          notes: [
            'Default: small amber dot + larger trailing ring.',
            'Hovering [data-cursor="code"]: renders a { } code bracket glyph.',
            'Hovering [data-cursor="eye"]: renders an ◉ eye glyph.',
            'Hovering [data-cursor="link"]: renders a ↗ arrow.',
            'Uses spring-based Framer Motion values for smooth lag.',
            'Hidden on touch devices via pointer:fine media query in CSS.',
          ],
        },
        {
          name: 'MagneticButton',
          file: 'src/components/MagneticButton.tsx',
          description: 'A wrapper that applies a physics-based magnetic effect — the children drift toward the cursor on hover and snap back on mouse leave.',
          props: [
            { name: 'children', type: 'ReactNode', desc: 'Any content to make magnetic.' },
            { name: 'className', type: 'string', desc: 'Optional wrapper class.' },
            { name: 'onClick', type: '() => void', desc: 'Optional click handler.' },
            { name: 'strength', type: 'number', desc: 'Magnetic pull strength (default: 0.35).' },
          ],
          notes: [
            'Uses useMotionValue + useSpring for smooth physics.',
            'Wraps children in a motion.div — does not impose any visual styles.',
          ],
        },
        {
          name: 'SectionWrapper',
          file: 'src/components/SectionWrapper.tsx',
          description: 'An IntersectionObserver-powered wrapper that triggers a fade-up entry animation when the section enters the viewport.',
          props: [
            { name: 'children', type: 'ReactNode', desc: 'Section content.' },
            { name: 'className', type: 'string', desc: 'Additional classes.' },
            { name: 'delay', type: 'number', desc: 'Animation delay in seconds (default: 0).' },
          ],
          notes: [
            'Triggers once — the section stays visible once animated in.',
            'Uses Framer Motion variants: hidden → visible.',
          ],
        },
        {
          name: 'NavBar',
          file: 'src/components/NavBar.tsx',
          description: 'Fixed top navigation. Transitions from transparent to a blurred glass on scroll. Active section tracking via IntersectionObserver.',
          props: [
            { name: 'onContactOpen', type: '() => void', desc: "Opens the ContactPanel when \u201cLet\u2019s Talk\u201d is clicked." },
          ],
          notes: [
            'Links: Work, Research, Journey, Pricing.',
            'Scrolled state adds backdrop-blur + border-bottom.',
            'Active section highlighted with a floating dot indicator.',
          ],
        },
      ].map(comp => (
        <div key={comp.name} className="mb-8 rounded-2xl overflow-hidden" style={{ border: '1px solid hsl(var(--border))' }}>
          <div className="px-6 py-4" style={{ background: 'hsl(var(--muted))' }}>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-display text-lg font-bold" style={{ color: 'hsl(var(--foreground))' }}>{comp.name}</span>
              <Tag color="muted">{comp.file}</Tag>
            </div>
            <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{comp.description}</p>
          </div>
          <div className="p-6 space-y-5">
            {comp.props.length > 0 && (
              <div>
                <p className="font-mono text-xs font-semibold mb-2" style={{ color: 'hsl(var(--accent))' }}>Props</p>
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid hsl(var(--border))' }}>
                  {comp.props.map((p, pi) => (
                    <div
                      key={p.name}
                      className="flex items-start gap-4 px-4 py-3"
                      style={{ background: pi % 2 === 0 ? 'hsl(var(--card))' : 'hsl(var(--muted))' }}
                    >
                      <Code>{p.name}</Code>
                      <span className="font-mono text-xs shrink-0" style={{ color: 'hsl(var(--primary))' }}>{p.type}</span>
                      <span className="text-xs" style={{ color: 'hsl(var(--foreground) / 0.6)' }}>{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="font-mono text-xs font-semibold mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>Notes</p>
              <ul className="space-y-1">
                {comp.notes.map((n, ni) => (
                  <li key={ni} className="text-sm flex items-start gap-2" style={{ color: 'hsl(var(--foreground) / 0.65)' }}>
                    <span style={{ color: 'hsl(var(--primary))' }}>·</span>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionsSection() {
  return (
    <div>
      <p className="font-mono text-xs mb-4" style={{ color: 'hsl(var(--primary))' }}>// docs / page-sections</p>
      <SectionTitle>Page Sections</SectionTitle>
      <Prose>The portfolio is a single scrollable page with six distinct sections, each with a dedicated anchor ID for smooth navigation.</Prose>
      <div className="space-y-5">
        {[
          {
            anchor: '#hero (no id)',
            section: 'Globe Hero',
            component: 'GlobeHero',
            content: "Full-screen 3D globe, editorial headline, role subtitle, and two CTAs (View Work / Let\u2019s Talk).",
            details: 'The globe auto-rotates with a 2.2× altitude view. Bangladesh is highlighted with a pulsing amber beacon. Three animated arcs connect to Boston, Paris, and Singapore. A scroll indicator pulses at the bottom center.',
          },
          {
            anchor: '#work',
            section: 'The Work',
            component: 'BentoGrid + ProjectCard',
            content: 'All portfolio items from projects, demos, data science works, WordPress works, and publications in a filtered bento grid.',
            details: 'Tag filter bar at the top lets users narrow the grid. Clicking any card opens a full-screen DetailOverlay. DS cards have Jupyter notebook styling. Grid uses CSS auto-rows of 280px.',
          },
          {
            anchor: '#research',
            section: 'Research',
            component: 'PublicationsSection',
            content: 'Academic publications with venue badges, citation counts, author lists, and story-behind-the-work hover reveals.',
            details: 'Featured publications render with larger cards. The eye cursor variant is activated on hover. Clicking opens the DetailOverlay where links to the paper, GitHub, and live demo are shown.',
          },
          {
            anchor: '#journey',
            section: 'The Journey',
            component: 'LifeTimeline',
            content: 'Vertical timeline of education, employment, and experience history, sorted chronologically (newest first).',
            details: 'Three timeline entry types: amber "education" badge, cyan "work" badge, muted "experience" badge. Each node shows role/degree, organization, period, location, achievements, and skill tags. Entries animate in as the user scrolls.',
          },
          {
            anchor: '#pricing',
            section: 'Pricing',
            component: 'PricingSection',
            content: 'Freelance service tiers with hourly rates, project ranges, timelines, and deliverable checklists.',
            details: 'Derived entirely from pricing.json. "Get Quote" buttons open the ContactPanel pre-populated with the selected service type.',
          },
          {
            anchor: 'Footer',
            section: 'Footer',
            component: 'Inline in Index.tsx',
            content: "Name, location status, nav links, and a \u201cLet\u2019s Work Together\u201d CTA.",
            details: "Copyright year is dynamically generated (new Date().getFullYear()). Two floating action buttons (Let\u2019s Talk, Download CV) are fixed to the bottom-right across the whole page.",
          },
        ].map(s => (
          <div key={s.anchor} className="rounded-xl p-5" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-display text-base font-bold" style={{ color: 'hsl(var(--foreground))' }}>{s.section}</span>
              <Tag color="primary">{s.anchor}</Tag>
              <Tag color="muted">{s.component}</Tag>
            </div>
            <p className="text-sm mb-2" style={{ color: 'hsl(var(--foreground) / 0.75)' }}>{s.content}</p>
            <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{s.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InteractionsSection() {
  return (
    <div>
      <p className="font-mono text-xs mb-4" style={{ color: 'hsl(var(--primary))' }}>// docs / micro-interactions</p>
      <SectionTitle>Micro-Interactions</SectionTitle>
      <Prose>Interactivity is applied at every level — from the viewport-entry animations to physics-based cursor effects. Every interaction has a deliberate purpose.</Prose>

      <div className="space-y-4">
        {[
          {
            name: 'Film Grain Overlay',
            trigger: 'Always on',
            implementation: '.noise-overlay in index.css — an SVG feTurbulence filter pseudo-element behind all content.',
            purpose: 'Makes the digital feel tactile and cinematic. Reduces the "clean app" feeling that every portfolio has.',
          },
          {
            name: 'Custom Morphing Cursor',
            trigger: 'data-cursor attribute on hovered elements',
            implementation: 'CustomCursor.tsx — spring-animated position + shape. Default dot, { } over DS cards, ◉ over publications, ↗ over links.',
            purpose: 'Communicates context and content type without a tooltip. The cursor becomes part of the UI.',
          },
          {
            name: 'Magnetic Buttons',
            trigger: 'Mouse move over MagneticButton wrapper',
            implementation: 'MagneticButton.tsx — useMotionValue + useSpring for x/y drift toward cursor center.',
            purpose: 'Key CTAs feel "alive" and attract attention. Increases perceived quality of the interface.',
          },
          {
            name: 'Card Parallax Tilt',
            trigger: 'Mouse move over ProjectCard',
            implementation: 'ProjectCard.tsx — rotateX/rotateY motion values updated on mousemove, reset on mouseleave.',
            purpose: 'Adds physical depth to flat cards. Makes the grid feel explorable, not static.',
          },
          {
            name: 'Section Entry Animations',
            trigger: 'Section enters viewport (IntersectionObserver)',
            implementation: 'SectionWrapper.tsx — opacity + translateY Framer Motion variants, triggered once.',
            purpose: 'Content reveals progressively rather than loading all at once. Creates a sense of discovery.',
          },
          {
            name: 'Tag Filter Reorder',
            trigger: 'Click a tag pill in the Work section',
            implementation: 'BentoGrid.tsx — Framer Motion LayoutGroup + AnimatePresence mode="popLayout". Items animate into new positions.',
            purpose: 'Filtering feels physical, not instant. Users can follow their clicked items as the grid reshuffles.',
          },
          {
            name: 'Globe Arc Animations',
            trigger: 'Always on (globe loaded)',
            implementation: 'GlobeHero.tsx — arcDashAnimateTime: 3000ms dashed arcs circling the globe.',
            purpose: 'Visualizes global reach. Each arc connects Dhaka to a real tech city (Boston, Paris, Singapore).',
          },
          {
            name: 'Scroll Line Indicator',
            trigger: 'Always visible on hero until scrolled',
            implementation: 'GlobeHero.tsx — motion.div with y: [0, 8, 0] repeat infinite easeInOut animation.',
            purpose: 'Clear affordance to scroll without using a clichéd "↓" arrow.',
          },
          {
            name: 'DetailOverlay Entry',
            trigger: 'Click any portfolio card',
            implementation: 'DetailOverlay.tsx — AnimatePresence with y: "100%" → y: 0 slide-up + opacity transition.',
            purpose: 'Full-screen entry feels like the work "expands" to fill the screen — more immersive than a modal.',
          },
          {
            name: 'NavBar Glass Transition',
            trigger: 'Page scroll past ~50px',
            implementation: 'NavBar.tsx — window scroll listener toggles scrolled state → adds backdrop-blur + border.',
            purpose: 'Clean on the hero where the globe is visible; legible everywhere else without blocking content.',
          },
        ].map(i => (
          <div key={i.name} className="p-4 rounded-xl" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="min-w-[180px]">
                <p className="font-mono text-sm font-bold mb-0.5" style={{ color: 'hsl(var(--foreground))' }}>{i.name}</p>
                <Tag color="muted">{i.trigger}</Tag>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs mb-1 font-mono" style={{ color: 'hsl(var(--muted-foreground))' }}>Implementation: {i.implementation}</p>
                <p className="text-xs" style={{ color: 'hsl(var(--accent))' }}>Purpose: {i.purpose}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalizeSection() {
  return (
    <div>
      <p className="font-mono text-xs mb-4" style={{ color: 'hsl(var(--primary))' }}>// docs / personalizing</p>
      <SectionTitle>How to Personalize</SectionTitle>
      <Prose>The portfolio is designed so that a non-developer can update 90% of the content by editing JSON files alone. The following table maps every visible piece of content to its source.</Prose>

      <InfoBox title="Quick Start — Replace these 5 things first" accent>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Open <strong>src/components/GlobeHero.tsx</strong> → change "Your Name" on lines 111–112</li>
          <li>Open <strong>src/pages/Index.tsx</strong> → change "Your Name" on line 79 (footer)</li>
          <li>Replace all entries in <strong>src/data/projects.json</strong> with your real projects</li>
          <li>Replace all entries in <strong>src/data/education.json</strong> and <strong>works.json</strong></li>
          <li>Update <strong>src/data/pricing.json</strong> with your actual rates</li>
        </ol>
      </InfoBox>

      <SubTitle>Content Map</SubTitle>
      <div className="space-y-1 mb-8">
        {[
          { content: 'Hero name "Your Name"',        source: 'src/components/GlobeHero.tsx line ~111' },
          { content: 'Hero subtitle (role line)',     source: 'src/components/GlobeHero.tsx line ~101' },
          { content: 'Hero manifesto paragraph',     source: 'src/components/GlobeHero.tsx line ~119' },
          { content: 'Globe home location',          source: 'GlobeHero.tsx BANGLADESH const (lat/lng)' },
          { content: 'Globe arc destinations',       source: 'GlobeHero.tsx arcs[] array (lat/lng pairs)' },
          { content: 'Projects grid',                source: 'src/data/projects.json' },
          { content: 'Demo/prototype cards',         source: 'src/data/demo_projects.json' },
          { content: 'Data science notebook cards',  source: 'src/data/data_science_works.json' },
          { content: 'WordPress/CMS cards',          source: 'src/data/wordpress_works.json' },
          { content: 'Publications section',         source: 'src/data/publications.json' },
          { content: 'Timeline (education entries)', source: 'src/data/education.json' },
          { content: 'Timeline (work entries)',      source: 'src/data/works.json' },
          { content: 'Timeline (other experience)',  source: 'src/data/experiences.json' },
          { content: 'Pricing cards',                source: 'src/data/pricing.json' },
          { content: 'Contact form project types',   source: 'src/data/pricing.json (categories[].type)' },
          { content: 'Footer name',                  source: 'src/pages/Index.tsx line ~79' },
          { content: 'Footer location tagline',      source: 'src/pages/Index.tsx line ~81' },
          { content: 'Primary accent color',         source: 'src/index.css --primary (HSL)' },
          { content: 'Background color',             source: 'src/index.css --background (HSL)' },
          { content: 'Display font',                 source: 'src/index.css @import + --font-display' },
        ].map(r => (
          <Row key={r.content} label={r.source} value={r.content} />
        ))}
      </div>

      <SubTitle>Adding a New Project</SubTitle>
      <Prose>Copy an existing entry from <Code>projects.json</Code>, give it a unique <Code>id</Code>, fill in the fields, and save. The card will appear in the grid immediately. Set <Code>"featured": true</Code> and <Code>"size": "large"</Code> to make it prominent.</Prose>

      <SubTitle>Adding a Code Snippet to a DS Card</SubTitle>
      <CodeBlock lang="json">{`{
  "id": "ds-new",
  "type": "data_science",
  "title": "My New Model",
  "codeSnippet": "import torch\\n\\nclass MyModel(torch.nn.Module):\\n    def __init__(self):\\n        super().__init__()\\n        self.layer = torch.nn.Linear(128, 64)",
  "notebookType": "Jupyter Notebook",
  "metrics": {
    "Accuracy": "91.4%",
    "Params": "2.3M"
  }
}`}</CodeBlock>
      <Prose>The <Code>codeSnippet</Code> value will be syntax-highlighted inside the DetailOverlay when the user clicks the card.</Prose>

      <SubTitle>Changing the Globe's Home Country</SubTitle>
      <CodeBlock lang="typescript">{`// src/components/GlobeHero.tsx — line 5
const BANGLADESH = { lat: 23.685, lng: 90.3563 };
// Change to your own country's coordinates, e.g.:
const HOME = { lat: 51.5074, lng: -0.1278 }; // London`}</CodeBlock>

      <SubTitle>Changing the Primary Color</SubTitle>
      <CodeBlock lang="css">{`/* src/index.css — inside :root */
--primary: 38 95% 60%;       /* amber gold — change to your preference */
--primary-glow: 38 100% 70%; /* must be lighter version of same hue */
--primary-dim: 38 70% 40%;   /* must be darker version */

/* Example: change to deep violet */
--primary: 270 80% 65%;
--primary-glow: 270 90% 75%;
--primary-dim: 270 60% 45%;`}</CodeBlock>
    </div>
  );
}

// ─── Main Docs Page ───────────────────────────────────────────────────────────
export default function Docs() {
  const [active, setActive] = useState('overview');

  const sectionComponents: Record<string, React.ReactNode> = {
    overview:     <OverviewSection />,
    architecture: <ArchitectureSection />,
    design:       <DesignSection />,
    data:         <DataSection />,
    components:   <ComponentsSection />,
    sections:     <SectionsSection />,
    interactions: <InteractionsSection />,
    personalize:  <PersonalizeSection />,
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ cursor: 'auto' }}>
      {/* ── Top bar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'hsl(var(--background) / 0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid hsl(var(--border))' }}
      >
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 group">
            <span className="font-mono text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>←</span>
            <span className="font-mono text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Portfolio</span>
          </a>
          <span className="font-mono text-xs" style={{ color: 'hsl(var(--border))' }}>/</span>
          <span className="font-mono text-xs font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Documentation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(var(--primary))' }} />
          <span className="font-mono text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>v1.0.0</span>
        </div>
      </header>

      <div className="flex pt-[57px] min-h-screen">
        {/* ── Sidebar ── */}
        <aside
          className="hidden md:flex flex-col w-60 shrink-0 fixed top-[57px] bottom-0 overflow-y-auto py-8 px-4"
          style={{ borderRight: '1px solid hsl(var(--border))' }}
        >
          <p className="font-mono text-xs font-semibold mb-4 px-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
            CONTENTS
          </p>
          <nav className="space-y-0.5">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150"
                style={{
                  background: active === s.id ? 'hsl(var(--primary) / 0.12)' : 'transparent',
                  color: active === s.id ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  borderLeft: active === s.id ? '2px solid hsl(var(--primary))' : '2px solid transparent',
                }}
              >
                <span className="font-mono text-base leading-none">{s.icon}</span>
                <span className="font-mono text-xs font-medium">{s.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <div
              className="p-3 rounded-xl"
              style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
            >
              <p className="font-mono text-xs mb-1" style={{ color: 'hsl(var(--primary))' }}>Data-Driven</p>
              <p className="font-mono text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Edit JSON → site updates instantly
              </p>
            </div>
          </div>
        </aside>

        {/* ── Mobile nav ── */}
        <div
          className="md:hidden flex overflow-x-auto gap-2 px-4 py-3 fixed top-[57px] left-0 right-0 z-40"
          style={{ background: 'hsl(var(--background) / 0.95)', borderBottom: '1px solid hsl(var(--border))' }}
        >
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs shrink-0 transition-all"
              style={{
                background: active === s.id ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                color: active === s.id ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
              }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* ── Main content ── */}
        <main className="flex-1 md:ml-60 px-6 md:px-12 lg:px-16 py-12 md:py-16 mt-10 md:mt-0 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {sectionComponents[active]}
            </motion.div>
          </AnimatePresence>

          {/* Section navigation at bottom */}
          <div className="flex items-center justify-between mt-16 pt-8" style={{ borderTop: '1px solid hsl(var(--border))' }}>
            {(() => {
              const idx = SECTIONS.findIndex(s => s.id === active);
              const prev = idx > 0 ? SECTIONS[idx - 1] : null;
              const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;
              return (
                <>
                  {prev ? (
                    <button
                      onClick={() => setActive(prev.id)}
                      className="flex items-center gap-2 font-mono text-xs transition-all"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                    >
                      ← {prev.label}
                    </button>
                  ) : <div />}
                  {next && (
                    <button
                      onClick={() => setActive(next.id)}
                      className="flex items-center gap-2 font-mono text-xs transition-all"
                      style={{ color: 'hsl(var(--primary))' }}
                    >
                      {next.label} →
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </main>
      </div>
    </div>
  );
}
