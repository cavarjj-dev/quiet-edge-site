// The Quiet Edge. Works without this file.
// Scroll reveals use IntersectionObserver. The hero draw is CSS.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = document.querySelector('.site-header');
  function setBar() {
    if (!header) return;
    var bottom = header.getBoundingClientRect().bottom;
    document.documentElement.style.setProperty('--bar', Math.max(0, Math.round(bottom)) + 'px');
  }
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    if (document.body.classList.contains('menu-open')) setBar();
  }
  setBar();
  onScroll();
  window.addEventListener('resize', setBar, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  var main = document.getElementById('main');
  var footer = document.querySelector('.site-footer');
  function setInert(on) {
    if (main) main.inert = on;
    if (footer) footer.inert = on;
  }
  function closeMenu(restore) {
    if (!btn || !menu) return;
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    setInert(false);
    if (restore) btn.focus();
  }
  function openMenu() {
    if (!btn || !menu) return;
    setBar();
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    setInert(true);
    var first = menu.querySelector('a');
    if (first) first.focus();
  }
  if (btn && menu) {
    btn.addEventListener('click', function () {
      if (menu.classList.contains('open')) closeMenu(true);
      else openMenu();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu(true);
    });
    var desktop = window.matchMedia('(min-width: 861px)');
    if (desktop.addEventListener) {
      desktop.addEventListener('change', function (e) { if (e.matches) closeMenu(false); });
    }
  }

  var revealEls = document.querySelectorAll('[data-reveal]');
  function markInView() {
    var vh = window.innerHeight || 800;
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 && r.bottom > 0) el.classList.add('is-in');
    });
  }
  if (!reduce && revealEls.length && 'IntersectionObserver' in window) {
    markInView();
    document.documentElement.classList.add('motion');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.14 });
    revealEls.forEach(function (el) {
      if (!el.classList.contains('is-in')) io.observe(el);
    });
    window.addEventListener('load', markInView);
  }

  var now = Date.now();
  document.querySelectorAll('[data-expires]').forEach(function (el) {
    var end = Date.parse(el.getAttribute('data-expires'));
    if (!isNaN(end) && now > end) el.hidden = true;
  });

  initExperience();

  document.querySelectorAll('a.lite-play').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('data-video');
      var frame = link.closest('.lite-frame');
      if (!id || !frame) return;
      e.preventDefault();
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      iframe.title = link.getAttribute('data-title') || 'The Quiet Edge introduction';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.replaceChildren(iframe);
    });
  });

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function initCounts() {
    if (reduce) return;
    var nodes = document.querySelectorAll('.count');
    if (!nodes.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var to = parseFloat(el.getAttribute('data-to'));
        if (isNaN(to)) return;
        var decimals = (el.getAttribute('data-to').split('.')[1] || '').length;
        var t0 = performance.now();
        function tick(now) {
          var p = Math.min(1, (now - t0) / 900);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = to * eased;
          el.textContent = decimals ? val.toFixed(decimals) : String(Math.round(val));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    nodes.forEach(function (el) { io.observe(el); });
  }

  function initExperience() {
    initCounts();
    var opening = document.getElementById('opening');
    if (!opening || reduce) return;
    var save = navigator.connection && navigator.connection.saveData;
    if (save) return;
    var mobile = window.matchMedia('(max-width: 800px)').matches;
    document.documentElement.classList.add('cinematic');
    loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js')
      .then(function () { return loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js'); })
      .then(function () {
        var fine = window.matchMedia('(pointer: fine)').matches && !mobile;
        if (!fine) return null;
        return loadScript('https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js');
      })
      .then(function () { buildOpening(mobile); })
      .catch(function () { document.documentElement.classList.remove('cinematic'); });
  }

  function buildOpening(mobile) {
    if (!window.gsap || !window.ScrollTrigger) {
      document.documentElement.classList.remove('cinematic');
      return;
    }
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis && !mobile) {
      var lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      window.__lenis = lenis;
    }
    var win = document.getElementById('opening-window');
    var glass = document.querySelector('.opening-glass');
    var bg = openingBg();
    var shape = [[-28, -8], [-22, -16], [-12, -19], [0, -20], [12, -19], [22, -16], [28, -8], [36, 4], [40, 16], [34, 24], [18, 27], [0, 29], [-18, 27], [-34, 24], [-40, 16], [-36, 4]];
    function at(spread) {
      return shape.map(function (o) { return [50 + o[0] * spread, 44 + o[1] * spread]; });
    }
    function poly(pts) {
      return 'polygon(' + pts.map(function (p) { return p[0].toFixed(2) + '% ' + p[1].toFixed(2) + '%'; }).join(', ') + ')';
    }
    function box(pts) {
      var xs = pts.map(function (p) { return p[0]; });
      var ys = pts.map(function (p) { return p[1]; });
      var l = Math.min.apply(null, xs), r = Math.max.apply(null, xs);
      var t = Math.min.apply(null, ys), b = Math.max.apply(null, ys);
      return { left: l + '%', top: t + '%', width: (r - l) + '%', height: (b - t) + '%' };
    }
    var dot = at(0.015), small = at(0.34), mid = at(0.66), large = at(1.05);
    var full = [[0, 0], [18, 0], [36, 0], [50, 0], [64, 0], [82, 0], [100, 0], [100, 35], [100, 70], [100, 100], [68, 100], [50, 100], [32, 100], [0, 100], [0, 70], [0, 35]];
    var stops = [{ at: 0, pts: dot }, { at: 0.14, pts: small }, { at: 0.4, pts: mid }, { at: 0.62, pts: large }, { at: 0.8, pts: full }];
    function lerp(a, b, t) { return a + (b - a) * t; }
    function span(p, a, b) { return Math.max(0, Math.min(1, (p - a) / (b - a))); }
    function mix(p) {
      var i = 0;
      while (i < stops.length - 2 && p > stops[i + 1].at) i++;
      var t = span(p, stops[i].at, stops[i + 1].at);
      return stops[i].pts.map(function (pt, n) {
        return [lerp(pt[0], stops[i + 1].pts[n][0], t), lerp(pt[1], stops[i + 1].pts[n][1], t)];
      });
    }
    function apply(p) {
      var pts = mix(p);
      var b = box(pts);
      win.style.clipPath = poly(pts);
      glass.style.left = b.left;
      glass.style.top = b.top;
      glass.style.width = b.width;
      glass.style.height = b.height;
      glass.style.opacity = String(span(p, 0.08, 0.16) * (1 - span(p, 0.68, 0.8)));
      var glow = document.querySelector('.opening-glow');
      if (glow) glow.style.opacity = String(1 - span(p, 0.02, 0.12));
      if (bg) bg.style.transform = 'scale(' + (1 + 0.06 * p) + ')';
      var field = document.querySelector('.opening-field');
      if (field) field.style.opacity = String(span(p, 0.9, 1));
    }
    apply(0);
    ScrollTrigger.create({
      trigger: '#opening',
      start: 'top ' + ((document.querySelector('.site-header') || {}).offsetHeight || 74) + 'px',
      end: mobile ? '+=110%' : '+=180%',
      pin: '.opening-pin',
      scrub: mobile ? 0.35 : 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function (self) { apply(self.progress); }
    });
  }

  function openingBg() {
    return document.querySelector('.opening-bg img');
  }

  var form = document.getElementById('club-inquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var val = function (n) { return (f[n] && f[n].value || '').trim(); };
      var org = val('org') || 'our club';
      var subject = 'Club license inquiry: ' + org;
      var body = [
        'Name: ' + val('name'),
        'Role: ' + val('role'),
        'Organization: ' + val('org'),
        'Sport(s): ' + val('sport'),
        'Approx. teams / athletes: ' + val('size'),
        'Interested in: ' + val('tier'),
        'Hoping to start: ' + val('start'),
        '',
        val('message')
      ].join('\n');
      window.location.href = 'mailto:hello@thequietedgeexperience.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var note = document.getElementById('form-note');
      if (note) note.hidden = false;
    });
  }
})();
