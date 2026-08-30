# Plan — Portfolio Refinement (Round 3): Multi-page + Typography

Site: /mnt/agents/output/app/ (v2 delivered). User requests:
1. Split single long page into dedicated pages per major topic.
2. Smooth, professional page-transition animations between pages.
3. Larger fonts + improved typography/spacing/readability; stay responsive & balanced.

## Stage R1 — Architecture spec
Pages (static .html, GitHub Pages-safe, relative paths):
- `index.html` — hero, about, skills summary, news
- `research.html` — research interests
- `experience.html` — experience timeline + education
- `projects.html` — project grid + detail modals
- `publications.html` — publications
- `contact.html` — contact card + links
Nav: logo `~/nasim-mahmud` → index; links: research, experience, projects, publications, contact. Active page via aria-current (no more scroll-spy).

Transitions (vanilla, no libs): fade+translate enter on load; intercept internal .html link clicks → animate out → navigate; pageshow/bfcache handling; reduced-motion = instant.

Typography: base 14px → 16px (15px mobile), line-height ~1.8, fluid headings via clamp(), larger section padding, text column ~780px. Keep JetBrains Mono + warm palette + maroon accent. Keep zero em dashes, plain copy.

## Stage R2 — Build (coder subagent, foreground)
Refactor in place; shared css/style.css + scripts/main.ts→main.js (tsc strict). All v2 features preserved (theme toggle persistence across pages, mobile nav, project modal on projects.html, profile zoom on index.html, focus-visible, underline animations, back-to-top). README updated for multi-page structure.

## Stage R3 — Verify & deliver (orchestrator)
grep "—" = 0 everywhere; screenshots of pages (light/dark); zip rebuild; build_version.
