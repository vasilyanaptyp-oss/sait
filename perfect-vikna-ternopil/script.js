(() => {
  document.documentElement.classList.remove('no-js');
  const hdr = document.getElementById('hdr');
  const burger = hdr.querySelector('.burger');

  // header turns solid after the hero top
  const onScroll = () => hdr.classList.toggle('solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // phone menu
  const setMenu = (open) => {
    hdr.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Меню');
  };
  burger.addEventListener('click', () => setMenu(!hdr.classList.contains('open')));
  hdr.querySelectorAll('.mnav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && hdr.classList.contains('open')) { setMenu(false); burger.focus(); } });
  document.addEventListener('click', (e) => { if (hdr.classList.contains('open') && !hdr.contains(e.target)) setMenu(false); });

  // open now? (Kyiv time; Mon-Fri 09:00-18:00, Sat-Sun 09:00-15:00)
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(new Date()).reduce((o, p) => (o[p.type] = p.value, o), {});
    const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(parts.weekday) + 1;
    const mins = (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10);
    if (day > 0) {
      const close = day <= 5 ? 18 * 60 : 15 * 60;
      const open = mins >= 9 * 60 && mins < close;
      document.querySelectorAll('.hours tr').forEach((tr) => { if (day >= +tr.dataset.from && day <= +tr.dataset.to) tr.classList.add('today'); });
      const st = document.querySelector('[data-status]');
      if (st) {
        st.classList.add(open ? 'on' : 'off');
        let txt;
        if (open) txt = `Відчинено до ${close / 60}:00`;
        else if (mins < 9 * 60) txt = 'Сьогодні з 09:00';
        else txt = 'Зачинено, завтра з 09:00';
        st.querySelector('span').textContent = txt;
      }
    }
  } catch (e) { /* keep the static hours */ }

  // reveal on scroll
  const rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach((el) => io.observe(el));
  } else rv.forEach((el) => el.classList.add('in'));

  // contact form -> prepared e-mail
  const form = document.getElementById('cform');
  const err = form.querySelector('.f-err');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = form.elements;
    const missing = [];
    [['name', 'ім’я'], ['phone', 'телефон']].forEach(([n, label]) => {
      const ok = f[n].value.trim().length > 1;
      f[n].setAttribute('aria-invalid', String(!ok));
      if (!ok) missing.push([n, label]);
    });
    if (missing.length) {
      err.textContent = 'Вкажіть, будь ласка, ' + missing.map((m) => m[1]).join(' і ') + '.';
      err.hidden = false;
      f[missing[0][0]].focus();
      return;
    }
    err.hidden = true;
    const need = form.querySelector('input[name=need]:checked').value;
    const subject = `Запит з сайту: ${need.toLowerCase()}`;
    const body = [`Ім’я: ${f.name.value.trim()}`, `Телефон: ${f.phone.value.trim()}`, `Що потрібно: ${need}`, '', f.msg.value.trim()].join('\n');
    const url = `mailto:te040494dd@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.__mailto = url;
    if (!window.__noNav) window.location.href = url;
  });
})();
