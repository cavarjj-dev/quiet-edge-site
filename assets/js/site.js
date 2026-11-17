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
