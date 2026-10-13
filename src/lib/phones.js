// Phone carousel behaviour (see PhoneCarousel.astro): drag with the mouse, progress bar under the row.
// Works for any number of carousels, and for ones added later (private case content): call initPhones(root).
export function initPhones(root = document) {
  for (const box of root.querySelectorAll('[data-phones]')) {
    if (box.dataset.ready) continue;
    box.dataset.ready = '1';
    const row = box.querySelector('.phones__row');
    const bar = box.querySelector('.phones__bar');
    const thumb = bar.firstElementChild;
    // drag with the mouse (touch scrolls natively)
    let x0 = null, s0 = 0;
    row.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; x0 = e.clientX; s0 = row.scrollLeft; row.classList.add('is-dragging'); row.setPointerCapture(e.pointerId); });
    row.addEventListener('pointermove', (e) => { if (x0 !== null) row.scrollLeft = s0 - (e.clientX - x0); });
    const end = () => { x0 = null; row.classList.remove('is-dragging'); };
    row.addEventListener('pointerup', end); row.addEventListener('pointercancel', end);
    row.addEventListener('dragstart', (e) => e.preventDefault());
    // bar: thumb width = visible share, position = how far you scrolled; hidden when everything fits
    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      bar.hidden = max <= 2;
      const w = (row.clientWidth / row.scrollWidth) * bar.clientWidth;
      thumb.style.setProperty('--w', `${w}px`);
      thumb.style.setProperty('--x', `${max > 0 ? (row.scrollLeft / max) * (bar.clientWidth - w) : 0}px`);
    };
    row.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    // images change the row width as they load
    row.querySelectorAll('img').forEach((img) => img.complete || img.addEventListener('load', update, { once: true }));
    update();
  }
}
