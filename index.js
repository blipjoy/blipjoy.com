import { BlipJoyAnimation } from './js/anim.js';

function main() {
  // Start the logo animation
  new BlipJoyAnimation();

  // Fake lightbox for the screenshots
  const links = document.querySelectorAll('p.screenshot > a');
  for (const link of links) {
    link.addEventListener('click', (event) => {
      if (event instanceof PointerEvent) {
        lightbox_click(link, event);
      }
    });
  }
}

/**
 * @arg {Element} anchor
 * @arg {PointerEvent} event
 */
function lightbox_click(anchor, event) {
  if (event.button !== 0) {
    return;
  }

  const img = anchor.querySelector('img');
  if (img === null) {
    return;
  }

  img.classList.toggle('full');
  event.preventDefault();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
