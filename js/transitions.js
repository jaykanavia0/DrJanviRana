/**
 * DR. JANVI RANA (PT)* | Scroll Title Animations & Transitions
 * High-End European Scroll-Driven Reveal Architecture
 */

(function () {
  'use strict';

  // ============================================================
  // 1. Scroll-Triggered Text Title & Line Reveal System
  // ============================================================
  const revealElements = document.querySelectorAll('.title-reveal, .reveal-line, .fade-up-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -12% 0px',
    threshold: [0, 0.15, 0.3, 0.5]
  };

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (entry.target.parentElement) {
          entry.target.parentElement.classList.add('revealed');
        }
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    titleObserver.observe(el);
  });

  // Automatically wrap titles with .title-reveal-wrap if not already wrapped
  document.querySelectorAll('h2.lead-heading, h1.hero-headline, h2.section-title').forEach((heading) => {
    if (!heading.classList.contains('title-reveal-applied')) {
      heading.classList.add('title-reveal-applied');
      titleObserver.observe(heading);
      heading.classList.add('fade-up-scroll');
    }
  });

  // ============================================================
  // 2. Parallax Title Shift on Scroll (Kinetic Float)
  // ============================================================
  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScrollParallax() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Subtly shift alternating section images and titles
    document.querySelectorAll('.boxes-wrap').forEach((box) => {
      const rect = box.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const offset = (rect.top - windowHeight / 2) * 0.04;
        const img = box.querySelector('.lazy-image-wrap img');
        if (img) {
          img.style.transform = `translateY(${offset}px) scale(1.04)`;
        }
      }
    });

    // Subtly float the big headlines in footer
    const footerHeadlines = document.querySelectorAll('.big-headlines a');
    footerHeadlines.forEach((headline, idx) => {
      const rect = headline.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const speed = (idx % 2 === 0 ? 1 : -1) * 0.03;
        const shiftX = (windowHeight - rect.top) * speed;
        headline.style.transform = `translateX(${shiftX}px)`;
      }
    });

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScrollParallax);
      ticking = true;
    }
  }, { passive: true });

  // ============================================================
  // 3. Circular Aperture Curtain Transition Engine
  // ============================================================
  const curtain = document.getElementById('curtain');
  const transWord = document.getElementById('trans-word');
  const transWordText = transWord ? transWord.querySelector('.wrap') : null;

  window.triggerCurtainTransition = function (titleText, callback) {
    if (!curtain || !transWord) {
      if (callback) callback();
      return;
    }

    if (transWordText && titleText) {
      transWordText.textContent = titleText;
    }

    // Step 1: Expand circle curtain
    curtain.classList.add('active');
    transWord.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Step 2: Execute callback at peak coverage
    setTimeout(() => {
      if (callback) callback();

      // Step 3: Shrink circle curtain
      setTimeout(() => {
        curtain.classList.remove('active');
        transWord.classList.remove('active');
        document.body.style.overflow = '';
      }, 400);
    }, 600);
  };

  // Attach to data-trans links
  const transLinks = document.querySelectorAll('[data-trans]');
  transLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const targetHref = this.getAttribute('href');
      const transTitle = this.getAttribute('data-trans') || 'DR. JANVI RANA*';

      if (targetHref && targetHref.startsWith('#') && targetHref.length > 1) {
        e.preventDefault();
        window.triggerCurtainTransition(transTitle, () => {
          try {
            const targetEl = document.querySelector(targetHref);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          } catch (err) {
            // ignore invalid selector
          }
          if (document.body.classList.contains('menu-open')) {
            window.toggleMenu(false);
          }
        });
      }
    });
  });

  // ============================================================
  // 4. Sticky Pathology Progress Line & Scroll Spy
  // ============================================================
  const pathologySection = document.getElementById('pathologien');
  const progressLine = document.querySelector('.line-inner');
  const navItems = document.querySelectorAll('.pathology-nav-item');
  const pathologyCards = document.querySelectorAll('.kb-outer');

  function updatePathologyProgress() {
    if (!pathologySection || !progressLine || pathologyCards.length === 0) return;

    const sectionRect = pathologySection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalHeight = sectionRect.height - windowHeight;

    if (totalHeight <= 0) return;

    const scrolledInside = -sectionRect.top + 100;
    let progress = (scrolledInside / totalHeight) * 100;
    progress = Math.max(0, Math.min(100, progress));

    progressLine.style.height = `${progress}%`;

    pathologyCards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      if (cardRect.top <= windowHeight * 0.55 && cardRect.bottom >= windowHeight * 0.2) {
        navItems.forEach((item) => item.classList.remove('active'));
        if (navItems[index]) {
          navItems[index].classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updatePathologyProgress, { passive: true });
  window.addEventListener('resize', updatePathologyProgress);

  navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (pathologyCards[index]) {
        pathologyCards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // ============================================================
  // 5. Header Scrolled State
  // ============================================================
  function updateHeaderScrolled() {
    if (window.scrollY > 40) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderScrolled, { passive: true });
  updateHeaderScrolled();

})();
