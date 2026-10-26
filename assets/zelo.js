/* ZELO — comportamento compartilhado: cabeçalho, menu, revelações,
   contadores, carrosséis e pausa da animação do hero. */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Cabeçalho e botão flutuante ---------- */
  const header = document.querySelector('[data-header]');
  const hero = document.querySelector('[data-hero]');
  const floatBtn = document.querySelector('[data-float]');
  const onScroll = () => {
    const heroH = hero ? hero.offsetHeight : 0;
    const y = window.scrollY;
    if (header) header.classList.toggle('is-solid', y > Math.max(heroH - 90, 40));
    if (floatBtn) floatBtn.classList.toggle('is-visible', y > (heroH ? heroH * 0.7 : 240));
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------- Menu em faixas ---------- */
  const menu = document.getElementById('z-menu');
  const openBtn = document.querySelector('[data-menu-open]');
  if (menu && openBtn) {
    const closeBtn = menu.querySelector('[data-menu-close]');
    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      menu.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      closeBtn && closeBtn.focus();
    };
    const close = (restoreFocus = true) => {
      menu.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduce ? 0 : 500);
      if (restoreFocus && lastFocus) lastFocus.focus();
    };
    openBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', () => close());
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) close(false); });
    document.addEventListener('keydown', (e) => {
      if (menu.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { // mantém o foco dentro do menu
        const items = [...menu.querySelectorAll('a, button')];
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Revelações e contadores ---------- */
  const formatNum = (n, decimals) => n.toFixed(decimals).replace('.', ',');
  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduce || !('requestAnimationFrame' in window)) { el.textContent = pre + formatNum(target, decimals) + suf; return; }
    const dur = 1600; const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + formatNum(target * eased, decimals) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const revealTargets = document.querySelectorAll('[data-reveal], .z-ring, .z-map, [data-count]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-in');
        if (el.dataset.count) runCount(el);
        io.unobserve(el);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => { el.classList.add('is-in'); if (el.dataset.count) runCount(el); });
  }

  /* ---------- Carrosséis ---------- */
  document.querySelectorAll('[data-carousel]').forEach((wrap) => {
    const track = wrap.querySelector('[data-track]');
    const prev = wrap.querySelector('[data-prev]');
    const next = wrap.querySelector('[data-next]');
    const index = wrap.querySelector('[data-index]');
    if (!track) return;
    const items = [...track.children];
    const step = () => (items[1] ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth);
    const current = () => Math.round(track.scrollLeft / Math.max(step(), 1));
    const update = () => {
      wrap.classList.toggle('is-static', track.scrollWidth <= track.clientWidth + 4);
      const maxScroll = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= maxScroll;
      if (index) {
        const i = track.scrollLeft >= maxScroll ? items.length - 1 : current();
        index.textContent = String(Math.min(i, items.length - 1) + 1).padStart(2, '0');
      }
    };
    prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- Pausa a estrada quando o hero sai da tela ---------- */
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => hero.classList.toggle('is-paused', !e.isIntersecting)).observe(hero);
  }
  document.addEventListener('visibilitychange', () => { if (hero) hero.classList.toggle('is-paused', document.hidden); });

  /* ---------- Movimento das outras telas: só roda com a seção visível ---------- */
  const players = document.querySelectorAll('[data-play]');
  const smil = (el, play) => el.querySelectorAll('svg[data-smil]').forEach((svg) => {
    if (!svg.pauseAnimations) return;
    if (play) svg.unpauseAnimations(); else svg.pauseAnimations();
  });
  players.forEach((el) => smil(el, false)); // tudo começa parado
  if (!reduce && 'IntersectionObserver' in window) {
    const po = new IntersectionObserver((entries) => entries.forEach((e) => {
      e.target.classList.toggle('is-playing', e.isIntersecting);
      smil(e.target, e.isIntersecting);
    }), { threshold: 0.05 });
    players.forEach((el) => po.observe(el));
  }
  /* ---------- História em fotos no topo (troca de cena automática) ---------- */
  document.querySelectorAll('[data-story]').forEach((story) => {
    const imgs = [...story.querySelectorAll('.z-story__img')];
    const steps = [...story.querySelectorAll('.z-story__step')];
    const dur = parseInt(story.dataset.story, 10) || 5000;
    story.style.setProperty('--story-dur', dur + 'ms');
    let i = 0, timer = null, visible = true;
    const show = (n) => {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach((im, k) => im.classList.toggle('is-active', k === i));
      steps.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const play = () => { stop(); if (!reduce && visible && !document.hidden) timer = setInterval(() => show(i + 1), dur); };
    steps.forEach((s, k) => s.addEventListener('click', () => { show(k); play(); }));
    show(0); play();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? play() : stop(); }).observe(story);
    }
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
  });

  /* ---------- Fluxo de segurança: as etapas acendem em sequência ---------- */
  document.querySelectorAll('[data-flow]').forEach((flow) => {
    const steps = [...flow.querySelectorAll('.z-flow__step')];
    let k = -1, timer = null;
    const paint = () => steps.forEach((s, n) => { s.classList.toggle('is-done', n < k); s.classList.toggle('is-current', n === k); });
    if (reduce || !('IntersectionObserver' in window)) { k = steps.length; paint(); return; }
    const tick = () => {
      k = k >= steps.length ? -1 : k + 1;
      paint();
      timer = setTimeout(tick, k === steps.length ? 2800 : (k === -1 ? 700 : 1300));
    };
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!timer) tick(); }
      else { clearTimeout(timer); timer = null; }
    }, { threshold: 0.3 }).observe(flow);
  });

  /* ---------- Esconde a barra fixa enquanto o teclado está aberto ---------- */
  document.addEventListener('focusin', (e) => { if (e.target.matches('input, select, textarea')) document.body.classList.add('has-input-focus'); });
  document.addEventListener('focusout', (e) => { if (e.target.matches('input, select, textarea')) document.body.classList.remove('has-input-focus'); });
})();
