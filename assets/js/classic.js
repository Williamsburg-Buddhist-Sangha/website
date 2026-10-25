/* Classic layout behaviour (vanilla; everything also works without JS):
   1. Sticky header as production base.min.js: #sticky_navigation becomes fixed once the page
      scrolls past its offsetTop + 40 (padding 30px 0 25px, opacity .99), relative again when
      back. Classic reserves the header height so the page does not jump.
   2. Mobile menu (meanmenu look, <= 768px): the <details> hamburger opens the list; "+"/"-"
      expanders open sub-menus (without JS sub-menus are always open).
   3. About Us dropdown on touch: first tap opens it, second tap follows the link; Escape closes.
   4. Clickable Divi modules ([data-box-link]): a click anywhere opens the link in a new tab. */
(function () {
  "use strict";
  var nav = document.getElementById("sticky_navigation");
  var branding = document.getElementById("branding");
  if (nav && branding) {
    var limit = 0, fixed = false;
    var measure = function () { if (!fixed) limit = nav.getBoundingClientRect().top + window.pageYOffset + 40; };
    var update = function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > limit && !fixed) {
        branding.style.minHeight = nav.offsetHeight + "px";
        nav.classList.add("is-fixed"); fixed = true;
        if (getComputedStyle(nav).position !== "fixed") branding.style.minHeight = "";
      } else if (y <= limit && fixed) {
        nav.classList.remove("is-fixed"); fixed = false; branding.style.minHeight = "";
      }
    };
    measure(); update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", function () { measure(); update(); });
  }

  document.querySelectorAll(".mean-nav .mean-expand").forEach(function (b) {
    b.hidden = false;
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var li = b.parentNode, open = li.classList.toggle("is-expanded");
      b.textContent = open ? "-" : "+";
      b.setAttribute("aria-expanded", open ? "true" : "false");
      b.classList.toggle("mean-clicked", open);
    });
  });

  var touch = false;
  document.addEventListener("pointerdown", function (e) { touch = e.pointerType === "touch" || e.pointerType === "pen"; }, true);
  var parents = document.querySelectorAll("#menu-main-menu > .menu-item-has-children");
  parents.forEach(function (li) {
    var a = li.querySelector(":scope > a");
    a.setAttribute("aria-haspopup", "true");
    a.addEventListener("click", function (e) {
      if (touch && !li.classList.contains("is-open")) { e.preventDefault(); li.classList.add("is-open"); }
    });
  });
  var closeAll = function () { parents.forEach(function (li) { li.classList.remove("is-open"); }); };
  document.addEventListener("click", function (e) { if (!e.target.closest("#menu-main-menu .menu-item-has-children")) closeAll(); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeAll();
    var f = document.activeElement;
    if (f && f.closest && f.closest("#menu-main-menu .sub-menu")) { f.closest(".menu-item-has-children").querySelector("a").focus(); f.blur(); }
  });

  document.querySelectorAll("[data-box-link]").forEach(function (box) {
    box.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return;
      window.open(box.getAttribute("data-box-link"), "_blank", "noopener");
    });
  });
})();
