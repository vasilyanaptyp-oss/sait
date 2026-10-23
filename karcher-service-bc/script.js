(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var hdr = doc.getElementById('hdr'), burger = hdr.querySelector('.burger'), mnav = doc.getElementById('mnav');

  /* header turns solid over the light sections */
  var hero = doc.querySelector('.hero');
  function onScroll() {
    var lim = hero ? hero.offsetHeight - 90 : 80;
    hdr.classList.toggle('solid', window.scrollY > lim);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  function setMenu(open) {
    hdr.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Меню');
  }
  burger.addEventListener('click', function () { setMenu(!hdr.classList.contains('open')); });
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hdr.classList.contains('open')) { setMenu(false); burger.focus(); }
  });
  doc.addEventListener('click', function (e) {
    if (hdr.classList.contains('open') && !hdr.contains(e.target)) setMenu(false);
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 1060) setMenu(false); });

  /* reveal on scroll */
  var rv = doc.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(rv, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(rv, function (el) { el.classList.add('in'); });
  }

  /* opening hours: today's row and "open now" in Kyiv time */
  var H = { 1: ['09:00', '18:00'], 2: ['10:00', '18:00'], 3: ['10:00', '18:00'], 4: ['10:00', '18:00'], 5: ['10:00', '18:00'], 6: ['10:00', '14:00'] };
  var NAMES = ['у неділю', 'у понеділок', 'у вівторок', 'у середу', 'у четвер', 'у пʼятницю', 'у суботу'];
  try {
    var fmt = function (tz) { return new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); };
    var tzf; try { tzf = fmt('Europe/Kyiv'); } catch (e1) { tzf = fmt('Europe/Kiev'); }
    var parts = tzf.formatToParts(new Date());
    var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; return ''; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var now = get('hour') + ':' + get('minute');
    var row = doc.querySelector('#hours li[data-d="' + day + '"]');
    if (row) row.classList.add('today');
    var el = doc.getElementById('now'), h = H[day], msg, open = false;
    if (h && now >= h[0] && now < h[1]) { msg = 'Зараз відчинено, до ' + h[1]; open = true; }
    else if (h && now < h[0]) { msg = 'Зараз зачинено, відчинимо о ' + h[0]; }
    else {
      var n = (day + 1) % 7; while (!H[n]) n = (n + 1) % 7;
      msg = 'Зараз зачинено, відчинимо ' + (n === (day + 1) % 7 ? 'завтра' : NAMES[n]) + ' о ' + H[n][0];
    }
    if (el && day >= 0) { el.textContent = msg; el.classList.toggle('open', open); el.hidden = false; }
  } catch (e) { /* the static table is enough */ }

  /* contact form: builds a letter in the visitor's mail program */
  var form = doc.getElementById('cform');
  if (form) {
    var err = form.querySelector('.f-err');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, miss = null;
      ['name', 'contact', 'msg'].forEach(function (n) {
        var ok = f[n].value.trim().length > 0;
        f[n].setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok && !miss) miss = f[n];
      });
      if (miss) { err.hidden = false; miss.focus(); return; }
      err.hidden = true;
      var body = f.msg.value.trim() + '\n\n' + f.name.value.trim() + '\n' + f.contact.value.trim();
      var url = 'mailto:vs@servisto.com.ua?subject=' + encodeURIComponent('Запит із сайту: ' + f.name.value.trim()) +
        '&body=' + encodeURIComponent(body);
      window.__mailto = url;
      if (!window.__noNav) window.location.href = url;
    });
    form.addEventListener('input', function (e) {
      if (e.target.value.trim()) e.target.setAttribute('aria-invalid', 'false');
    });
  }
})();
