/**
 * DR. JANVI RANA (PT)* | Main Application Controller
 * Handles Drawer Modals, WhatsApp Direct Integration (+91 9662698781), and Booking
 */

(function () {
  'use strict';

  const WHATSAPP_PHONE = '919662698781';

  // ============================================================
  // 0. Lenis Smooth Scrolling Engine
  // ============================================================
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
      infinite: false
    });

    window.lenis = lenis;

    // Connect Lenis with GSAP ScrollTrigger ticker
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // ============================================================
  // 1. Dual Slide-Out Modals
  // ============================================================
  const body = document.body;
  const leftModal = document.getElementById('medwest-modal');
  const rightModal = document.getElementById('medwest-modal-right');
  const modalBackdrop = document.querySelector('.medwest-modal-backdrop');

  const openLeftModalBtns = document.querySelectorAll('[data-open-modal="left"]');
  const openRightModalBtns = document.querySelectorAll('[data-open-modal="right"]');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  function openModal(side) {
    closeAllModals();
    if (side === 'left') {
      body.classList.add('medwest-modal-open');
    } else if (side === 'right') {
      body.classList.add('medwest-modal-open-right');
    }
    if (lenis) lenis.stop();
  }

  window.openMedwestModal = function (side, mode) {
    if (mode) setConsultationMode(mode);
    openModal(side);
  };

  function closeAllModals() {
    body.classList.remove('medwest-modal-open');
    body.classList.remove('medwest-modal-open-right');
    if (lenis && !body.classList.contains('menu-open')) {
      lenis.start();
    }
  }

  openLeftModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('left');
    });
  });

  openRightModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = btn.getAttribute('data-mode');
      if (mode) {
        setConsultationMode(mode);
      }
      openModal('right');
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllModals();
    });
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeAllModals);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      if (body.classList.contains('menu-open')) {
        window.toggleMenu(false);
      }
    }
  });

  // ============================================================
  // 2. Consultation Mode Selection (Home Visit vs Virtual)
  // ============================================================
  const modeBtns = document.querySelectorAll('.mode-btn');
  const appointmentTypeInput = document.getElementById('appointment-type');
  const appointmentNotice = document.getElementById('mode-notice');
  const areaGroup = document.getElementById('area-selection-group');

  function setConsultationMode(mode) {
    modeBtns.forEach((b) => b.classList.remove('active'));
    const targetBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
    if (targetBtn) {
      targetBtn.classList.add('active');
    }

    if (appointmentTypeInput) {
      appointmentTypeInput.value = mode;
    }

    if (appointmentNotice) {
      if (mode === 'virtual') {
        appointmentNotice.innerHTML = '<strong>Virtual Session:</strong> Conducted via secure HD video (Zoom / Google Meet). Comprehensive posture assessment, guided movements & digital exercise regimen.';
        if (areaGroup) areaGroup.style.display = 'none';
      } else {
        appointmentNotice.innerHTML = '<strong>Surat Visit:</strong> Personal 1-on-1 session by Dr. Janvi Rana across covered Surat areas (Adajan, Pal, Jahangirpura, Palanpur, Vesu, Piplod, Umra, Athwa).';
        if (areaGroup) areaGroup.style.display = 'block';
      }
    }
  }

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const mode = this.getAttribute('data-mode');
      setConsultationMode(mode);
    });
  });

  // ============================================================
  // 3. Fullscreen Hamburger Menu Toggle
  // ============================================================
  const menuToggle = document.getElementById('menu-toggle');

  window.toggleMenu = function (forceState) {
    if (typeof forceState === 'boolean') {
      body.classList.toggle('menu-open', forceState);
    } else {
      body.classList.toggle('menu-open');
    }

    if (body.classList.contains('menu-open')) {
      closeAllModals();
      if (lenis) lenis.stop();
    } else {
      if (lenis && !body.classList.contains('medwest-modal-open') && !body.classList.contains('medwest-modal-open-right')) {
        lenis.start();
      }
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      window.toggleMenu();
    });
  }

  // ============================================================
  // 4. Tour Tabs (.officeGrid)
  // ============================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  let currentTabIndex = 0;

  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', function () {
      if (index === currentTabIndex) return;

      const direction = index > currentTabIndex ? 'fromRight' : 'fromLeft';
      currentTabIndex = index;

      tabBtns.forEach((b) => b.classList.remove('active'));
      this.classList.add('active');

      tabPanes.forEach((pane) => {
        pane.classList.remove('active', 'fromLeft', 'fromRight');
      });

      const targetPane = tabPanes[index];
      if (targetPane) {
        targetPane.classList.add('active', direction);
      }
    });
  });

  // ============================================================
  // 5. Booking Form & WhatsApp Direct Dispatch (+91 9662698781)
  // ============================================================
  const bookingForm = document.getElementById('appointment-form');
  const successAlert = document.getElementById('form-success');
  const whatsappQuickBtn = document.getElementById('whatsapp-direct-submit');

  function buildWhatsAppMessage() {
    const name = document.getElementById('client-name') ? document.getElementById('client-name').value.trim() : '';
    const phone = document.getElementById('client-phone') ? document.getElementById('client-phone').value.trim() : '';
    const service = document.getElementById('client-service') ? document.getElementById('client-service').value : '';
    const area = document.getElementById('client-area') ? document.getElementById('client-area').value : '';
    const mode = appointmentTypeInput ? appointmentTypeInput.value : 'visit';
    const message = document.getElementById('client-message') ? document.getElementById('client-message').value.trim() : '';

    let text = `Hello Dr. Janvi Rana!\nI would like to inquire about a Physiotherapy consultation.\n\n`;
    text += `• Consultation Type: ${mode === 'virtual' ? 'Virtual Video Session' : 'Surat Visit'}\n`;
    if (name) text += `• Name: ${name}\n`;
    if (phone) text += `• Phone: ${phone}\n`;
    if (area && mode !== 'virtual') text += `• Surat Area: ${area}\n`;
    if (service) text += `• Concern: ${service}\n`;
    if (message) text += `• Details: ${message}\n`;

    return text;
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const service = document.getElementById('client-service').value;

      if (!name || !phone || !service) {
        alert('Please provide your name, phone number, and primary concern.');
        return;
      }

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Connecting to WhatsApp...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        bookingForm.reset();
        
        // Open WhatsApp directly with patient info
        const msg = encodeURIComponent(buildWhatsAppMessage());
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, '_blank');

        if (successAlert) {
          successAlert.style.display = 'block';
          setTimeout(() => {
            successAlert.style.display = 'none';
            closeAllModals();
          }, 3500);
        }
      }, 600);
    });
  }

  if (whatsappQuickBtn) {
    whatsappQuickBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = encodeURIComponent(buildWhatsAppMessage());
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, '_blank');
    });
  }

  // ============================================================
  // 6. Hero Crossfading Slides
  // ============================================================
  const heroSlides = document.querySelectorAll('.video-wrap-bg');
  let currentSlide = 0;

  if (heroSlides.length > 1) {
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 6500);
  }

  // ============================================================
  // 7. Ambient Procedural Wave Canvas
  // ============================================================
  const footerCanvas = document.getElementById('footer-wave-canvas');
  if (footerCanvas) {
    const ctx = footerCanvas.getContext('2d');
    let width = (footerCanvas.width = footerCanvas.offsetWidth);
    let height = (footerCanvas.height = footerCanvas.offsetHeight);

    window.addEventListener('resize', () => {
      width = footerCanvas.width = footerCanvas.offsetWidth;
      height = footerCanvas.height = footerCanvas.offsetHeight;
    });

    let step = 0;
    function renderWave() {
      ctx.clearRect(0, 0, width, height);
      step += 0.015;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgba(0, 160, 154, ${0.15 + i * 0.08})`;

        for (let x = 0; x < width; x += 10) {
          const y =
            height / 2 +
            Math.sin(x * 0.004 + step + i) * 45 +
            Math.cos(x * 0.002 - step) * 25;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      requestAnimationFrame(renderWave);
    }
    renderWave();
  }

  // ============================================================
  // 7. Smooth Anchor Navigation via Lenis
  // ============================================================
  function smoothScrollToTarget(targetSelector, offset = -70) {
    const targetEl = typeof targetSelector === 'string' ? document.querySelector(targetSelector) : targetSelector;
    if (targetEl) {
      if (body.classList.contains('menu-open')) {
        window.toggleMenu(false);
      }
      closeAllModals();

      if (window.lenis) {
        window.lenis.scrollTo(targetEl, {
          offset: offset,
          duration: 1.25,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Scroll down indicator
  const scrollDownIndicator = document.querySelector('.scroll-down');
  if (scrollDownIndicator) {
    scrollDownIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollToTarget('#about-doctor', -60);
    });
  }

  // Internal anchor links (e.g. #about-doctor, #pathologien, #features, etc.)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && href.length > 1 && !this.hasAttribute('data-open-modal')) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          smoothScrollToTarget(targetEl, -70);
        }
      }
    });
  });

  // ============================================================
  // 8. Fullscreen Initial Loading Screen Dismissal
  // ============================================================
  function dismissLoader() {
    const loader = document.getElementById('site-loader');
    if (loader && !loader.classList.contains('loaded')) {
      setTimeout(() => {
        loader.classList.add('loaded');
        loader.setAttribute('aria-hidden', 'true');
      }, 700);
    }
  }

  if (document.readyState === 'complete') {
    dismissLoader();
  } else {
    window.addEventListener('load', dismissLoader);
    // Safety fallback
    setTimeout(dismissLoader, 2500);
  }

})();
