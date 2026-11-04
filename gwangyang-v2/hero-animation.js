if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  try {
    const { animate, stagger } = await import('https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm');
    animate('.title-char', {
      translateY: [64, 0],
      opacity: [0, 1],
      duration: 950,
      delay: stagger(110, { start: 180 }),
      ease: 'outExpo'
    });
  } catch (error) {
    // Keep the static title readable when the CDN is unavailable.
  }
}
