# SPEC.md — Portfolio Website for Nasim Mahmud Mishu (FINAL BUILD)

## Mission
Build the final, production-ready static portfolio website based on the APPROVED design mockup.
The user approved the mockup with no changes — visual design fidelity to the mockup is mandatory.

## Hard constraints (user requirements)
- ONLY HTML5 + CSS3 + TypeScript + Vanilla JavaScript. NO frameworks, NO libraries, NO jQuery, NO Tailwind.
- NO npm/Node build system in the deliverable. NO backend/database/server runtime.
- Must work on GitHub Pages by simply uploading files. ALL paths relative. Must also work from file://.
- Only permitted external resource: Google Fonts (JetBrains Mono). Nothing else from CDNs.
- Font: **JetBrains Mono** for ALL text (weights 300–700 + italic).
- Minimalistic, professional, not flashy. Academic robotics-researcher audience.
- TypeScript source is REQUIRED and must be real, typed TypeScript (interfaces, typed functions). Ship BOTH `scripts/main.ts` (source) and `scripts/main.js` (compiled with tsc, target ES2019, no modules — plain script). The HTML loads ONLY the compiled `main.js`. Compilation happens now in the sandbox (install typescript via npm in sandbox if needed — that is tooling, not part of the deliverable).

## Output location
Build directly in: `/mnt/agents/output/app/` (wipe existing mockup index.html there first).

## Project structure (exact)
```
app/
├── index.html
├── css/
│   └── style.css
├── scripts/
│   ├── main.ts          # typed TypeScript source
│   └── main.js          # tsc-compiled output (loaded by index.html)
├── assets/
│   └── img/
│       ├── profile.svg              # placeholder: circular portrait
│       ├── project-niro-bot.svg     # placeholder 16:8
│       ├── project-hex.svg          # placeholder 16:8
│       ├── project-aoaver.svg       # placeholder 16:8
│       ├── project-gesture.svg      # placeholder 16:8
│       ├── project-shouhardo.svg    # placeholder 16:8
│       └── favicon.svg              # simple "N/" monogram, maroon on transparent
└── README.md
```
Placeholder SVGs: light warm-gray (#f0eee9) background, dashed border, centered JetBrains-Mono-style label like `[ replace: profile.jpg ]` and pixel dimensions. They must look intentional inside the design, not broken.

## Design spec (from approved mockup at /mnt/agents/output/mockup/index.html — read it first)
- Tokens: light `--bg:#faf9f6`, `--ink:#1c1917`, accent maroon `#8a3033`, borders `#e4e0d9`; dark theme `--bg:#161513`, `--ink:#e7e3dd`, accent `#d08a8a`. CSS custom properties on `:root` + `html[data-theme="dark"]`.
- Sticky nav: `~/nasim-mahmud` left; section links; theme toggle button `[ light ]`/`[ dark ]` right. Mobile: hamburger menu (no hiding links).
- Hero: `$ whoami` prompt line, name, role (Research Assistant — NIRO Lab, NSU ECE, Dhaka), research keyword pills, `↳` contact links (email, github, linkedin, cv.pdf), circular profile photo on the right.
- Sections numbered as code comments: `// 01 about` … `// 09 contact`, accent-colored headings.
- Experience = vertical timeline (dots + rail, accent dots).
- Projects = 2-col card grid (1-col mobile), 16:8 image top, title/meta/desc/`→ tech` line; hover: accent border + slight lift.
- Publications = numbered list `[1]…[4]` with venue + DOI/ISBN links.
- News = `[Mon YYYY]` date column entries. Education, Skills (key/value rows), Contact footer card.
- Fully responsive (≤720px breakpoints as in mockup). Subtle `::selection` accent. Smooth scrolling with `scroll-margin-top` for anchors under the sticky nav.

## JS/TS behavior (main.ts → main.js)
1. Theme toggle: button, persisted in localStorage (`portfolio-theme`), initial value from localStorage else `prefers-color-scheme`. Update button label + `<meta name="theme-color">`.
2. Mobile nav: hamburger toggles a dropdown menu; closes on link click / outside click / Escape.
3. Scroll-spy: IntersectionObserver highlights the active nav link (accent color).
4. Reveal-on-scroll: sections fade/slide in via IntersectionObserver (`@media (prefers-reduced-motion: reduce)` disables all animation).
5. Profile photo click → fullscreen overlay (like the old site); close on click/Escape.
6. Footer year auto-updates (`© <currentYear>`).
All typed (interfaces for observer options, event handlers typed, no `any`).

## Content (source of truth: /mnt/agents/upload/ files + mockup)
Use mockup text verbatim where present; additionally:
- **About**: 4 paragraphs from old site overview (researcher intro; NIRO RA swarm work; previous part-time RA on resource-efficient visual DRL; NSU Ignite founding member; seeking MS/PhD collaboration).
- **Experience** (4): RA @ NIRO Lab (Oct 2024–Present, supervisor Dr. Shahnewaz Siddique — link https://ece.northsouth.edu/people/dr-shahnewaz-siddique/); Teaching Assistant (Jan 2025–Present; courses EE494/CSE495A + CSE543 Intro to Robotics); Part-time RA (Dec 2023–Jun 2024, visual DRL); Founding Member NSU Ignite (Sep 2018–Feb 2022).
- **Projects** (5 cards): NIRO Educational Bot; Project Hex; AOAVER; Hand Gesture Recognition (CSE299); Shouhardo (CSE498R). Descriptions/tech from CV + mockup.
- **Publications** (4): ICCIT 2025 hand-gesture paper (DOI link → https://ieeexplore.ieee.org/document/11056435 if uncertain use "#" with label "doi ↗" — better: link to https://doi.org/10.1109/ICCIT65305.2025.11056435 only if verified, else "#"); Alpha-N-V2 (Vietnam J. Computer Science 2020, doi:10.1142/S2196888820500219); Alpha-N (ACIIDS 2020, doi:10.1007/978-3-030-41964-6_18); Healthcare COVID-19 (Asian CHI 2022, ISBN 978-0-9942763-2-2, drive link from publications.html).
- **News** (2): [Nov 2025] NSU AI, IoT & Robotics Day 2025; [Jul 2025] top-ranked Robotics Demo at BEAR Summit & National Semiconductor Symposium 2025 (link https://v0-bangladesh-bear-summit.vercel.app/).
- **Education**: B.Sc. CSE, North South University, CGPA 3.39/4.00, 2017–2021, thesis AOAVER; relevant coursework: ML, AI, Robotics, Computer Vision.
- **Skills** rows: robotics / ai-ml / programming / hardware / tools (per mockup).
- **Contact footer**: email nasimmahmud1301@gmail.com, github.com/Nasim-Mahmud, linkedin.com/in/nasim-mahmud, open to MS/PhD + collaborations. Copyright line: `© <year> Nasim Mahmud Mishu · built with html + css + ts · set in JetBrains Mono`.
- SEO/social meta: title, description, og:title/og:type/og:description.

## README.md (deliverable doc)
- What this is; how to deploy on GitHub Pages (push to repo → Settings → Pages → deploy from branch root; or username.github.io repo).
- How to replace placeholder images (drop same-named files in assets/img/ or edit src), profile photo note, CV pdf note (put `cv.pdf` at repo root).
- How to edit content; how to recompile TS optionally (`tsc scripts/main.ts --target ES2019 --outFile scripts/main.js`) — clearly marked OPTIONAL since compiled JS is shipped.

## Validation checklist (coder must run before finishing)
- `tsc` compiles with zero errors, strict mode.
- All paths relative; grep confirms no CDN other than fonts.googleapis.com/fonts.gstatic.com.
- index.html passes basic sanity (no unclosed tags) — open via headless check or careful review.
- Structure matches exactly the layout above.
