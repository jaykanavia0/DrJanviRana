/**
 * ScrollExpand Component (React Bits Native Vanilla Implementation)
 * Expands a centered media frame to full bleed upon window scroll with smoothstep transitions
 */

(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const smoothstep = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
    return t * t * (3 - 2 * t);
  };

  function initScrollExpand(rootId, options = {}) {
    const root = document.getElementById(rootId);
    if (!root) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const defaults = {
      startWidth: isMobile ? 86 : 46,
      startHeight: isMobile ? 68 : 60,
      startRadius: isMobile ? 18 : 28,
      endRadius: 0,
      mediaZoom: isMobile ? 1.15 : 1.35,
      scrollDistance: isMobile ? 0.9 : 1.2,
      holdDistance: 0.35,
      smoothing: 0.1,
      overlayScrim: 0.55,
      useWindowScroll: true
    };

    const config = { ...defaults, ...options };

    const track = root.querySelector('.scroll-expand__track');
    const stage = root.querySelector('.scroll-expand__stage');
    const frame = root.querySelector('.scroll-expand__frame');
    const media = root.querySelector('.scroll-expand__media');
    const title = root.querySelector('.scroll-expand__title');
    const hint = root.querySelector('.scroll-expand__hint');
    const overlay = root.querySelector('.scroll-expand__overlay');
    const scrim = root.querySelector('.scroll-expand__scrim');

    if (!track || !stage || !frame || !media) return;

    let stageH = 0;
    let current = 0;
    let target = 0;
    let raf = 0;
    let running = false;

    const applyProgress = p => {
      const e = smoothstep(0, 1, p);

      const w = config.startWidth + (100 - config.startWidth) * e;
      const h = config.startHeight + (100 - config.startHeight) * e;
      const ix = Math.max(0, (100 - w) / 2);
      const iy = Math.max(0, (100 - h) / 2);
      const r = config.startRadius + (config.endRadius - config.startRadius) * e;
      frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

      media.style.transform = `scale(${config.mediaZoom + (1 - config.mediaZoom) * e})`;

      if (scrim) scrim.style.opacity = `${config.overlayScrim * e}`;

      if (title) {
        const out = smoothstep(0.35, 0.82, p);
        title.style.opacity = `${1 - out}`;
        title.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
      }

      if (hint) {
        const gone = smoothstep(0, 0.12, p);
        hint.style.opacity = `${1 - gone}`;
        hint.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
      }

      if (overlay) {
        const inn = smoothstep(0.68, 1, p);
        overlay.style.opacity = `${inn}`;
        overlay.style.transform = `translate3d(0, ${22 * (1 - inn)}px, 0)`;
        overlay.style.pointerEvents = inn > 0.8 ? 'auto' : 'none';
      }
    };

    const measure = () => {
      stageH = config.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, config.scrollDistance) + Math.max(0, config.holdDistance))}px`;

      const w = root.clientWidth || stageH;
      const isSmall = w < 600;
      stage.style.setProperty('--se-title-size', `${clamp(w * (isSmall ? 0.08 : 0.06), 22, 76)}px`);
    };

    const readProgress = () => {
      const span = stageH * Math.max(0.01, config.scrollDistance);
      if (config.useWindowScroll) {
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const k = config.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * config.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (config.smoothing <= 0) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = config.useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollExpand('scroll-expand-section');
  });

  window.initScrollExpand = initScrollExpand;
})();
