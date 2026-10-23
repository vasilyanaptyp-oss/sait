(function () {
  var hdr = document.querySelector('.hdr');
  var btn = document.querySelector('.menu-btn');
  var mnav = document.getElementById('mnav');
  var hero = document.querySelector('.hero');

  function onScroll() {
    var lim = hero ? hero.offsetHeight - 80 : 40;
    hdr.classList.toggle('solid', window.scrollY > Math.max(40, lim));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  function setMenu(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Закрити меню' : 'Меню');
    hdr.classList.toggle('open', open);
    mnav.hidden = !open;
  }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

  var form = document.getElementById('form');
  if (form) {
    var err = form.querySelector('.err');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, ok = true;
      ['name', 'contact', 'msg'].forEach(function (k) {
        var bad = !f[k].value.trim();
        f[k].classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      err.hidden = ok;
      if (!ok) { form.querySelector('.invalid').focus(); return; }
      var body = 'Імʼя: ' + f.name.value.trim() + '\nКонтакт: ' + f.contact.value.trim() + '\n\n' + f.msg.value.trim();
      var url = 'mailto:bahroma.lviv@gmail.com?subject=' + encodeURIComponent('Запит з сайту: текстиль для кімнати') +
        '&body=' + encodeURIComponent(body);
      form.setAttribute('data-mailto', url);
      window.location.href = url;
    });
    form.addEventListener('input', function (e) {
      if (e.target.value.trim()) e.target.classList.remove('invalid');
    });
  }
})();
