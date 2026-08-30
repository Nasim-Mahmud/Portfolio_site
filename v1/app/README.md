# Nasim Mahmud Mishu — Portfolio

Personal academic portfolio website. Pure **HTML5 + CSS3 + TypeScript** (compiled to
vanilla JavaScript) — no frameworks, no libraries, no build system, no backend.
The only external resource is the JetBrains Mono font from Google Fonts.

## Project structure

```
.
├── index.html
├── css/
│   └── style.css
├── scripts/
│   ├── main.ts          # TypeScript source (strict mode)
│   └── main.js          # compiled output — the file index.html loads
├── assets/
│   └── img/
│       ├── profile.svg              # placeholder — circular portrait
│       ├── project-niro-bot.svg     # placeholder — 640 × 320
│       ├── project-hex.svg          # placeholder — 640 × 320
│       ├── project-aoaver.svg       # placeholder — 640 × 320
│       ├── project-gesture.svg      # placeholder — 640 × 320
│       ├── project-shouhardo.svg    # placeholder — 640 × 320
│       └── favicon.svg              # "N/" monogram
└── README.md
```

## Deploying to GitHub Pages

**Option A — project site:**

1. Push this folder's contents to a GitHub repository (e.g. `portfolio`).
2. In the repo: **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Choose the `main` branch and the `/ (root)` folder, then save.
4. The site goes live at `https://<username>.github.io/<repo>/`.

**Option B — user site:**

1. Create a repository named `<username>.github.io`.
2. Push these files to its root. The site is served at `https://<username>.github.io/`.

All paths are relative, so the site also works when opened directly from disk
(`file://…/index.html`).

## Replacing the placeholder images

Every image is an intentional placeholder SVG (warm-gray, dashed border) showing
which file to drop in:

- **Profile photo** — replace `assets/img/profile.svg` with a square portrait named
  `profile.jpg` (or keep the name `profile.svg`), then update the two
  `src="assets/img/profile.svg"` references in `index.html` (hero photo and the
  fullscreen overlay image). Clicking the photo opens it fullscreen.
- **Project images** — replace the five `project-*.svg` files with real screenshots
  (ideally 640 × 320 or any 2:1 ratio) and update the corresponding `src`
  attributes in the projects section of `index.html`.
- **Favicon** — replace `assets/img/favicon.svg` if desired.

## CV (cv.pdf)

The hero links to `cv.pdf`. Put your CV file named **`cv.pdf` in the repository
root** (next to `index.html`) and the link will work as-is.

## Editing content

All content lives in `index.html` as plain, commented HTML — sections are marked
`<!-- ===== SECTION NAME ===== -->`. Colors, spacing, and typography are CSS custom
properties at the top of `css/style.css` (`:root` and `html[data-theme="dark"]`).

### Project cards and the detail modal

The projects grid in `index.html` is the summary view: each card carries a
`data-project="..."` attribute (e.g. `niro-bot`, `project-hex`). Clicking or
activating a card (Enter/Space) opens a modal with the full write-up. That
modal content does **not** live in the HTML — it is rendered from the
`PROJECT_DETAILS` map at the top of `scripts/main.ts`, a typed
`Record<string, ProjectDetail>` keyed by the same `data-project` values. Each
entry holds `title`, `meta`, `summary`, `highlights[]`, `tech[]`, `status`,
and `links[]`. To edit a project's details, change its entry in that map and
recompile (see below); the card grid needs no changes. To add a new project,
add a card with a fresh `data-project` key in `index.html` plus a matching
entry in `PROJECT_DETAILS`.

## Recompiling the TypeScript (OPTIONAL)

The site ships with the compiled `scripts/main.js` and **does not need any build
step**. Only if you edit `scripts/main.ts`, recompile it with:

```sh
tsc scripts/main.ts --target ES2019 --strict --outFile scripts/main.js
```

(Requires any TypeScript 5.x install: `npm install -g typescript`. This is local
tooling only — nothing npm-related is part of the website.)

`main.js` provides: theme toggle (persisted in `localStorage`), mobile hamburger
menu, scroll-spy navigation, reveal-on-scroll animations (disabled under
`prefers-reduced-motion`), the animated fullscreen profile-photo overlay, the
project detail modal (backdrop/ESC/close-button dismissal, focus returned to the
originating card), and the automatic footer year.
