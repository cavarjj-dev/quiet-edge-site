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
    var frame = document.querySelector('.opening-frame');
    var bg = openingBg();
    var startClip = mobile ? 'inset(32% 10% 38% 10%)' : 'inset(34% 27% 34% 27%)';
    var frameFrom = mobile
      ? { left: '10%', right: '10%', top: '32%', bottom: '38%' }
      : { left: '27%', right: '27%', top: '34%', bottom: '34%' };
    gsap.timeline({
      scrollTrigger: {
        trigger: '#opening',
        start: 'top ' + ((document.querySelector('.site-header') || {}).offsetHeight || 74) + 'px',
        end: mobile ? '+=90%' : '+=170%',
        pin: '.opening-pin',
        scrub: mobile ? 0.4 : 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    })
      .fromTo(win, { clipPath: startClip }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 }, 0)
      .fromTo(frame, frameFrom, { left: '0%', right: '0%', top: '0%', bottom: '0%', opacity: 0, ease: 'none', duration: 1 }, 0)
      .fromTo(bg, { scale: 1 }, { scale: 1.06, ease: 'none', duration: 1 }, 0)
      .fromTo('.opening-field', { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.28 }, 0.72);
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
