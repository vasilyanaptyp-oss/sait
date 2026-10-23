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

  // reveal on scroll
  const rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }),
      { rootMargin: '0px 0px 6% 0px', threshold: 0 });
    rv.forEach((el) => io.observe(el));
  } else rv.forEach((el) => el.classList.add('in'));

  // opening hours: mark today (Kyiv time)
  try {
    const wd = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Kyiv', weekday: 'short' }).format(new Date());
    const n = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[wd];
    const li = document.querySelector(`#week li[data-d="${n}"]`);
    if (li) li.classList.add('today');
  } catch (e) { /* no highlight */ }

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
    const body = [`Ім’я: ${f.name.value.trim()}`, `Телефон: ${f.phone.value.trim()}`, `Що цікавить: ${need}`, `Що шукаю і на який час: ${f.msg.value.trim()}`].join('\n');
    const url = `mailto:prokat-ditkam@yandex.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.__mailto = url;
    if (!window.__noNav) window.location.href = url;
  });
})();
