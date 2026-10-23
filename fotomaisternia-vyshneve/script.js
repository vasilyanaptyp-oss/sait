(function () {
  'use strict';
  var d = document, html = d.documentElement, hdr = d.getElementById('hdr'), burger = d.querySelector('.burger');

  // header turns solid after the hero top
  function onScroll() { hdr.classList.toggle('solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // phone menu
  function setMenu(open) {
    hdr.classList.toggle('open', open);
    html.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Меню');
  }
  burger.addEventListener('click', function () { setMenu(!hdr.classList.contains('open')); });
  d.querySelectorAll('.mnav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hdr.classList.contains('open')) { setMenu(false); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 900 && hdr.classList.contains('open')) setMenu(false); });

  // reveal on scroll
  var rv = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  // today in the hours table and "open now" (Kyiv time): Mon-Fri 10-19, Sat 10-16, Sun closed
  try {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; return ''; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var mins = parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10);
    if (day >= 0 && !isNaN(mins)) {
      var row = d.querySelector('.hours tr[data-d="' + day + '"]');
      if (row) row.classList.add('today');
      var close = day === 0 ? 0 : (day === 6 ? 16 * 60 : 19 * 60);
      var open = close && mins >= 600 && mins < close;
      var txt;
      if (open) txt = 'Зараз відчинено до ' + (close / 60) + ':00';
      else if (day !== 0 && day !== 6 && mins < 600) txt = 'Зачинено, відчиняємося о 10:00';
      else if (day === 6 && mins < 600) txt = 'Зачинено, відчиняємося о 10:00';
      else if (day === 6 || day === 0) txt = 'Зачинено, відчиняємося в понеділок о 10:00';
      else txt = 'Зачинено, відчиняємося завтра о 10:00';
      d.querySelectorAll('[data-now]').forEach(function (el) {
        el.textContent = txt; el.hidden = false; el.classList.toggle('closed', !open);
      });
    }
  } catch (e) { /* the static table is enough */ }
})();
