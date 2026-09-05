// Mobile nav toggle
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");

if (toggle && links) {
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );
}

// Card spotlight (mouse-follow glow)
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
    card.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// Animated counters
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target.querySelector("[data-count]");
        if (counter) animateCount(counter);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

const heroStats = document.querySelector(".hero-stats");
if (heroStats) statsObserver.observe(heroStats);

// Random live player count each refresh (10,000 – 15,000)
const playerCount = document.getElementById("playerCount");
if (playerCount) {
  const randomPlayers = Math.floor(Math.random() * 5001) + 10000;
  const heroStatsEl = document.querySelector(".hero-stats");
  const playStatEl = playerCount.closest(".stat");

  const playerObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCountTo(playerCount, randomPlayers);
        playerObserver.unobserve(playStatEl);
      }
    },
    { threshold: 0.4 }
  );
  if (playStatEl) playerObserver.observe(playStatEl);
}

function animateCountTo(el, target) {
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Version profiles
const VERSIONS = {
  "1.7.10": {
    tag: "Legacy classic",
    desc: "The combo-heavy origin meta. Tuned for old-style PVP where first-hit fights decide everything.",
    features: [
      "Legacy JVM profile optimized for 1.7 performance",
      "Old animation render preset",
      "Classic keybind layout for toggle combat",
      "Auto chunk-cleanup for long sessions"
    ]
  },
  "1.8.9": {
    tag: "The practice meta",
    desc: "Still the king of competitive servers. Our most-tuned profile gets smooth, consistent frames where it matters.",
    features: [
      "Hitbox practice overlay presets",
      "1.8 animation & click timing profile",
      "Sprint-toggle keybind layouts",
      "FPS cap modes for stable frame pacing",
      "Knockback-friendly render tuning"
    ]
  },
  "1.12.2": {
    tag: "Modded + skywars era",
    desc: "A generation built on modpacks and fast-paced gamemodes. Isolated profiles keep everything running clean.",
    features: [
      "Forge & Fabric-friendly profile isolation",
      "Minigame render presets",
      "Memory tuning for modpacks",
      "Quick-swap between modded and vanilla"
    ]
  },
  "1.16.5": {
    tag: "The nether update",
    desc: "PVP moved slow and strategic. Our preset keeps things sharp without sacrificing modern visuals.",
    features: [
      "Modern combat support profile",
      "Shader-friendly RAM preset",
      "Render distance tuning for fort builds",
      "Crosshair & FOV presets"
    ]
  },
  "1.18.2": {
    tag: "Caves & streams",
    desc: "World generation got heavier — we tuned chunk loading so the game stays smooth at high render distances.",
    features: [
      "Smooth chunk streaming profile",
      "Low-memory mode for big worlds",
      "Max-FPS preset for PVP arenas",
      "Auto garbage-collection cycles"
    ]
  },
  "1.19.4": {
    tag: "Wild era",
    desc: "Fast-paced updates, faster switching. Load any 1.19 build with presets that just work.",
    features: [
      "Quick version switching preset",
      "Optimized argument sets per build",
      "Full-screen polling fixes",
      "In-game HUD defaults cleaned up"
    ]
  },
  "1.20.x": {
    tag: "Trails & play",
    desc: "Modern PVP with all the trimmings — our default for new players trying the latest combat.",
    features: [
      "Auto version detection",
      "Clean rendering profile",
      "Capable on both vanilla & hybrid servers",
      "One-click settings matcher"
    ]
  },
  "1.21.x": {
    tag: "Latest meta",
    desc: "Day-one support for each release. Newer combat, same responsive feel you expect from Vape.",
    features: [
      "Day-one support for new releases",
      "Combat 2.0 tuned presets",
      "Hotfix-ready update channel",
      "Backwards-compatible profiles"
    ]
  },
  "Snapshots": {
    tag: "Preview builds",
    desc: "Test prerelease Minecraft builds safely in an isolated environment with zero risk to your main setup.",
    features: [
      "Isolated snapshot-only profile",
      "Rollback-safe installs",
      "Feedback-ready bug notes",
      "Automatic cleanup on test"
    ]
  }
};

const modal = document.getElementById("versionModal");
const modalTitle = document.getElementById("modalTitle");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalDesc = document.getElementById("modalDesc");
const modalList = document.getElementById("modalList");

function openVersionModal(key) {
  const data = VERSIONS[key];
  if (!data) return;
  modalTitle.textContent = key;
  modalEyebrow.textContent = data.tag;
  modalDesc.textContent = data.desc;
  modalList.innerHTML = data.features.map((f) => "<li>" + f + "</li>").join("");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeVersionModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".version-pill").forEach((pill) => {
  pill.addEventListener("click", () => openVersionModal(pill.dataset.version));
});

if (modal) {
  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeVersionModal)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVersionModal();
  });
}