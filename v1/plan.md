# Plan — Portfolio Refinement (Round 2)

Site lives at /mnt/agents/output/app/ (v1 approved and delivered). User requested 4 refinements:

## Stage R1 — Spec (this file + inline brief)
Acceptance criteria:
1. **Zero em dashes**: `grep -c "—" index.html scripts/main.ts` must be 0. Date ranges → hyphens ("Oct 2024 - Present"); title separators → "·" or ":"; prose → restructure with commas/colons. Also avoid en dashes in any new copy.
2. **Copy trim**: authentic, plain, human tone. No hype words, no exclamation marks, no buzzword stacking.
3. **Project modal**: click any project card → full overlay modal with deeper details (full description, highlights, tech tags, status, links). Dismiss via backdrop click, ESC, close button. Body scroll locked. Smooth open/close animation, respects prefers-reduced-motion. Keyboard accessible (focusable cards, Enter/Space opens, focus returns to card on close).
4. **Profile image**: smooth hover zoom; click opens fullscreen viewer with zoom-in animation (refine existing overlay).
5. **Polish**: link underline slide animation, focus-visible rings, card image zoom on hover, refined heading letter-spacing, subtle nav active indicator. Keep minimal terminal aesthetic.

## Stage R2 — Build (coder subagent, foreground)
- Edit /mnt/agents/output/app/ in place: index.html, css/style.css, scripts/main.ts; recompile to main.js (tsc strict, ES2019, --outFile).
- Project detail content sourced from /mnt/agents/upload/ CV + old site files.
- Update README.md (modal + asset notes).

## Stage R3 — Verify & deliver (orchestrator)
- grep checks (no "—", no hype copy), screenshots: light, dark, modal open, profile overlay.
- Rebuild zip + website_version_manager build_version.
