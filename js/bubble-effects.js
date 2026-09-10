/**
 * KINETIC.PLUS* | Bubble Effects & Interactive Cursor
 * Replicates the organic physics and hover interactions from medwest.plus
 */

(function () {
  'use strict';

  // ============================================================
  // 1. Interactive Cursor with Lerp Physics
  // ============================================================
  const cursorDot = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursor-follower');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  const lerpFactor = 0.18;

  if (cursorDot && cursorFollower && window.innerWidth >= 992) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateCursor = () => {
      followerX += (mouseX - followerX) * lerpFactor;
      followerY += (mouseY - followerY) * lerpFactor;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Mouse Down / Up States
    window.addEventListener('mousedown', () => {
      cursorDot.classList.add('click-down');
    });

    window.addEventListener('mouseup', () => {
      cursorDot.classList.remove('click-down');
    });

    // Expand follower on interactive links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .tab-btn, .bubble-link, .kb-outer, input, textarea');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('drag-show');
      });
      el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('drag-show');
      });
    });
  }

  // ============================================================
  // 2. Bubble Link Hover Precision & Audio Feedback (optional)
  // ============================================================
  const bubbleLinks = document.querySelectorAll('.bubble-link');

  bubbleLinks.forEach((btn) => {
    btn.addEventListener('mouseenter', function () {
      const bubbleHover = this.querySelector('.bubble-hover');
      if (bubbleHover) {
        // dynamic subtle scale bounce
        bubbleHover.style.transitionTimingFunction = 'cubic-bezier(0.17, 0.96, 0.27, 1)';
      }
    });
  });

  // ============================================================
  // 3. 3D Card Tilt on Mouse Move
  // ============================================================
  const tiltContainers = document.querySelectorAll('.image-wrap, .kb-outer');

  tiltContainers.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / (rect.height / 2)) * -4;
      const tiltY = (x / (rect.width / 2)) * 4;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

})();
