(function () {
  var d = document, hdr = d.getElementById('hdr'), burger = d.querySelector('.burger');
  d.documentElement.classList.remove('no-js');

  function onScroll() { hdr.classList.toggle('solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    hdr.classList.toggle('open', open);
    d.documentElement.classList.toggle('menu-open', open);
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

  var tiles = d.querySelector('.tiles'), dots = d.querySelectorAll('.dots i');
  if (tiles && dots.length) {
    tiles.addEventListener('scroll', function () {
      var items = tiles.children, best = 0, min = 1e9, x = tiles.getBoundingClientRect().left;
      for (var i = 0; i < items.length; i++) { var dd = Math.abs(items[i].getBoundingClientRect().left - x - 20); if (dd < min) { min = dd; best = i; } }
      if (tiles.scrollLeft + tiles.clientWidth >= tiles.scrollWidth - 4) best = items.length - 1;
      dots.forEach(function (el, k) { el.classList.toggle('on', k === best); });
    }, { passive: true });
  }

  var rv = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });
})();
