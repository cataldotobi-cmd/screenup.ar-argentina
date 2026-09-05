(function () {
  "use strict";

  var data = window.__BRAND__ || {};

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); };
  var escHTML = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  };

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  // --- SPLASH ---
  function initSplash() {
    var splash = $("#splash");
    if (!splash) return;
    var hide = function () {
      if (splash.classList.contains("hide")) return;
      splash.classList.add("hide");
      document.body.style.overflow = "";
      document.body.style.background = "";
      setTimeout(function () { splash.style.display = "none"; }, 700);
    };
    var video = document.getElementById("splashVideo");
    if (video) {
      video.addEventListener("ended", hide);
      setTimeout(hide, 8000); // seguridad por si el video falla
    } else {
      setTimeout(hide, 1800);
    }
  }

  // --- NAV ---
  function initNav() {
    var nav = $("#nav");
    var toggle = $("#navToggle");
    var links = $("#navLinks");
    if (!nav) return;

    window.addEventListener("scroll", function () {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    }, { passive: true });

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        toggle.classList.toggle("active");
        links.classList.toggle("open");
      });
      $$("a", links).forEach(function (a) {
        a.addEventListener("click", function () {
          toggle.classList.remove("active");
          links.classList.remove("open");
        });
      });
    }
  }

  // --- SMOOTH SCROLL ---
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href === "#") return;
        var target = $(href);
        if (!target) return;
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  // --- PLANS ---
  function mountPlans() {
    var target = $("[data-planes]");
    if (!target || target.children.length > 0 || !data.plans) return;

    target.innerHTML = data.plans.map(function (plan) {
      var cls = plan.highlight ? "plan-card plan-card--highlight reveal" : "plan-card reveal";
      var badge = plan.badge ? '<div class="plan-badge">' + escHTML(plan.badge) + '</div>' : '';
      var features = plan.features.map(function (f) {
        return '<li><span class="plan-check"><svg viewBox="0 0 12 12"><path d="M2 6l3 3 5-5"/></svg></span>' + escHTML(f) + '</li>';
      }).join("");
      var btnClass = plan.highlight ? "btn btn-primary btn-plan" : "btn btn-primary btn-plan";

      return '<div class="' + cls + '">' +
        badge +
        '<div class="plan-name">' + escHTML(plan.name) + '</div>' +
        (plan.tagline ? '<div class="plan-tagline">' + escHTML(plan.tagline) + '</div>' : '') +
        '<p class="plan-desc">' + escHTML(plan.description) + '</p>' +
        '<ul class="plan-features">' + features + '</ul>' +
        '<a href="#contacto" class="' + btnClass + '">Pedir presupuesto</a>' +
      '</div>';
    }).join("");
  }

  // --- SECTORS ---
  function mountSectors() {
    var target = $("[data-sectores]");
    if (!target || target.children.length > 0 || !data.sectors) return;

    target.innerHTML = data.sectors.map(function (s) {
      var media = s.photo
        ? '<div class="sector-photo"><img src="' + s.photo + '" alt="Tótem Screen Up en ' + escHTML(s.name.toLowerCase()) + '" loading="lazy" /></div>'
        : '<div class="sector-icon">' + s.icon + '</div>';
      return '<div class="sector-card' + (s.photo ? ' sector-card--photo' : '') + ' reveal">' +
        media +
        '<div class="sector-body">' +
          '<h3>' + escHTML(s.name) + '</h3>' +
          '<p>' + escHTML(s.desc) + '</p>' +
        '</div>' +
      '</div>';
    }).join("");
  }

  // --- TRUST ---
  function mountTrust() {
    var target = $("[data-trust]");
    if (!target || target.children.length > 0 || !data.trust) return;

    var icons = {
      shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
      tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>',
      headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>',
      map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
      film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>'
    };

    target.innerHTML = data.trust.map(function (t) {
      var iconSvg = icons[t.icon] || icons.shield;
      return '<div class="trust-card reveal">' +
        '<div class="trust-icon">' + iconSvg + '</div>' +
        '<h3>' + escHTML(t.title) + '</h3>' +
        '<p>' + escHTML(t.desc) + '</p>' +
      '</div>';
    }).join("");
  }

  // --- REVEALS (IntersectionObserver con stagger en grids) ---
  function initReveals() {
    var els = $$(".reveal");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    var staggered = new Set();

    // Grids: observa el contenedor y anima hijos en cascada
    var gridSelectors = ".ventajas-grid, [data-trust], [data-sectores], [data-planes], .resenas-track";
    var gridObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        $$(".reveal", entry.target).forEach(function (child, i) {
          staggered.add(child);
          setTimeout(function () { child.classList.add("visible"); }, i * 110);
        });
        gridObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    $$(gridSelectors).forEach(function (c) { gridObserver.observe(c); });

    // Resto de elementos: fade individual
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !staggered.has(entry.target)) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    els.forEach(function (el) { observer.observe(el); });

    setTimeout(function () {
      $$(".reveal:not(.visible)").forEach(function (el) { el.classList.add("visible"); });
    }, 6000);
  }

  // --- GSAP HERO ---
  function initHeroAnimation() {
    if (typeof gsap === "undefined") return;

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-kicker", { opacity: 0, y: 20, duration: 0.6, delay: 2 })
      .from(".hero-title", { opacity: 0, y: 30, duration: 0.7 }, "-=0.3")
      .from(".hero-sub", { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
      .from(".hero-buttons", { opacity: 0, y: 20, duration: 0.5 }, "-=0.2")
      .from(".hero-scroll-hint", { opacity: 0, duration: 0.5 }, "-=0.2");
  }

  // --- GSAP SCROLL ANIMATIONS ---
  function initScrollAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // Títulos y kickers
    $$(".section-title").forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        opacity: 0, y: 28, duration: 0.7, ease: "power3.out"
      });
    });
    $$(".section-kicker").forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        opacity: 0, y: 14, duration: 0.5, ease: "power3.out"
      });
    });

    // Paralaje suave en la imagen hero
    var heroBg = $(".hero-bg-img");
    if (heroBg) {
      gsap.to(heroBg, {
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        yPercent: 20, ease: "none"
      });
    }

    // Sección software: slide desde abajo
    var softwareGrid = $(".software-grid");
    if (softwareGrid) {
      gsap.from($$(".software-item"), {
        scrollTrigger: { trigger: softwareGrid, start: "top 80%", once: true },
        opacity: 0, y: 36, duration: 0.6, stagger: 0.12, ease: "power3.out"
      });
    }
  }


  // --- MAGNETIC BUTTONS ---
  function initMagnetic() {
    if (matchMedia("(hover: none)").matches) return;

    $$(".btn-primary, .btn-whatsapp, .nav-cta").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width / 2) * 0.15;
        var y = (e.clientY - rect.top - rect.height / 2) * 0.15;
        btn.style.transform = "translate(" + x + "px, " + y + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  // --- SLIDER (genérico: reseñas, productos) ---
  function initSlider(wrapSel, dotSel, cardSel) {
    var wrap = $(wrapSel);
    var dots = $$(dotSel);
    var cards = $$(cardSel);
    if (!wrap || !cards.length) return;

    function currentIdx() {
      var cardW = cards[0].offsetWidth + 24;
      return Math.round(wrap.scrollLeft / cardW);
    }

    function updateDots() {
      var idx = currentIdx();
      dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
    }

    wrap.addEventListener("scroll", updateDots, { passive: true });

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        wrap.scrollTo({ left: cards[i].offsetLeft, behavior: "smooth" });
      });
    });

    // Mouse drag
    var startX = 0, startScroll = 0, dragging = false;
    wrap.addEventListener("mousedown", function (e) {
      dragging = true;
      startX = e.pageX;
      startScroll = wrap.scrollLeft;
      wrap.classList.add("is-dragging");
    });
    document.addEventListener("mouseup", function () {
      if (!dragging) return;
      dragging = false;
      wrap.classList.remove("is-dragging");
    });
    wrap.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      e.preventDefault();
      wrap.scrollLeft = startScroll - (e.pageX - startX);
    });
    wrap.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  // --- BOOT ---
  function boot() {
    safe(initSplash, "splash");
    safe(initNav, "nav");
    safe(initSmoothScroll, "smoothScroll");

    safe(mountPlans, "mountPlans");
    safe(mountSectors, "mountSectors");
    safe(mountTrust, "mountTrust");

    safe(initReveals, "reveals");
    safe(function () { initSlider(".resenas-track-wrap", ".resenas-dot", ".resena-card"); }, "resenasSlider");
    safe(function () { initSlider(".productos-track-wrap", ".productos-dot", ".producto-card"); }, "productosSlider");
    safe(function () { initSlider(".extras-track-wrap", ".extras-dot", ".extra-card"); }, "extrasSlider");
    safe(initHeroAnimation, "heroAnim");
    safe(initScrollAnimations, "scrollAnim");
    safe(initMagnetic, "magnetic");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
