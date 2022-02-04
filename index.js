import { BlipJoyAnimation } from './js/anim.js';

function main() {
  new BlipJoyAnimation();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
