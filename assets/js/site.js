// Mobile menu, submenu toggles, and the preview design switcher. No dependencies.
(function () {
  "use strict";
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var mq = window.matchMedia("(min-width: 62em)");

  function setMenu(open) {
    if (!header || !toggle) return;
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openSub = document.querySelector("[data-sub].is-open");
    if (openSub) {
      openSub.classList.remove("is-open");
      var b = openSub.querySelector("[data-sub-toggle]");
      b.setAttribute("aria-expanded", "false");
      b.focus();
    } else if (header && header.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  mq.addEventListener && mq.addEventListener("change", function () { setMenu(false); });

  document.querySelectorAll("[data-sub-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.closest("[data-sub]");
      var open = !li.classList.contains("is-open");
      document.querySelectorAll("[data-sub].is-open").forEach(function (o) {
        o.classList.remove("is-open");
        o.querySelector("[data-sub-toggle]").setAttribute("aria-expanded", "false");
      });
      li.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-sub]")) return;
    document.querySelectorAll("[data-sub].is-open").forEach(function (o) {
      o.classList.remove("is-open");
      o.querySelector("[data-sub-toggle]").setAttribute("aria-expanded", "false");
    });
  });

  // Preview design switcher (only rendered when params.preview is true).
  var sw = document.querySelector("[data-switcher]");
  if (!sw) return;
  var root = document.documentElement;
  function sync() {
    var d = root.getAttribute("data-design");
    sw.querySelectorAll("[data-design-choice]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-design-choice") === d));
    });
  }
  sw.addEventListener("click", function (e) {
    var b = e.target.closest("[data-design-choice]");
    if (!b) return;
    var d = b.getAttribute("data-design-choice");
    root.setAttribute("data-design", d);
    try { localStorage.setItem("wbs-design", d); } catch (err) {}
    try {
      var u = new URL(location.href);
      u.searchParams.set("design", d);
      history.replaceState(null, "", u);
    } catch (err) {}
    sync();
  });
  sync();
})();
