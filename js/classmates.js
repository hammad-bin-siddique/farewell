/* ============================================================
   CLASSMATES PAGE — STICKY SCROLL ENGINE
   Handles:
   - Progress bar (fills as you scroll through all panels)
   - Side nav dots (one per classmate, clicking scrolls to them)
   - Active state tracking
   ============================================================ */

(function () {
  const panels = document.querySelectorAll('.sticky-panel');
  const progressBar = document.getElementById('progress-bar');
  const dotsWrap = document.getElementById('sticky-nav-dots');
  const container = document.getElementById('sticky-classmates');

  if (!panels.length || !container) return;

  /* Build side nav dots */
  panels.forEach((panel, i) => {
    const name = panel.dataset.name || (i + 1);
    const dot = document.createElement('button');
    dot.className = 'sticky-dot';
    dot.setAttribute('aria-label', 'Go to ' + name);
    dot.setAttribute('title', name);
    dot.addEventListener('click', () => {
      /* Scroll so the panel's top aligns with viewport top */
      const offset = panel.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
    dotsWrap?.appendChild(dot);
  });

  const dots = dotsWrap?.querySelectorAll('.sticky-dot');

  function update() {
    const containerTop = container.getBoundingClientRect().top;
    const containerH = container.offsetHeight;
    const winH = window.innerHeight;

    /* Progress: 0 when container top is at viewport bottom, 1 when bottom is at viewport top */
    const scrolled = -containerTop;
    const scrollable = containerH - winH;
    const progress = Math.max(0, Math.min(1, scrolled / scrollable));
    if (progressBar) progressBar.style.width = (progress * 100) + '%';

    /* Which panel is currently "active" (centered in viewport) */
    let activeIndex = 0;
    panels.forEach((panel, i) => {
      const rect = panel.getBoundingClientRect();
      /* Panel is sticky — its rect.top will be 0 (or nav height) when it's in view */
      if (rect.top <= winH * 0.5) activeIndex = i;
    });

    dots?.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // initial call
})();
