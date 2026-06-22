/* ============================================================
   FAREWELL TRIBUTE — MAIN SCRIPT
   Modules:
     1. Theme Toggle   – light/dark, persisted via localStorage
     2. Carousel       – classmates slider, keyboard + touch
     3. Scroll Reveal  – IntersectionObserver entrance animations
     4. Audio Control  – background music with autoplay fallback
     5. Mobile Nav     – hamburger overlay
     6. Gallery        – hide placeholders when images load
   ============================================================ */

/* ── 1. THEME TOGGLE ──────────────────────────────────────── */
function initTheme() {
  const html = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = stored ? stored === "dark" : prefersDark;

  if (isDark) html.setAttribute("data-theme", "dark");
  updateIcon(isDark);

  toggleBtn?.addEventListener("click", () => {
    const nowDark = html.getAttribute("data-theme") === "dark";
    const next = nowDark ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateIcon(next === "dark");
  });

  function updateIcon(dark) {
    const icon = toggleBtn?.querySelector("i");
    if (icon) icon.className = dark ? "bi bi-sun" : "bi bi-moon";
  }
}

/* ── 2. CAROUSEL ──────────────────────────────────────────── */
function initCarousel() {
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".classmate-slide");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const dotsWrap = document.querySelector(".carousel-dots");
  const counter = document.querySelector(".carousel-counter");

  if (!track || !slides.length) return;

  let current = 0;
  const total = slides.length;
  let autoTimer = null;
  let touchStartX = 0;

  /* Build dots */
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Slide " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsWrap?.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap
      ?.querySelectorAll(".carousel-dot")
      .forEach((d, i) => d.classList.toggle("active", i === current));
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  prevBtn?.addEventListener("click", () => goTo(current - 1));
  nextBtn?.addEventListener("click", () => goTo(current + 1));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  track.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  const wrapper = document.querySelector(".carousel-wrapper");
  wrapper?.addEventListener("mouseenter", () => clearInterval(autoTimer));
  wrapper?.addEventListener("mouseleave", startAuto);

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  startAuto();
}

/* ── 3. SCROLL REVEAL ─────────────────────────────────────── */
function initScrollReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document
      .querySelectorAll(".reveal, .reveal-stagger")
      .forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(".reveal, .reveal-stagger")
    .forEach((el) => obs.observe(el));
}

/* ── 4. AUDIO ─────────────────────────────────────────────── */
function initAudio() {
  const audio = document.getElementById("bg-audio");
  const player = document.getElementById("audio-player");
  const playBtn = document.getElementById("audio-play");
  const muteBtn = document.getElementById("audio-mute");
  const statusEl = document.getElementById("audio-status");

  if (!audio) return;
  audio.volume = 0.45;
  let started = false;

  function tryPlay() {
    audio
      .play()
      .then(() => {
        started = true;
        updateUI(true);
        player?.classList.add("expanded");
      })
      .catch(() => {
        if (statusEl) statusEl.textContent = "Click to play";
      });
  }

  function startOnInteraction() {
    if (started) return;
    audio.play().then(() => {
      started = true;
      updateUI(true);
      player?.classList.add("expanded");
    });
  }

  document.addEventListener("click", startOnInteraction, { once: true });
  document.addEventListener("touchstart", startOnInteraction, {
    once: true,
    passive: true,
  });

  playBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (audio.paused) {
      audio.play();
      started = true;
      updateUI(true);
    } else {
      audio.pause();
      updateUI(false);
    }
  });

  muteBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    audio.muted = !audio.muted;
    const icon = muteBtn.querySelector("i");
    if (icon)
      icon.className = audio.muted ? "bi bi-volume-mute" : "bi bi-volume-up";
  });

  audio.addEventListener("play", () => updateUI(true));
  audio.addEventListener("pause", () => updateUI(false));

  function updateUI(playing) {
    const icon = playBtn?.querySelector("i");
    if (icon) icon.className = playing ? "bi bi-pause-fill" : "bi bi-play-fill";
    if (statusEl) statusEl.textContent = playing ? "Now Playing" : "Paused";
  }

  tryPlay();
}

/* ── 5. MOBILE NAV ────────────────────────────────────────── */
function initMobileNav() {
  const ham = document.getElementById("nav-hamburger");
  const menu = document.getElementById("mobile-menu");
  if (!ham || !menu) return;

  ham.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    const icon = ham.querySelector("i");
    if (icon) icon.className = open ? "bi bi-x-lg" : "bi bi-list";
    document.body.style.overflow = open ? "hidden" : "";
  });

  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      const icon = ham.querySelector("i");
      if (icon) icon.className = "bi bi-list";
      document.body.style.overflow = "";
    }),
  );
}

/* ── 6. GALLERY PLACEHOLDERS ──────────────────────────────── */
function initGalleryPlaceholders() {
  document
    .querySelectorAll(
      ".gallery-full-item img, .gallery-preview-item img, .gallery-item img",
    )
    .forEach((img) => {
      const ph = img
        .closest('[class*="gallery"]')
        ?.querySelector(".gallery-placeholder");
      if (!ph) return;
      const hide = () => {
        ph.style.display = "none";
      };
      if (img.complete && img.naturalWidth > 0) hide();
      else img.addEventListener("load", hide);
    });
}

/* ── INIT ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCarousel();
  initScrollReveal();
  initAudio();
  initMobileNav();
  initGalleryPlaceholders();
});
