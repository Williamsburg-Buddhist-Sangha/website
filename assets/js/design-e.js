// Design E ("First Light") enhancements. Vanilla, optional: the page is complete without it.
// Runs only while <html data-design="e">; honours prefers-reduced-motion.
(function () {
  "use strict";
  var root = document.documentElement;
  if (root.getAttribute("data-design") !== "e") return;
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Slow reveal: sections and list items fade in and rise 10px as they enter the viewport.
  var targets = document.querySelectorAll(
    ".section, .group, .person, .event-item, .events-block, .page-banner, .event__layout > *"
  );
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      io.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  Array.prototype.forEach.call(targets, function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) return; // already on screen: never hide it
    el.classList.add("e-reveal");
    io.observe(el);
  });

  // Header: a hairline appears once the page has scrolled past the dawn band.
  var hdr = document.querySelector("[data-header]");
  function onScroll() { if (hdr) hdr.classList.toggle("e-scrolled", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
