/* ==========================================================================
   Nasim Mahmud Mishu · portfolio
   main.ts · typed TypeScript source (strict mode, no external deps)

   Compile (the compiled main.js is what the site loads):
     tsc scripts/main.ts --target ES2019 --strict --outFile scripts/main.js
   ========================================================================== */

/* ---------------------------------------------------------------- types -- */

type Theme = "light" | "dark";

interface ThemeMetaColors {
  light: string;
  dark: string;
}

interface ObserverConfig {
  root: Element | Document | null;
  rootMargin: string;
  threshold: number | number[];
}

interface ScrollSpyEntry {
  id: string;
  link: HTMLAnchorElement;
}

interface ProjectLink {
  label: string;
  url: string;
}

interface ProjectDetail {
  id: string;
  title: string;
  meta: string;
  summary: string;
  highlights: string[];
  tech: string[];
  status: string;
  links: ProjectLink[];
}

/* ------------------------------------------------------------ constants -- */

const THEME_STORAGE_KEY: string = "portfolio-theme";

const THEME_META_COLORS: ThemeMetaColors = {
  light: "#faf9f6",
  dark: "#161513",
};

const SCROLL_SPY_OPTIONS: ObserverConfig = {
  root: null,
  rootMargin: "-30% 0px -60% 0px",
  threshold: 0,
};

const REVEAL_OPTIONS: ObserverConfig = {
  root: null,
  rootMargin: "0px 0px -8% 0px",
  threshold: 0.05,
};

/* matches the .2s transitions in style.css */
const ANIMATION_MS: number = 200;

/* --------------------------------------------------- project detail data --
   Content for the project modal lives here, keyed by the data-project
   attribute on each card in index.html. Edit a project's text, highlights,
   tech tags, status, or links below; the card grid itself stays untouched. */

const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  "niro-bot": {
    id: "niro-bot",
    title: "NIRO Educational Bot",
    meta: "NIRO Lab · Oct 2024 - Present",
    summary:
      "An educational robot built at the NSU Intelligent Robotics (NIRO) Lab to support hands-on learning and research. " +
      "A Raspberry Pi and an Arduino share the processing over WiFi, on a 3D-printed chassis with a custom PCB and a " +
      "differential drive system. The design leaves room for hardware extensions such as LiDAR and depth cameras.",
    highlights: [
      "Gyroscope, IR sensors, motors, and WiFi integrated with Raspberry Pi and Arduino",
      "Custom 3D-printed chassis and PCB with a differential drive system",
      "Hardware extensions for LiDAR and depth cameras",
      "Shown as a top-ranked robotics demo at BEAR Summit 2025, Dhaka",
    ],
    tech: ["Raspberry Pi", "Arduino", "3D Printing", "PCB Design"],
    status: "ongoing",
    links: [],
  },
  "project-hex": {
    id: "project-hex",
    title: "Project Hex",
    meta: "NIRO Lab · Feb 2025 - Present",
    summary:
      "A hexapod robot built for mobility on uneven terrain, where wheeled robots struggle. Six 3-DOF legs driven by " +
      "18 high-torque bus servos give it stable locomotion, with an Arduino handling real-time control. A LiPo battery " +
      "powers extended runs, and modular mounts accept a Raspberry Pi, LiDAR, and depth sensors.",
    highlights: [
      "Six legs with 3 DOF each for stability on uneven terrain",
      "18 high-torque bus servos, LiPo powered for extended operation",
      "Arduino-based real-time control",
      "Modular mounts for Raspberry Pi, LiDAR, and depth sensors",
    ],
    tech: ["Arduino", "Servo Control", "LiPo", "Modular Design"],
    status: "ongoing",
    links: [],
  },
  aoaver: {
    id: "aoaver",
    title: "AOAVER: Autonomous Obstacle Avoiding Exploring Robot",
    meta: "Capstone (CSE499) · 2021 - 2022",
    summary:
      "My B.Sc. capstone project: an autonomous search-and-rescue robot for disaster-prone areas, where sending people " +
      "in is risky. It combines obstacle avoidance and exploration algorithms with real-time perception from a LiDAR, " +
      "running ROS on Linux.",
    highlights: [
      "Obstacle avoidance and exploration algorithms for hazardous environments",
      "YDLidar X4 with Raspberry Pi 3B+ and Arduino UNO",
      "ROS on Linux for real-time perception and decision-making",
      "Completed as my undergraduate thesis project",
    ],
    tech: ["Python", "ROS", "YDLidar X4", "Raspberry Pi", "Arduino"],
    status: "completed 2022",
    links: [],
  },
  gesture: {
    id: "gesture",
    title: "Hand Gesture Recognition for Seniors & Disabled",
    meta: "Junior Design (CSE299) · Spring 2020",
    summary:
      "A low-cost assistive system for elderly and disabled users who cannot move or speak. Gestures captured by a " +
      "Pi-camera are detected with OpenCV, and a companion Android app places an emergency call when a gesture is " +
      "recognized. The work was later published at ICCIT 2025.",
    highlights: [
      "Gesture detection with OpenCV on a Raspberry Pi and Pi-camera",
      "Android app triggers emergency calls from detected gestures",
      "Firebase backend connecting the device and the app",
      "Published at ICCIT 2025",
    ],
    tech: ["Python", "OpenCV", "Raspberry Pi", "Firebase", "Android"],
    status: "completed",
    links: [{ label: "paper (doi pending)", url: "#" }],
  },
  shouhardo: {
    id: "shouhardo",
    title: "Shouhardo: Hospital Accessibility Platform",
    meta: "Directed Research (CSE498R) · Fall 2021",
    summary:
      "An HCI study and platform built during COVID-19. We interviewed 32 participants and found recurring problems: " +
      "unclear hospital information, inflated medicine prices, and difficulty finding the right doctor. We then built " +
      "a multilingual web platform with guidance, service details, and doctor availability.",
    highlights: [
      "Qualitative study with 32 participants during COVID-19",
      "Found unclear hospital information, inflated prices, and trouble finding doctors",
      "Multilingual web platform with guidance, service details, and doctor availability",
      "Published at the 6th Asian CHI Symposium 2022",
    ],
    tech: ["HTML", "CSS", "WordPress", "HCI Research"],
    status: "completed",
    links: [
      {
        label: "proceedings ↗",
        url: "https://drive.google.com/file/d/1ifFX5Vd1_dNN7jzyPAT1Wl0iYt5vI1YH/view",
      },
    ],
  },
};

/* ------------------------------------------------------- small utilities -- */

function queryRequired<T extends Element>(selector: string): T {
  const el: Element | null = document.querySelector(selector);
  if (el === null) {
    throw new Error("Required element not found: " + selector);
  }
  return el as T;
}

function safeLocalStorageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (error: unknown) {
    return null; // storage unavailable (e.g. some file:// contexts)
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch (error: unknown) {
    /* storage unavailable; theme simply will not persist */
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function el(tag: string, className: string, text: string): HTMLElement {
  const node: HTMLElement = document.createElement(tag);
  if (className !== "") {
    node.className = className;
  }
  node.textContent = text;
  return node;
}

/* Show an animated layer: remove [hidden], then add .open on the next frame. */
function showLayer(layer: HTMLElement): void {
  layer.hidden = false;
  if (prefersReducedMotion()) {
    layer.classList.add("open");
    return;
  }
  window.requestAnimationFrame(function (): void {
    window.requestAnimationFrame(function (): void {
      layer.classList.add("open");
    });
  });
}

/* Hide an animated layer: drop .open, then restore [hidden] after the fade. */
function hideLayer(layer: HTMLElement): void {
  layer.classList.remove("open");
  if (prefersReducedMotion()) {
    layer.hidden = true;
    return;
  }
  window.setTimeout(function (): void {
    if (!layer.classList.contains("open")) {
      layer.hidden = true;
    }
  }, ANIMATION_MS);
}

/* -------------------------------------------------------- 1. theme toggle -- */

function systemPreferredTheme(): Theme {
  const darkQuery: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
  return darkQuery.matches ? "dark" : "light";
}

function initialTheme(): Theme {
  const stored: string | null = safeLocalStorageGet(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return systemPreferredTheme();
}

function applyTheme(theme: Theme, toggleButton: HTMLButtonElement): void {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  toggleButton.textContent = "[ " + theme + " ]";

  const meta: HTMLMetaElement | null = document.querySelector('meta[name="theme-color"]');
  if (meta !== null) {
    meta.setAttribute("content", THEME_META_COLORS[theme]);
  }
}

function initThemeToggle(): void {
  const toggleButton: HTMLButtonElement = queryRequired<HTMLButtonElement>("#themeToggle");
  let current: Theme = initialTheme();
  applyTheme(current, toggleButton);

  toggleButton.addEventListener("click", function (event: MouseEvent): void {
    current = current === "dark" ? "light" : "dark";
    applyTheme(current, toggleButton);
    safeLocalStorageSet(THEME_STORAGE_KEY, current);
  });
}

/* ----------------------------------------------------- 2. mobile nav menu -- */

function initMobileNav(): void {
  const menuButton: HTMLButtonElement = queryRequired<HTMLButtonElement>("#menuToggle");
  const navLinks: HTMLElement = queryRequired<HTMLElement>("#navLinks");
  const nav: HTMLElement = queryRequired<HTMLElement>("nav");

  function closeMenu(): void {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  menuButton.addEventListener("click", function (event: MouseEvent): void {
    const isOpen: boolean = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  // close after tapping a link
  const links: NodeListOf<HTMLAnchorElement> = navLinks.querySelectorAll("a");
  links.forEach(function (link: HTMLAnchorElement): void {
    link.addEventListener("click", function (event: MouseEvent): void {
      closeMenu();
    });
  });

  // close on outside click
  document.addEventListener("click", function (event: MouseEvent): void {
    const target: EventTarget | null = event.target;
    if (target instanceof Node && !nav.contains(target)) {
      closeMenu();
    }
  });

  // close on Escape
  document.addEventListener("keydown", function (event: KeyboardEvent): void {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

/* -------------------------------------------------------------- 3. scroll-spy -- */

function collectSpyTargets(): ScrollSpyEntry[] {
  const entries: ScrollSpyEntry[] = [];
  const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(".nav-links a[href^='#']");
  links.forEach(function (link: HTMLAnchorElement): void {
    const href: string | null = link.getAttribute("href");
    if (href === null || href.length < 2) {
      return;
    }
    const target: Element | null = document.querySelector(href);
    if (target !== null) {
      entries.push({ id: href.slice(1), link: link });
    }
  });
  return entries;
}

function initScrollSpy(): void {
  const targets: ScrollSpyEntry[] = collectSpyTargets();
  if (targets.length === 0) {
    return;
  }

  function setActive(id: string): void {
    targets.forEach(function (entry: ScrollSpyEntry): void {
      entry.link.classList.toggle("active", entry.id === id);
    });
  }

  const observer: IntersectionObserver = new IntersectionObserver(
    function (entries: IntersectionObserverEntry[]): void {
      entries.forEach(function (entry: IntersectionObserverEntry): void {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      root: SCROLL_SPY_OPTIONS.root as Element | null,
      rootMargin: SCROLL_SPY_OPTIONS.rootMargin,
      threshold: SCROLL_SPY_OPTIONS.threshold,
    }
  );

  targets.forEach(function (entry: ScrollSpyEntry): void {
    const section: Element | null = document.getElementById(entry.id);
    if (section !== null) {
      observer.observe(section);
    }
  });
}

/* -------------------------------------------------- 4. reveal on scroll -- */

function initReveal(): void {
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll(".reveal");

  if (prefersReducedMotion()) {
    elements.forEach(function (element: HTMLElement): void {
      element.classList.add("visible");
    });
    return;
  }

  const observer: IntersectionObserver = new IntersectionObserver(
    function (entries: IntersectionObserverEntry[]): void {
      entries.forEach(function (entry: IntersectionObserverEntry): void {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: REVEAL_OPTIONS.root as Element | null,
      rootMargin: REVEAL_OPTIONS.rootMargin,
      threshold: REVEAL_OPTIONS.threshold,
    }
  );

  elements.forEach(function (element: HTMLElement): void {
    observer.observe(element);
  });
}

/* -------------------------------------- 5. fullscreen profile photo overlay -- */

function initPhotoOverlay(): void {
  const photo: HTMLButtonElement = queryRequired<HTMLButtonElement>("#profilePhoto");
  const overlay: HTMLElement = queryRequired<HTMLElement>("#photoOverlay");

  function openOverlay(): void {
    showLayer(overlay);
    document.body.style.overflow = "hidden";
  }

  function closeOverlay(): void {
    hideLayer(overlay);
    document.body.style.overflow = "";
  }

  photo.addEventListener("click", function (event: MouseEvent): void {
    openOverlay();
  });

  overlay.addEventListener("click", function (event: MouseEvent): void {
    closeOverlay();
  });

  document.addEventListener("keydown", function (event: KeyboardEvent): void {
    if (event.key === "Escape" && !overlay.hidden) {
      closeOverlay();
    }
  });
}

/* ------------------------------------------------ 6. project detail modal -- */

function buildModalContent(
  container: HTMLElement,
  detail: ProjectDetail,
  imageSrc: string,
  imageAlt: string
): void {
  container.textContent = "";

  const image: HTMLImageElement = document.createElement("img");
  image.className = "modal-img";
  image.src = imageSrc;
  image.alt = imageAlt;
  container.appendChild(image);

  const title: HTMLElement = el("h3", "modal-title", detail.title);
  title.id = "modalTitle";
  container.appendChild(title);

  container.appendChild(el("div", "modal-meta", detail.meta));
  container.appendChild(el("p", "modal-summary", detail.summary));

  container.appendChild(el("div", "modal-sub", "// highlights"));
  const list: HTMLUListElement = document.createElement("ul");
  list.className = "modal-highlights";
  detail.highlights.forEach(function (item: string): void {
    const li: HTMLLIElement = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
  container.appendChild(list);

  const tags: HTMLElement = el("div", "modal-tags", "");
  detail.tech.forEach(function (name: string): void {
    tags.appendChild(el("span", "tag", name));
  });
  container.appendChild(tags);

  const status: HTMLElement = el("div", "modal-status", "");
  const statusLabel: HTMLElement = el("b", "", "status:");
  status.appendChild(statusLabel);
  status.appendChild(document.createTextNode(" " + detail.status));
  container.appendChild(status);

  if (detail.links.length > 0) {
    const linksRow: HTMLElement = el("div", "modal-links", "");
    detail.links.forEach(function (link: ProjectLink): void {
      const anchor: HTMLAnchorElement = document.createElement("a");
      anchor.href = link.url;
      anchor.textContent = link.label;
      if (link.url.indexOf("http") === 0) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
      linksRow.appendChild(anchor);
    });
    container.appendChild(linksRow);
  }
}

function initProjectModal(): void {
  const backdrop: HTMLElement = queryRequired<HTMLElement>("#projectModalBackdrop");
  const content: HTMLElement = queryRequired<HTMLElement>("#modalContent");
  const closeButton: HTMLButtonElement = queryRequired<HTMLButtonElement>("#modalClose");
  const cards: NodeListOf<HTMLElement> = document.querySelectorAll(".proj-card[data-project]");

  let originCard: HTMLElement | null = null;
  let isOpen: boolean = false;

  function openModal(card: HTMLElement): void {
    const key: string | null = card.getAttribute("data-project");
    if (key === null) {
      return;
    }
    const detail: ProjectDetail | undefined = PROJECT_DETAILS[key];
    if (detail === undefined) {
      return;
    }

    const cardImage: HTMLImageElement | null = card.querySelector(".proj-img");
    const imageSrc: string = cardImage !== null ? cardImage.getAttribute("src") || "" : "";
    const imageAlt: string = cardImage !== null ? cardImage.getAttribute("alt") || detail.title : detail.title;
    buildModalContent(content, detail, imageSrc, imageAlt);

    originCard = card;
    isOpen = true;
    showLayer(backdrop);
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeModal(): void {
    if (!isOpen) {
      return;
    }
    isOpen = false;
    hideLayer(backdrop);
    document.body.style.overflow = "";
    if (originCard !== null) {
      originCard.focus();
      originCard = null;
    }
  }

  cards.forEach(function (card: HTMLElement): void {
    card.addEventListener("click", function (event: MouseEvent): void {
      openModal(card);
    });
    card.addEventListener("keydown", function (event: KeyboardEvent): void {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  closeButton.addEventListener("click", function (event: MouseEvent): void {
    closeModal();
  });

  // backdrop click: only when the click lands outside the panel
  backdrop.addEventListener("click", function (event: MouseEvent): void {
    if (event.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event: KeyboardEvent): void {
    if (event.key === "Escape" && isOpen) {
      event.stopPropagation();
      closeModal();
    }
  });
}

/* ------------------------------------------------------- 7. footer year -- */

function initFooterYear(): void {
  const yearSpan: HTMLElement = queryRequired<HTMLElement>("#year");
  const now: Date = new Date();
  yearSpan.textContent = String(now.getFullYear());
}

/* ------------------------------------------------------------------- init -- */

function init(): void {
  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initReveal();
  initPhotoOverlay();
  initProjectModal();
  initFooterYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function (event: Event): void {
    init();
  });
} else {
  init();
}
