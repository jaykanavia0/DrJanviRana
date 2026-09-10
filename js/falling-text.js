/**
 * FallingText Component (React Bits Native Vanilla Implementation)
 * Interactive physics-based falling typography powered by Matter.js
 */

(function () {
  'use strict';

  function initFallingText(containerIdOrEl, options = {}) {
    if (typeof Matter === 'undefined') {
      console.warn('FallingText: Matter.js is required.');
      return;
    }

    const container = typeof containerIdOrEl === 'string'
      ? document.getElementById(containerIdOrEl)
      : containerIdOrEl;

    if (!container || container._fallingTextInit) return;
    container._fallingTextInit = true;

    const defaults = {
      text: container.getAttribute('data-text') || container.textContent.trim(),
      highlightWords: ['tension', 'Janvi', 'anatomical', 'freedom', 'restores', 'mobility', 'precision'],
      highlightClass: 'highlighted',
      trigger: 'scroll', // 'click' | 'hover' | 'auto' | 'scroll'
      backgroundColor: 'transparent',
      wireframes: false,
      gravity: 0.65,
      mouseConstraintStiffness: 0.8,
      fontSize: window.innerWidth < 768 ? '1.4rem' : '2.1rem'
    };

    const cfg = { ...defaults, ...options };

    // Set up HTML inside container
    container.innerHTML = `
      <div class="falling-text-target" style="font-size: ${cfg.fontSize}; line-height: 1.45;"></div>
      <div class="falling-text-canvas"></div>
    `;

    const textTarget = container.querySelector('.falling-text-target');
    const canvasContainer = container.querySelector('.falling-text-canvas');

    const words = cfg.text.split(' ');
    textTarget.innerHTML = words
      .map(word => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
        const isHighlighted = cfg.highlightWords.some(hw => 
          cleanWord.toLowerCase().startsWith(hw.toLowerCase()) || hw.toLowerCase() === cleanWord.toLowerCase()
        );
        return `<span class="word ${isHighlighted ? cfg.highlightClass : ''}">${word}</span>`;
      })
      .join(' ');

    let effectStarted = false;

    const startPhysics = () => {
      if (effectStarted) return;
      effectStarted = true;

      const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

      const containerRect = container.getBoundingClientRect();
      const width = containerRect.width;
      const height = containerRect.height;

      if (width <= 0 || height <= 0) return;

      const engine = Engine.create();
      engine.world.gravity.y = cfg.gravity;

      const render = Render.create({
        element: canvasContainer,
        engine,
        options: {
          width,
          height,
          background: cfg.backgroundColor,
          wireframes: cfg.wireframes
        }
      });

      const boundaryOptions = {
        isStatic: true,
        render: { fillStyle: 'transparent' }
      };

      const floor = Bodies.rectangle(width / 2, height + 25, width * 2, 50, boundaryOptions);
      const leftWall = Bodies.rectangle(-25, height / 2, 50, height * 2, boundaryOptions);
      const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height * 2, boundaryOptions);
      const ceiling = Bodies.rectangle(width / 2, -25, width * 2, 50, boundaryOptions);

      const wordSpans = textTarget.querySelectorAll('.word');
      const wordBodies = Array.from(wordSpans).map(elem => {
        const rect = elem.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;

        const body = Bodies.rectangle(x, y, rect.width, rect.height, {
          render: { fillStyle: 'transparent' },
          restitution: 0.75,
          frictionAir: 0.015,
          friction: 0.25
        });

        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 2
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.04);
        return { elem, body };
      });

      wordBodies.forEach(({ elem, body }) => {
        elem.style.position = 'absolute';
        elem.style.left = `${body.position.x}px`;
        elem.style.top = `${body.position.y}px`;
        elem.style.transform = 'translate(-50%, -50%)';
      });

      const mouse = Mouse.create(container);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: cfg.mouseConstraintStiffness,
          render: { visible: false }
        }
      });
      render.mouse = mouse;

      World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...wordBodies.map(wb => wb.body)]);

      const runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);

      let animId;
      const updateLoop = () => {
        wordBodies.forEach(({ body, elem }) => {
          const { x, y } = body.position;
          elem.style.left = `${x}px`;
          elem.style.top = `${y}px`;
          elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
        });
        Matter.Engine.update(engine);
        animId = requestAnimationFrame(updateLoop);
      };
      updateLoop();

      return () => {
        if (animId) cancelAnimationFrame(animId);
        Render.stop(render);
        Runner.stop(runner);
        if (render.canvas && canvasContainer) {
          canvasContainer.removeChild(render.canvas);
        }
        World.clear(engine.world);
        Engine.clear(engine);
      };
    };

    if (cfg.trigger === 'auto') {
      startPhysics();
    } else if (cfg.trigger === 'scroll') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(startPhysics, 300);
            observer.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      observer.observe(container);
    } else if (cfg.trigger === 'hover') {
      container.addEventListener('mouseenter', startPhysics, { once: true });
    } else if (cfg.trigger === 'click') {
      container.addEventListener('click', startPhysics, { once: true });
    }
  }

  window.initFallingText = initFallingText;

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.querySelectorAll('.falling-text-container').forEach(el => {
        initFallingText(el, {
          trigger: el.getAttribute('data-trigger') || 'scroll',
          highlightWords: ['tension', 'Janvi', 'freedom', 'restores', 'mobility', 'precision', 'rehabilitation'],
          gravity: 0.6
        });
      });
    }, 200);
  });
})();
