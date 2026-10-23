(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.add('js');
  var hdr = doc.getElementById('hdr'), burger = hdr.querySelector('.burger'), mnav = doc.getElementById('mnav');

  /* mobile menu */
  function setMenu(open) {
    hdr.classList.toggle('open', open);
    root.classList.toggle('menu-open', open);
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
  window.addEventListener('resize', function () { if (window.innerWidth >= 1100 && hdr.classList.contains('open')) setMenu(false); });

  /* header turns solid once the page is scrolled */
  var onScroll = function () { hdr.classList.toggle('solid', window.scrollY > 12); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* reveal on scroll */
  var items = [].slice.call(doc.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* enquiry form: opens the visitor's mail program with a ready letter (window.__noNav lets a test read it) */
  var form = doc.getElementById('cform');
  if (form) {
    var err = form.querySelector('.f-err');
    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid')) { e.target.removeAttribute('aria-invalid'); err.hidden = true; }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, name = f.name.value.trim(), contact = f.contact.value.trim(), msg = f.msg.value.trim();
      var svc = f.svc.options[f.svc.selectedIndex].textContent.trim();
      [f.name, f.contact, f.msg].forEach(function (x) { x.removeAttribute('aria-invalid'); });
      var okContact = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact) || contact.replace(/\D/g, '').length >= 9;
      var bad = name.length < 2 ? [f.name, 'Напишіть, будь ласка, ваше ім’я.']
        : (!okContact ? [f.contact, 'Вкажіть телефон або e-mail, щоб ми могли відповісти.']
        : (msg.length < 5 ? [f.msg, 'Коротко опишіть вашу ситуацію.'] : null));
      if (bad) { bad[0].setAttribute('aria-invalid', 'true'); err.textContent = bad[1]; err.hidden = false; bad[0].focus(); return; }
      err.hidden = true;
      var body = 'Ім’я: ' + name + '\nТелефон або e-mail: ' + contact + '\nТема: ' + svc + '\n\n' + msg;
      var url = 'mailto:' + form.getAttribute('data-mail') + '?subject=' + encodeURIComponent('Запит з сайту: ' + svc) + '&body=' + encodeURIComponent(body);
      window.__mailto = url;
      if (!window.__noNav) window.location.href = url;
    });
  }
})();
