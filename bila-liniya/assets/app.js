/* Біла Лінія: header state, reveal on scroll, booking form -> prepared message */
(function () {
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = window.BL_T || {};
  var PHONE = '+380982814904';

  // hero intro
  var hero = d.querySelector('.hero');
  requestAnimationFrame(function () { requestAnimationFrame(function () { hero && hero.classList.add('loaded'); }); });

  // header solid after the first screen part, sticky bar after hero
  var hdr = d.querySelector('.hdr'), bar = d.querySelector('.bar'), visit = d.querySelector('.visit');
  function onScroll() {
    var y = window.scrollY || 0;
    hdr && hdr.classList.toggle('solid', y > 40);
    if (bar && hero) {
      var inForm = false;
      if (visit) { var r = visit.getBoundingClientRect(); inForm = r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4; }
      bar.classList.toggle('on', y > hero.offsetHeight * 0.85 && !inForm);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // reveal
  var els = d.querySelectorAll('[data-r], .steps');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  // booking form
  var form = d.getElementById('bookForm');
  if (!form) return;
  var ready = d.getElementById('ready'), pre = d.getElementById('readyText');
  var aSms = d.getElementById('sendSms'), aVb = d.getElementById('sendViber'), aTg = d.getElementById('sendTg');
  var copied = d.getElementById('copied');

  function val(n) { var e = form.elements[n]; return e ? String(e.value || '').trim() : ''; }
  function setErr(name, msg) {
    var inp = form.elements[name], box = d.getElementById('err-' + name);
    if (inp) inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (box) box.textContent = msg || '';
  }

  // service preselect from any [data-svc] link
  d.querySelectorAll('[data-svc]').forEach(function (a) {
    a.addEventListener('click', function () {
      var s = form.elements.service; if (!s) return;
      for (var i = 0; i < s.options.length; i++) if (s.options[i].value === a.getAttribute('data-svc')) s.selectedIndex = i;
    });
  });

  function copy(text) {
    var ok = false;
    try {
      var ta = d.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; d.body.appendChild(ta); ta.select();
      ok = d.execCommand('copy'); d.body.removeChild(ta);
    } catch (e) { ok = false; }
    if (!ok && navigator.clipboard && window.isSecureContext) {
      try { navigator.clipboard.writeText(text).catch(function () {}); ok = true; } catch (e) {}
    }
    return ok;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var name = val('name'), tel = val('phone'), digits = tel.replace(/\D/g, '');
    var bad = false;
    setErr('name', ''); setErr('phone', '');
    if (name.length < 2) { setErr('name', T.errName || 'Вкажіть ім’я'); bad = true; }
    if (digits.length < 9) { setErr('phone', T.errPhone || 'Вкажіть телефон'); bad = true; }
    if (bad) { (name.length < 2 ? form.elements.name : form.elements.phone).focus(); return; }

    var lines = [
      T.hello || 'Добрий день! Хочу записатися.',
      (T.lName || 'Ім’я') + ': ' + name,
      (T.lPhone || 'Телефон') + ': ' + tel,
      (T.lSvc || 'Послуга') + ': ' + val('service'),
      (T.lTime || 'Коли зручно') + ': ' + val('time')
    ];
    var text = lines.join('\n');
    pre.textContent = text;
    var enc = encodeURIComponent(text);
    var ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    aSms.href = 'sms:' + PHONE + (ios ? '&' : '?') + 'body=' + enc;
    ready.classList.add('on');
    copied.textContent = '';
    ready.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    ready.querySelector('h3').focus({ preventScroll: true });
  });

  [aVb, aTg].filter(Boolean).forEach(function (a) {
    if (!a) return;
    a.addEventListener('click', function () {
      var ok = copy(pre.textContent || '');
      copied.textContent = ok ? (T.copied || 'Текст скопійовано, вставте його в чат.') : (T.copyFail || '');
    });
  });
})();
