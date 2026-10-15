/* =========================================================
   nplus — main.js
   ========================================================= */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Loader (full animation only on first visit per session) ---------- */
  const loader = $('#loader');
  let seen = false;
  try { seen = sessionStorage.getItem('nplus-loaded') === '1'; } catch (e) { /* storage blocked */ }

  const finishLoading = () => {
    loader.classList.add('is-done');
    document.body.classList.add('is-loaded');
    try { sessionStorage.setItem('nplus-loaded', '1'); } catch (e) { /* noop */ }
  };

  if (!loader || seen || reduceMotion) {
    if (loader) loader.style.display = 'none';
    requestAnimationFrame(() => document.body.classList.add('is-loaded'));
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-gather'), 700);
      setTimeout(() => loader.classList.add('is-logo'), 1150);
      setTimeout(finishLoading, 1900);
    });
    // Safety net in case the load event is slow (fonts etc.)
    setTimeout(finishLoading, 4500);
  }

  /* ---------- Header: shrink on scroll / hide on scroll down ---------- */
  const header = $('#header');
  const totop = $('#totop');
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    header.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
    totop.classList.toggle('is-show', y > 600);
    lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  const burger = $('#burger');
  const drawer = $('#drawer');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', drawer).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Split section titles into letters ---------- */
  $$('[data-split]').forEach((el) => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.innerHTML = [...text].map((c, i) =>
      `<span class="ch" aria-hidden="true" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');
  });

  /* ---------- Scroll reveal ---------- */
  const targets = $$('.reveal, [data-split]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Current section highlight in nav ---------- */
  const navLinks = $$('.gnav a[href^="#"]');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => navIO.observe(s));
  }

  /* ---------- Hero art: mouse + scroll parallax ---------- */
  const art = $('#heroArt');
  if (art && !reduceMotion) {
    const layers = $$('.px', art).map((el) => ({ el, depth: parseFloat(el.dataset.depth) || 0 }));
    let mx = 0, my = 0, sy = 0, raf = null;

    const render = () => {
      layers.forEach(({ el, depth }) => {
        const x = mx * depth * 22;
        const y = my * depth * 22 - sy * depth * 0.12;
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      });
      raf = null;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(render); };

    if (window.matchMedia('(hover: hover)').matches) {
      window.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
        queue();
      }, { passive: true });
    }
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.2) { sy = window.scrollY; queue(); }
    }, { passive: true });
  }

  /* ---------- Tilt on tiles / cases (pointer devices only) ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    $$('.tile, .case').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- FAQ accordion ---------- */
  $$('.qa').forEach((qa) => {
    const btn = $('.qa__q', qa);
    const panel = $('.qa__a', qa);
    const id = 'qa-' + Math.random().toString(36).slice(2, 8);
    panel.id = id;
    btn.setAttribute('aria-controls', id);

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (open) {
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(() => { panel.style.height = '0px'; });
      } else {
        panel.style.height = panel.scrollHeight + 'px';
        const done = () => {
          if (btn.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';
          panel.removeEventListener('transitionend', done);
        };
        panel.addEventListener('transitionend', done);
        if (reduceMotion) done();
      }
    });
  });

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    $$('.btn--primary, .btn--white').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.15;
        const y = (e.clientY - r.top - r.height / 2) * 0.25;
        btn.style.transform = `translate(${x - 2}px, ${y - 2}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }
})();
