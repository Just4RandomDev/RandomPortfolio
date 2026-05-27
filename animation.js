// Adds reveal animations to elements with .reveal
(function () {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      }
    },
    { root: null, threshold: 0.12 }
  );

  els.forEach((el, idx) => {
    el.style.transitionDelay = `${Math.min(idx * 60, 480)}ms`;
    io.observe(el);
  });
})();

