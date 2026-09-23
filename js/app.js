/**
 * DR. JANVI RANA (PT)* | Main Application Controller
 * Handles Drawer Modals, WhatsApp Direct Integration (+91 9662698781), and Booking
 */

(function () {
  'use strict';

  const WHATSAPP_PHONE = '919662698781';

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
  }

  window.openMedwestModal = function (side) {
    openModal(side);
  };

  function closeAllModals() {
    body.classList.remove('medwest-modal-open');
    body.classList.remove('medwest-modal-open-right');
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
    }
  };

  document.getElementById('menu-close')?.addEventListener('click', () => window.toggleMenu(false));

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
  const bookingForm = document.getElementById('consultation-form');
  const successAlert = document.getElementById('booking-success-alert');
  const whatsappQuickBtn = document.getElementById('whatsapp-direct-submit');

  function buildWhatsAppMessage() {
    const name = document.getElementById('client-name') ? document.getElementById('client-name').value.trim() : '';
    const phone = document.getElementById('client-phone') ? document.getElementById('client-phone').value.trim() : '';
    const service = document.getElementById('client-service') ? document.getElementById('client-service').value : '';
    const area = document.getElementById('client-area') ? document.getElementById('client-area').value : '';
    const message = document.getElementById('client-message') ? document.getElementById('client-message').value.trim() : '';

    let text = `Hello Dr. Janvi Rana!\nI would like to inquire about a Physiotherapy consultation.\n\n`;
    text += `• Consultation Type: Surat Home Visit\n`;
    if (name) text += `• Name: ${name}\n`;
    if (phone) text += `• Phone: ${phone}\n`;
    if (area) text += `• Surat Area: ${area}\n`;
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


        // Open WhatsApp directly with patient info
        const msg = encodeURIComponent(buildWhatsAppMessage());
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, '_blank');

        if (successAlert) {
          successAlert.classList.remove('d-none');
          setTimeout(() => {
            successAlert.classList.add('d-none');
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

  // Scroll down indicator
  const scrollDownIndicator = document.querySelector('.scroll-down');
  if (scrollDownIndicator) {
    scrollDownIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      const nextSection = document.querySelector('#about-doctor') || document.querySelector('.section-doctor-profile');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

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
