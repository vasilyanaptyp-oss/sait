(function () {
  var d = document, hdr = d.getElementById('hdr'), burger = d.querySelector('.burger');
  d.documentElement.classList.remove('no-js');

  function onScroll() { hdr.classList.toggle('solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    hdr.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
  }
  burger.addEventListener('click', function () { setMenu(!hdr.classList.contains('open')); });
  d.querySelectorAll('.mnav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hdr.classList.contains('open')) { setMenu(false); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });

  var hero = d.querySelector('.hero-bg img');
  if (hero) {
    if (hero.complete) hero.classList.add('ld');
    else { hero.addEventListener('load', function () { hero.classList.add('ld'); }); hero.addEventListener('error', function () { hero.classList.add('ld'); }); }
  }

  // open now: Mo-Fr 08:00-21:00, Sa-Su 10:00-22:00, Kyiv time
  var now = d.getElementById('now');
  if (now) {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; return ''; };
      var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], day = days.indexOf(get('weekday'));
      var mins = parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10);
      var hours = function (dd) { return dd >= 5 ? [600, 1320] : [480, 1260]; };
      var fmt = function (m) { return (m / 60 < 10 ? '0' : '') + Math.floor(m / 60) + ':00'; };
      if (day >= 0 && !isNaN(mins)) {
        var h = hours(day), txt, open = mins >= h[0] && mins < h[1];
        if (open) txt = 'Зараз відчинено, до ' + fmt(h[1]);
        else if (mins < h[0]) txt = 'Зараз зачинено, відчиняємося о ' + fmt(h[0]);
        else txt = 'Зараз зачинено, завтра відчиняємося о ' + fmt(hours((day + 1) % 7)[0]);
        now.textContent = txt;
        now.classList.toggle('off', !open);
        now.hidden = false;
      }
    } catch (e) { /* no Intl time zone support: the hours table is enough */ }
  }

  var rv = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });
})();
