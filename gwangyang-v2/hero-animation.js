if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  try {
    const { animate, stagger } = await import('https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm');
    animate('.title-char', {
      translateY: [64, 0], opacity: [0, 1], duration: 950,
      delay: stagger(110, { start: 180 }), ease: 'outExpo'
    });
    const eyebrow = document.querySelector('.hero .eyebrow');
    if (eyebrow) {
      const text = eyebrow.textContent;
      eyebrow.setAttribute('aria-label', text);
      const fragments = Array.from(text, (letter) => {
        const part = document.createElement('span');
        part.textContent = letter === ' ' ? '\u00a0' : letter;
        part.setAttribute('aria-hidden', 'true');
        part.style.display = 'inline-block';
        return part;
      });
      eyebrow.replaceChildren(...fragments);
      animate(fragments, {
        translateX: [
          { to: (_, i) => Math.sin(i * 2.4) * 85, duration: 650 },
          { to: 0, duration: 1250, delay: 180 }
        ],
        translateY: [
          { to: (_, i) => Math.cos(i * 1.7) * 60, duration: 650 },
          { to: 0, duration: 1250, delay: 180 }
        ],
        rotate: [
          { to: (_, i) => Math.sin(i * 3.1) * 95, duration: 650 },
          { to: 0, duration: 1250, delay: 180 }
        ],
        opacity: [
          { to: 0.3, duration: 650 },
          { to: 1, duration: 1250, delay: 180 }
        ],
        delay: stagger(18, { start: 250 }),
        ease: 'inOutQuart',
        onComplete: () => fragments.forEach(part => part.style.removeProperty('transform'))
      });
    }
  } catch (error) {
    // Leave readable static text if the animation library is unavailable.
  }
}

async function revealCardsOnScroll() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = [...document.querySelectorAll('.highlight-card, .day-card')];
  try {
    const { animate, inView } = await import('https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(48px)';
    });
    let batchIndex = 0;
    let resetFrame;
    inView(cards, card => {
      const delay = batchIndex++ * 0.14;
      cancelAnimationFrame(resetFrame);
      resetFrame = requestAnimationFrame(() => { batchIndex = 0; });
      animate(card, { opacity: [0, 1], y: [48, 0] }, {
        duration: 0.8, delay, ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          card.style.removeProperty('opacity');
          card.style.removeProperty('transform');
        }
      });
    }, { margin: '0px 0px -40px 0px', amount: 0.08 });
  } catch (error) {
    cards.forEach(card => {
      card.style.removeProperty('opacity');
      card.style.removeProperty('transform');
    });
  }
}
revealCardsOnScroll();
