/**
 * OptionWheel Component (React Bits Native Vanilla Implementation)
 * Interactive curved 3D option wheel navigation menu with physics drag & easing
 */

(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const DEFAULT_MENU_ITEMS = [
    {
      label: 'About Dr. Janvi',
      tag: 'Clinical Profile',
      title: 'Dr. Janvi Rana (PT)',
      desc: 'BPT from Govt. Physiotherapy College Surat • VNSGU. 6 months intensive rotatory clinical internship across Civil Hospital high-acuity wards.',
      href: '#about-doctor',
      ctaText: 'View Profile'
    },
    {
      label: 'Surat In-Home Care',
      tag: '1-on-1 Personalized Visits',
      title: 'Direct In-Home Visits',
      desc: 'Specialized home rehabilitation across Adajan, Vesu, Piplod, Pal, VIP Road, and Athwa Lines with portable clinical equipment.',
      href: '#features',
      ctaText: 'Explore Home Care'
    },
    {
      label: 'Virtual Rehab',
      tag: 'Anywhere Consultation',
      title: 'HD Virtual Sessions',
      desc: 'Biomechanical screen analysis, guided posture corrections, and personalized recovery prescription anywhere via secure video.',
      href: '#virtual-care',
      ctaText: 'Book Virtual Call'
    },
    {
      label: 'Conditions & Specializations',
      tag: 'Targeted Therapies',
      title: 'Clinical Specialties',
      desc: 'Evidence-based protocols for Post-Op Orthopedic, Spine & Sciatica, Neurological & Stroke Recovery, and Frozen Shoulder.',
      href: '#pathologien',
      ctaText: 'View Conditions'
    },
    {
      label: 'Patient Reviews',
      tag: 'Patient Recovery Stories',
      title: 'Verified Testimonials',
      desc: 'Read real rehabilitation journeys from Surat professionals, athletes, and post-surgery patients restored to pain-free mobility.',
      href: '#testimonials',
      ctaText: 'Read Reviews'
    },
    {
      label: 'Surat Coverage Areas',
      tag: 'Neighborhood Network',
      title: 'Prompt Regional Coverage',
      desc: 'Direct doorstep clinical visits delivered daily to Adajan, Pal, Vesu, City Light, Piplod, VIP Road, and Athwa Lines.',
      href: '#medwest-footer-content',
      ctaText: 'View Coverage'
    },
    {
      label: 'Clinical Credentials',
      tag: 'Medical Verification',
      title: 'Verified Qualifications',
      desc: 'Review academic degrees, state registration, hospital ward experience, and ongoing certifications.',
      modal: 'left',
      ctaText: 'Open Credentials'
    },
    {
      label: 'Book Surat Home Visit',
      tag: 'Direct Reservation',
      title: 'Schedule In-Home Visit',
      desc: 'Reserve a priority 1-on-1 clinical session at your home anywhere across Surat.',
      modal: 'right',
      mode: 'visit',
      ctaText: 'Reserve Visit'
    },
    {
      label: 'Book Virtual Consultation',
      tag: 'Online Triage',
      title: 'Schedule Virtual Session',
      desc: 'Instant video assessment, exercise prescription, and ergonomics evaluation.',
      modal: 'right',
      mode: 'virtual',
      ctaText: 'Reserve Online'
    }
  ];

  function initOptionWheel(containerId, options = {}) {
    const root = document.getElementById(containerId);
    if (!root) return;

    const items = options.items || DEFAULT_MENU_ITEMS;
    const defaults = {
      defaultSelected: 0,
      textColor: '#8E9E99',
      activeColor: '#0F2C27',
      side: 'left',
      fontSize: window.innerWidth < 992 ? 1.85 : 2.5,
      spacing: 1.35,
      curve: 1,
      tilt: 6,
      blur: 1.5,
      fade: 0.28,
      minOpacity: 0.08,
      smoothing: 200,
      inset: window.innerWidth < 992 ? 24 : 70,
      loop: false,
      draggable: true,
      soundUrl: '',
      soundVolume: 0.4
    };

    const cfg = { ...defaults, ...options, count: items.length, items };

    // Clear previous and build HTML structure
    root.innerHTML = '';
    root.setAttribute('role', 'listbox');
    root.setAttribute('tabindex', '0');
    root.setAttribute('aria-label', 'Option wheel navigation');
    root.className = `option-wheel${cfg.side === 'right' ? ' option-wheel--right' : ''}`;
    root.style.setProperty('--ow-text-color', cfg.textColor);
    root.style.setProperty('--ow-active-color', cfg.activeColor);
    root.style.setProperty('--ow-font-size', `${cfg.fontSize}rem`);
    root.style.setProperty('--ow-inset', `${cfg.inset}px`);

    const itemEls = [];

    items.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'option-wheel__item';
      el.setAttribute('role', 'option');
      el.setAttribute('aria-selected', index === cfg.defaultSelected ? 'true' : 'false');
      
      const numFormatted = String(index + 1).padStart(2, '0');
      el.innerHTML = `
        <span class="option-wheel__item-num">${numFormatted}</span>
        <span class="option-wheel__item-label">${item.label || item}</span>
        ${item.tag ? `<span class="option-wheel__item-badge">${item.tag}</span>` : ''}
      `;

      el.addEventListener('click', () => handleItemClick(index));
      root.appendChild(el);
      itemEls.push(el);
    });

    // References
    let pos = cfg.defaultSelected;
    let target = cfg.defaultSelected;
    let selectedIndex = cfg.defaultSelected;
    let raf = null;
    let lastTime = 0;
    let wheelTimer = null;
    let drag = null;
    let dragMoved = false;

    const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let rowH = Math.max(cfg.fontSize * cfg.spacing * remPx, 1);

    const updatePreviewCard = idx => {
      const card = document.getElementById('fullscreen-menu-side-card');
      if (!card) return;
      const curItem = items[idx];
      if (!curItem) return;

      const tagEl = card.querySelector('.fullscreen-menu-side-card__tag');
      const titleEl = card.querySelector('.fullscreen-menu-side-card__title');
      const descEl = card.querySelector('.fullscreen-menu-side-card__desc');
      const ctaEl = card.querySelector('.fullscreen-menu-side-card__cta .btn-text');
      const ctaBtn = card.querySelector('.fullscreen-menu-side-card__cta');

      if (tagEl) tagEl.textContent = curItem.tag || 'Clinical Navigation';
      if (titleEl) titleEl.textContent = curItem.title || curItem.label;
      if (descEl) descEl.textContent = curItem.desc || '';
      if (ctaEl) ctaEl.textContent = curItem.ctaText || 'Navigate';

      if (ctaBtn) {
        ctaBtn.onclick = (e) => {
          e.preventDefault();
          executeItemAction(curItem);
        };
      }
    };

    const executeItemAction = item => {
      // Close menu
      document.body.classList.remove('menu-open');
      const trigger = document.getElementById('menu-trigger');
      if (trigger) trigger.classList.remove('active');

      if (item.modal) {
        setTimeout(() => {
          if (window.openMedwestModal) {
            window.openMedwestModal(item.modal, item.mode);
          } else {
            const modalEl = document.getElementById(item.modal === 'left' ? 'credentials-modal' : 'consultation-modal');
            if (modalEl) modalEl.classList.add('active');
          }
        }, 320);
      } else if (item.href) {
        setTimeout(() => {
          const targetEl = document.querySelector(item.href);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }, 320);
      }
    };

    const runFrame = now => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const tau = Math.max(cfg.smoothing, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      let next = pos + (target - pos) * k;
      const settled = Math.abs(target - next) < 0.001;
      if (settled) next = target;
      pos = next;

      const n = cfg.count;
      const mirror = cfg.side === 'right' ? -1 : 1;
      const tiltRad = (cfg.tilt * Math.PI) / 180;
      const R = tiltRad > 0.0005 ? rowH / tiltRad : 0;

      for (let i = 0; i < n; i++) {
        const el = itemEls[i];
        if (!el) continue;
        let d = i - next;
        if (cfg.loop && n > 1) {
          d = ((d % n) + n) % n;
          if (d > n / 2) d -= n;
        }
        const dist = Math.abs(d);
        let x = 0;
        let y = d * rowH;
        let rot = 0;
        if (R > 0) {
          const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
          y = R * Math.sin(ang);
          x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
          rot = (mirror * ang * 180) / Math.PI;
        }
        el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
        el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
        el.style.filter = cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : 'none';
        el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));

        if (dist < 0.5) {
          el.classList.add('option-wheel__item--selected');
          el.setAttribute('aria-selected', 'true');
        } else {
          el.classList.remove('option-wheel__item--selected');
          el.setAttribute('aria-selected', 'false');
        }
      }

      if (!settled) {
        raf = requestAnimationFrame(runFrame);
      } else {
        raf = null;
      }
    };

    const startLoop = () => {
      if (raf != null) cancelAnimationFrame(raf);
      lastTime = performance.now();
      raf = requestAnimationFrame(runFrame);
    };

    const applyTarget = (val, snap) => {
      let v = val;
      if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
      if (snap) v = Math.round(v);
      target = v;
      const idx = ((Math.round(v) % cfg.count) + cfg.count) % cfg.count;
      if (idx !== selectedIndex) {
        selectedIndex = idx;
        updatePreviewCard(idx);
        if (typeof options.onChange === 'function') {
          options.onChange(idx, items[idx]);
        }
      }
      startLoop();
    };

    const handleItemClick = index => {
      if (dragMoved) return;
      const cur = target;
      const isAlreadyCentered = Math.abs(cur - index) < 0.05;

      let d = index - (((cur % cfg.count) + cfg.count) % cfg.count);
      if (cfg.loop && cfg.count > 1) {
        if (d > cfg.count / 2) d -= cfg.count;
        else if (d < -cfg.count / 2) d += cfg.count;
      }
      applyTarget(cur + d, true);

      if (isAlreadyCentered) {
        executeItemAction(items[index]);
      }
    };

    // Wheel Scroll
    root.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
      const step = Math.max(-1, Math.min(1, delta / rowH));
      applyTarget(target + step, false);
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => applyTarget(target, true), 140);
    }, { passive: false });

    // Pointer Drag
    if (cfg.draggable) {
      root.addEventListener('pointerdown', e => {
        drag = { y: e.clientY, start: target, id: e.pointerId };
        dragMoved = false;
        root.classList.add('option-wheel--dragging');
      });

      window.addEventListener('pointermove', e => {
        if (!drag) return;
        const dy = e.clientY - drag.y;
        if (!dragMoved && Math.abs(dy) > 4) {
          dragMoved = true;
          try { root.setPointerCapture(drag.id); } catch (_) {}
        }
        if (dragMoved) {
          applyTarget(drag.start - dy / rowH, false);
        }
      });

      const handlePointerEnd = () => {
        if (!drag) return;
        drag = null;
        root.classList.remove('option-wheel--dragging');
        if (dragMoved) applyTarget(target, true);
      };

      window.addEventListener('pointerup', handlePointerEnd);
      window.addEventListener('pointercancel', handlePointerEnd);
    }

    // Keyboard navigation
    root.addEventListener('keydown', e => {
      let delta = null;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1;
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1;
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        executeItemAction(items[selectedIndex]);
        return;
      }
      if (delta == null) return;
      e.preventDefault();
      applyTarget(Math.round(target) + delta, true);
    });

    // Resize handler
    const handleResize = () => {
      const isCompact = window.innerWidth < 576;
      const isMobile = window.innerWidth < 992;
      cfg.fontSize = isCompact ? 1.45 : isMobile ? 1.85 : 2.5;
      cfg.inset = isCompact ? 14 : isMobile ? 24 : 70;
      root.style.setProperty('--ow-font-size', `${cfg.fontSize}rem`);
      root.style.setProperty('--ow-inset', `${cfg.inset}px`);
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      rowH = Math.max(cfg.fontSize * cfg.spacing * rem, 1);
      applyTarget(target, false);
    };

    window.addEventListener('resize', handleResize);

    // Initial render & preview
    updatePreviewCard(cfg.defaultSelected);
    applyTarget(cfg.defaultSelected, true);

    return {
      select: idx => applyTarget(idx, true),
      destroy: () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('resize', handleResize);
      }
    };
  }

  // Auto init on DOMContentLoaded or export
  window.initOptionWheel = initOptionWheel;

  document.addEventListener('DOMContentLoaded', () => {
    const wheelContainer = document.getElementById('option-wheel-menu');
    if (wheelContainer) {
      window.optionWheelInstance = initOptionWheel('option-wheel-menu', {
        side: 'left',
        defaultSelected: 0,
        curve: 1.1,
        tilt: 7,
        blur: 1.8,
        fade: 0.28,
        spacing: 1.38
      });
    }
  });
})();
