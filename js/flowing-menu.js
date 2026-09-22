/**
 * FlowingMenu Component (React Bits Vanilla/GSAP Integration)
 * Matches FlowingMenu.jsx logic with edge-detection animations and seamless marquee loop
 */

(function () {
  'use strict';

  // Clinical specialties from Dr. Janvi Rana's background, Civil Hospital & clinic rotations
  const menuItems = [
    {
      link: '#pathologien',
      text: 'Post-Operative Orthopedic Rehab',
      image: 'assets/images/ortho-rehab.png'
    },
    {
      link: '#pathologien',
      text: 'Spine, Sciatica & Posture Alignment',
      image: 'assets/images/spine-sciatica.png'
    },
    {
      link: '#pathologien',
      text: 'Neurological & Stroke Recovery',
      image: 'assets/images/neuro-stroke.png'
    },
    {
      link: '#pathologien',
      text: 'Advanced Electrotherapy (IFT & TENS)',
      image: 'assets/images/electrotherapy.png'
    },
    {
      link: '#pathologien',
      text: 'Frozen Shoulder & Joint Mobilization',
      image: 'assets/images/joint-mobilization.png'
    },
    {
      link: '#virtual-care',
      text: 'Virtual Telehealth Care Worldwide',
      image: 'assets/images/virtual-consultation.png'
    }
  ];

  const config = {
    speed: 15,
    textColor: '#ffffff',
    bgColor: '#111614',
    marqueeBgColor: '#00A09A',
    marqueeTextColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.12)'
  };

  const container = document.getElementById('flowing-menu-container');
  if (!container || typeof gsap === 'undefined') return;

  function distMetric(x, y, x2, y2) {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  }

  function findClosestEdge(mouseX, mouseY, width, height) {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  }

  // Render HTML structure
  const menuWrap = document.createElement('div');
  menuWrap.className = 'menu-wrap';
  menuWrap.style.backgroundColor = config.bgColor;

  const nav = document.createElement('nav');
  nav.className = 'menu';

  menuItems.forEach((item) => {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu__item';
    menuItem.style.borderColor = config.borderColor;

    const link = document.createElement('a');
    link.className = 'menu__item-link';
    link.href = item.link;
    link.style.color = config.textColor;
    link.textContent = item.text;

    const marquee = document.createElement('div');
    marquee.className = 'marquee';
    marquee.style.backgroundColor = config.marqueeBgColor;

    const innerWrap = document.createElement('div');
    innerWrap.className = 'marquee__inner-wrap';

    const inner = document.createElement('div');
    inner.className = 'marquee__inner';
    inner.setAttribute('aria-hidden', 'true');

    // Build repetition parts
    for (let i = 0; i < 6; i++) {
      const part = document.createElement('div');
      part.className = 'marquee__part';
      part.style.color = config.marqueeTextColor;

      const span = document.createElement('span');
      span.textContent = item.text;

      const img = document.createElement('div');
      img.className = 'marquee__img';
      img.style.backgroundImage = `url(${item.image})`;

      part.appendChild(span);
      part.appendChild(img);
      inner.appendChild(part);
    }

    innerWrap.appendChild(inner);
    marquee.appendChild(innerWrap);
    menuItem.appendChild(link);
    menuItem.appendChild(marquee);
    nav.appendChild(menuItem);

    // Setup Edge-detection Enter/Leave & Touch Animations
    const animationDefaults = { duration: 0.6, ease: 'expo' };

    const showMarquee = (edge = 'bottom') => {
      gsap
        .timeline({ defaults: animationDefaults })
        .set(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .set(inner, { y: edge === 'top' ? '101%' : '-101%' }, 0)
        .to([marquee, inner], { y: '0%' }, 0);
    };

    const hideMarquee = (edge = 'bottom') => {
      gsap
        .timeline({ defaults: animationDefaults })
        .to(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .to(inner, { y: edge === 'top' ? '101%' : '-101%' }, 0);
    };

    menuItem.addEventListener('mouseenter', (ev) => {
      const rect = menuItem.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);
      showMarquee(edge);
    });

    menuItem.addEventListener('mouseleave', (ev) => {
      const rect = menuItem.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);
      hideMarquee(edge);
    });

    // Mobile touch interaction
    menuItem.addEventListener('touchstart', () => {
      showMarquee('bottom');
    }, { passive: true });

    // Setup Marquee Loop Animation
    setTimeout(() => {
      const firstPart = inner.querySelector('.marquee__part');
      if (firstPart) {
        const contentWidth = firstPart.offsetWidth;
        if (contentWidth > 0) {
          gsap.to(inner, {
            x: -contentWidth,
            duration: config.speed,
            ease: 'none',
            repeat: -1
          });
        }
      }
    }, 150);
  });

  menuWrap.appendChild(nav);
  container.appendChild(menuWrap);

})();
