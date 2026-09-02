"use strict";
/* ==========================================================================
   Nasim Mahmud Mishu · portfolio
   main.ts · typed TypeScript source (strict mode, no external deps)

   Compile (the compiled main.js is what the site loads):
     tsc scripts/main.ts --target ES2019 --strict --outFile scripts/main.js
   ========================================================================== */
/* ------------------------------------------------------------ constants -- */
const THEME_STORAGE_KEY = "portfolio-theme";
const THEME_META_COLORS = {
    light: "#faf9f6",
    dark: "#161513",
};
const REVEAL_OPTIONS = {
    root: null,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.05,
};
/* matches the .2s open/close transitions in style.css */
const ANIMATION_MS = 200;
/* page transition timings: entry fade is .25s, exit fade is .18s */
const EXIT_ANIMATION_MS = 180;
/* --------------------------------------------------- project detail data --
   Content for the project modal lives here, keyed by the data-project
   attribute on each card in projects.html. Edit a project's text, highlights,
   tech tags, status, or links below; the card grid itself stays untouched. */
const PROJECT_DETAILS = {
    "niro-bot": {
        id: "niro-bot",
        title: "NIRO Educational Bot",
        meta: "NIRO Lab · Oct 2024 - Present",
        summary: "An educational robot built at the NSU Intelligent Robotics (NIRO) Lab to support hands-on learning and research. " +
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
        summary: "A hexapod robot built for mobility on uneven terrain, where wheeled robots struggle. Six 3-DOF legs driven by " +
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
        summary: "My B.Sc. capstone project: an autonomous search-and-rescue robot for disaster-prone areas, where sending people " +
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
        summary: "A low-cost assistive system for elderly and disabled users who cannot move or speak. Gestures captured by a " +
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
        summary: "An HCI study and platform built during COVID-19. We interviewed 32 participants and found recurring problems: " +
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
function queryRequired(selector) {
    const el = document.querySelector(selector);
    if (el === null) {
        throw new Error("Required element not found: " + selector);
    }
    return el;
}
function safeLocalStorageGet(key) {
    try {
        return window.localStorage.getItem(key);
    }
    catch (error) {
        return null; // storage unavailable (e.g. some file:// contexts)
    }
}
function safeLocalStorageSet(key, value) {
    try {
        window.localStorage.setItem(key, value);
    }
    catch (error) {
        /* storage unavailable; theme simply will not persist */
    }
}
function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className !== "") {
        node.className = className;
    }
    node.textContent = text;
    return node;
}
/* Show an animated layer: remove [hidden], then add .open on the next frame. */
function showLayer(layer) {
    layer.hidden = false;
    if (prefersReducedMotion()) {
        layer.classList.add("open");
        return;
    }
    window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
            layer.classList.add("open");
        });
    });
}
/* Hide an animated layer: drop .open, then restore [hidden] after the fade. */
function hideLayer(layer) {
    layer.classList.remove("open");
    if (prefersReducedMotion()) {
        layer.hidden = true;
        return;
    }
    window.setTimeout(function () {
        if (!layer.classList.contains("open")) {
            layer.hidden = true;
        }
    }, ANIMATION_MS);
}
/* ------------------------------------------------- 1. page transitions --
   On load the body fades/slides in (.page-in). Clicking an internal .html
   link plays a short exit fade before navigation. Returning via back/forward
   from the bfcache restores visibility instantly (pageshow.persisted). */
function currentPageFile() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf("/") + 1);
    return file === "" ? "index.html" : file;
}
/* Returns the absolute target URL when a link click should be animated,
   or null when the browser should handle the click normally. */
function transitionTarget(anchor) {
    if (anchor.target === "_blank") {
        return null;
    }
    const href = anchor.getAttribute("href");
    if (href === null || href === "") {
        return null;
    }
    if (href.charAt(0) === "#") {
        return null; // in-page anchor
    }
    if (href.toLowerCase().indexOf("mailto:") === 0) {
        return null;
    }
    let url;
    try {
        url = new URL(href, window.location.href);
    }
    catch (error) {
        return null;
    }
    // same-origin check; under file:// the host is empty on both sides
    if (url.protocol !== window.location.protocol || url.host !== window.location.host) {
        return null;
    }
    if (!url.pathname.toLowerCase().endsWith(".html")) {
        return null;
    }
    return url.href;
}
function initPageTransitions() {
    let exiting = false;
    // entry animation: body starts hidden in CSS, .page-in reveals it
    if (prefersReducedMotion()) {
        document.body.classList.add("page-in");
    }
    else {
        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                document.body.classList.add("page-in");
            });
        });
    }
    // exit animation for internal page links
    document.addEventListener("click", function (event) {
        if (event.defaultPrevented || exiting) {
            return;
        }
        if (event.button !== 0) {
            return;
        }
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const anchor = target.closest("a");
        if (anchor === null) {
            return;
        }
        const destination = transitionTarget(anchor);
        if (destination === null) {
            return;
        }
        event.preventDefault();
        exiting = true;
        if (prefersReducedMotion()) {
            window.location.href = destination;
            return;
        }
        document.body.classList.add("page-exit");
        window.setTimeout(function () {
            window.location.href = destination;
        }, EXIT_ANIMATION_MS);
    });
    // bfcache restore: the page kept its .page-exit state; reveal it instantly
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            exiting = false;
            document.body.classList.remove("page-exit");
            document.body.classList.add("page-in");
        }
    });
}
/* --------------------------------- 2. current-page marker in the nav --
   Replaces the old scroll-spy: the nav link whose href matches the current
   filename gets the accent marker and aria-current="page". Works from
   file:// because it only compares location.pathname's filename. */
function initCurrentPageNav() {
    const file = currentPageFile();
    const links = document.querySelectorAll(".nav-links a");
    links.forEach(function (link) {
        const href = link.getAttribute("href");
        if (href !== null && href === file) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}
/* -------------------------------------------------------- 3. theme toggle -- */
function systemPreferredTheme() {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    return darkQuery.matches ? "dark" : "light";
}
function initialTheme() {
    const stored = safeLocalStorageGet(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
        return stored;
    }
    return systemPreferredTheme();
}
function applyTheme(theme, toggleButton) {
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
    else {
        document.documentElement.removeAttribute("data-theme");
    }
    toggleButton.textContent = "[ " + theme + " ]";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta !== null) {
        meta.setAttribute("content", THEME_META_COLORS[theme]);
    }
}
/* Applies the persisted theme before the first paint and wires the toggle.
   Called synchronously at script load (the script sits at the end of body). */
function initThemeToggle() {
    const toggleButton = queryRequired("#themeToggle");
    let current = initialTheme();
    applyTheme(current, toggleButton);
    toggleButton.addEventListener("click", function (event) {
        current = current === "dark" ? "light" : "dark";
        applyTheme(current, toggleButton);
        safeLocalStorageSet(THEME_STORAGE_KEY, current);
    });
}
/* ----------------------------------------------------- 4. mobile nav menu -- */
function initMobileNav() {
    const menuButton = queryRequired("#menuToggle");
    const navLinks = queryRequired("#navLinks");
    const nav = queryRequired("nav");
    function closeMenu() {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    }
    menuButton.addEventListener("click", function (event) {
        const isOpen = navLinks.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });
    // close after tapping a link
    const links = navLinks.querySelectorAll("a");
    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            closeMenu();
        });
    });
    // close on outside click
    document.addEventListener("click", function (event) {
        const target = event.target;
        if (target instanceof Node && !nav.contains(target)) {
            closeMenu();
        }
    });
    // close on Escape
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
}
/* -------------------------------------------------- 5. reveal on scroll -- */
function initReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (prefersReducedMotion()) {
        elements.forEach(function (element) {
            element.classList.add("visible");
        });
        return;
    }
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: REVEAL_OPTIONS.root,
        rootMargin: REVEAL_OPTIONS.rootMargin,
        threshold: REVEAL_OPTIONS.threshold,
    });
    elements.forEach(function (element) {
        observer.observe(element);
    });
}
/* --------------------- 6. fullscreen profile photo overlay (index only) -- */
function initPhotoOverlay() {
    const photo = document.querySelector("#profilePhoto");
    const overlayEl = document.querySelector("#photoOverlay");
    if (photo === null || overlayEl === null) {
        return; // not on this page
    }
    const overlay = overlayEl;
    function openOverlay() {
        showLayer(overlay);
        document.body.style.overflow = "hidden";
    }
    function closeOverlay() {
        hideLayer(overlay);
        document.body.style.overflow = "";
    }
    photo.addEventListener("click", function (event) {
        openOverlay();
    });
    overlay.addEventListener("click", function (event) {
        closeOverlay();
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !overlay.hidden) {
            closeOverlay();
        }
    });
}
/* ------------------------------- 7. project detail modal (projects only) -- */
function buildModalContent(container, detail, imageSrc, imageAlt) {
    container.textContent = "";
    const image = document.createElement("img");
    image.className = "modal-img";
    image.src = imageSrc;
    image.alt = imageAlt;
    container.appendChild(image);
    const title = el("h3", "modal-title", detail.title);
    title.id = "modalTitle";
    container.appendChild(title);
    container.appendChild(el("div", "modal-meta", detail.meta));
    container.appendChild(el("p", "modal-summary", detail.summary));
    container.appendChild(el("div", "modal-sub", "// highlights"));
    const list = document.createElement("ul");
    list.className = "modal-highlights";
    detail.highlights.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
    container.appendChild(list);
    const tags = el("div", "modal-tags", "");
    detail.tech.forEach(function (name) {
        tags.appendChild(el("span", "tag", name));
    });
    container.appendChild(tags);
    const status = el("div", "modal-status", "");
    const statusLabel = el("b", "", "status:");
    status.appendChild(statusLabel);
    status.appendChild(document.createTextNode(" " + detail.status));
    container.appendChild(status);
    if (detail.links.length > 0) {
        const linksRow = el("div", "modal-links", "");
        detail.links.forEach(function (link) {
            const anchor = document.createElement("a");
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
function initProjectModal() {
    const backdropEl = document.querySelector("#projectModalBackdrop");
    const contentEl = document.querySelector("#modalContent");
    const closeBtn = document.querySelector("#modalClose");
    if (backdropEl === null || contentEl === null || closeBtn === null) {
        return; // not on this page
    }
    const backdrop = backdropEl;
    const content = contentEl;
    const closeButton = closeBtn;
    const cards = document.querySelectorAll(".proj-card[data-project]");
    let originCard = null;
    let isOpen = false;
    function openModal(card) {
        const key = card.getAttribute("data-project");
        if (key === null) {
            return;
        }
        const detail = PROJECT_DETAILS[key];
        if (detail === undefined) {
            return;
        }
        const cardImage = card.querySelector(".proj-img");
        const imageSrc = cardImage !== null ? cardImage.getAttribute("src") || "" : "";
        const imageAlt = cardImage !== null ? cardImage.getAttribute("alt") || detail.title : detail.title;
        buildModalContent(content, detail, imageSrc, imageAlt);
        originCard = card;
        isOpen = true;
        showLayer(backdrop);
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }
    function closeModal() {
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
    cards.forEach(function (card) {
        card.addEventListener("click", function (event) {
            openModal(card);
        });
        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openModal(card);
            }
        });
    });
    closeButton.addEventListener("click", function (event) {
        closeModal();
    });
    // backdrop click: only when the click lands outside the panel
    backdrop.addEventListener("click", function (event) {
        if (event.target === backdrop) {
            closeModal();
        }
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && isOpen) {
            event.stopPropagation();
            closeModal();
        }
    });
}
/* ------------------------------------------------------- 8. footer year -- */
function initFooterYear() {
    const yearSpan = queryRequired("#year");
    const now = new Date();
    yearSpan.textContent = String(now.getFullYear());
}
/* ------------------------------------------------------------------- init -- */
/* Run before the first paint (this script sits at the end of <body>): apply
   the persisted theme and start the page-entry transition. */
initThemeToggle();
initPageTransitions();
function init() {
    initMobileNav();
    initCurrentPageNav();
    initReveal();
    initPhotoOverlay();
    initProjectModal();
    initFooterYear();
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function (event) {
        init();
    });
}
else {
    init();
}
