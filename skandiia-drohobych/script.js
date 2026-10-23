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
  d.querySelectorAll('.mnav a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var h = a.getAttribute('href') || '', t = h.charAt(0) === '#' ? d.getElementById(h.slice(1)) : null;
      setMenu(false);
      if (!t) return;
      e.preventDefault();
      requestAnimationFrame(function () {
        t.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        if (history.replaceState) history.replaceState(null, '', h);
      });
    });
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hdr.classList.contains('open')) { setMenu(false); burger.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });

  var hero = d.querySelector('.hero-bg img');
  if (hero) {
    if (hero.complete) hero.classList.add('ld');
    else { hero.addEventListener('load', function () { hero.classList.add('ld'); }); hero.addEventListener('error', function () { hero.classList.add('ld'); }); }
  }

  var rv = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });
})();
(function () {
  var f = document.getElementById('order-form');
  if (!f) return;
  var MSG = { contact: 'Вкажіть телефон або e-mail', msg: 'Опишіть замовлення' };
  function check(el) {
    var ok = el.value.trim() !== '', box = el.closest('.fl'), err = box && box.querySelector('.f-err');
    el.setCustomValidity(ok ? '' : MSG[el.name]);
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (box) box.classList.toggle('bad', !ok);
    if (!ok && box && !err) { err = document.createElement('span'); err.className = 'f-err'; err.id = el.id + '-err'; box.appendChild(err); el.setAttribute('aria-describedby', err.id); }
    if (err) err.textContent = ok ? '' : MSG[el.name];
    return ok;
  }
  ['contact', 'msg'].forEach(function (n) {
    var el = f.elements[n];
    el.addEventListener('input', function () { if (el.closest('.fl').classList.contains('bad')) check(el); else el.setCustomValidity(''); });
  });
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = check(f.elements.contact), b = check(f.elements.msg);
    if (!a || !b) { var first = !a ? f.elements.contact : f.elements.msg; first.focus({ preventScroll: true }); (first.closest('.f-row') || first.closest('.fl')).scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
    var kind = f.querySelector('input[name=kind]:checked');
    var name = f.elements.name.value.trim(), contact = f.elements.contact.value.trim(), msg = f.elements.msg.value.trim();
    var subj = 'Замовлення: ' + (kind ? kind.value : 'плівка і пакування');
    var body = msg + '\n\n' + (name ? name + '\n' : '') + contact;
    window.location.href = 'mailto:' + f.getAttribute('data-to') + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
  });
})();
