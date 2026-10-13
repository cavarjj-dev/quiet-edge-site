// The Quiet Edge: tiny progressive enhancements. Site works without JS.
(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Hide founding-offer elements after their end date (data-expires="YYYY-MM-DDTHH:MM:SS-05:00").
  var now = Date.now();
  document.querySelectorAll('[data-expires]').forEach(function (el) {
    var end = Date.parse(el.getAttribute('data-expires'));
    if (!isNaN(end) && now > end) el.hidden = true;
  });

  // Club inquiry: build a pre-filled email in the visitor's mail app.
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
