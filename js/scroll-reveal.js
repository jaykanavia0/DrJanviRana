/**
 * ScrollReveal Component (React Bits Native Vanilla Implementation)
 * Smooth scroll-triggered kinetic word reveal with container tilt, optical blur & opacity scrubbing
 */

(function () {
  'use strict';

  function initScrollReveal(target, options = {}) {
    if (typeof gsap === 'undefined') {
      console.warn('ScrollReveal: GSAP is required.');
      return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const elements = typeof target === 'string' 
      ? document.querySelectorAll(target) 
      : target instanceof NodeList 
        ? target 
        : [target];

    if (!elements || elements.length === 0) return;

    const defaults = {
      enableBlur: true,
      baseOpacity: 0.1,
      baseRotation: 0,
      blurStrength: 4,
      rotationEnd: 'bottom bottom',
      wordAnimationEnd: 'bottom 75%',
      scrollContainer: window
    };

    const cfg = { ...defaults, ...options };

    elements.forEach(container => {
      if (!container || container._scrollRevealInit) return;
      container._scrollRevealInit = true;

      const textEl = container.querySelector('.scroll-reveal-text') || container;

      // Split words while preserving inner formatting (like <em>)
      const nodes = Array.from(textEl.childNodes);
      textEl.innerHTML = '';

      const processNode = node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/(\s+)/);
          words.forEach(w => {
            if (w.match(/^\s+$/)) {
              textEl.appendChild(document.createTextNode(w));
            } else if (w.length > 0) {
              const span = document.createElement('span');
              span.className = 'word';
              span.textContent = w;
              textEl.appendChild(span);
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.toLowerCase() === 'em' || node.tagName.toLowerCase() === 'span' || node.tagName.toLowerCase() === 'strong') {
            const tagSpan = document.createElement(node.tagName.toLowerCase());
            if (node.className) tagSpan.className = node.className;
            const words = node.textContent.split(/(\s+)/);
            words.forEach(w => {
              if (w.match(/^\s+$/)) {
                tagSpan.appendChild(document.createTextNode(w));
              } else if (w.length > 0) {
                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = w;
                tagSpan.appendChild(span);
              }
            });
            textEl.appendChild(tagSpan);
          } else {
            textEl.appendChild(node.cloneNode(true));
          }
        }
      };

      nodes.forEach(processNode);

      const wordElements = textEl.querySelectorAll('.word');
      const scroller = cfg.scrollContainer;

      // 1. Container Tilt (only if baseRotation is specified and non-zero)
      if (cfg.baseRotation && cfg.baseRotation !== 0) {
        gsap.fromTo(
          container,
          { transformOrigin: '50% 50%', rotate: cfg.baseRotation },
          {
            ease: 'none',
            rotate: 0,
            scrollTrigger: {
              trigger: container,
              scroller,
              start: 'top bottom',
              end: cfg.rotationEnd,
              scrub: true
            }
          }
        );
      }

      // 2. Word Opacity Scrub
      gsap.fromTo(
        wordElements,
        { opacity: cfg.baseOpacity, willChange: 'opacity, filter' },
        {
          ease: 'none',
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: container,
            scroller,
            start: 'top bottom-=15%',
            end: cfg.wordAnimationEnd,
            scrub: true
          }
        }
      );

      // 3. Word Blur Scrub
      if (cfg.enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${cfg.blurStrength}px)` },
          {
            ease: 'none',
            filter: 'blur(0px)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: container,
              scroller,
              start: 'top bottom-=15%',
              end: cfg.wordAnimationEnd,
              scrub: true
            }
          }
        );
      }
    });
  }

  window.initScrollReveal = initScrollReveal;

  document.addEventListener('DOMContentLoaded', () => {
    // Wait for GSAP and ScrollTrigger
    setTimeout(() => {
      initScrollReveal('.scroll-reveal', {
        enableBlur: true,
        baseOpacity: 0.1,
        baseRotation: 0,
        blurStrength: 4
      });
    }, 100);
  });
})();
