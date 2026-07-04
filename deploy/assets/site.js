/* ============================================================
   La Segunda · shared site behaviors
   - Mobile nav drawer toggle
   - Backdrop dismiss + Esc to close + scroll lock
   - Auto-close after tapping a link
============================================================ */
(function () {
  'use strict';

  function init() {
    if (window.__laSegundaNavInit) return;
    window.__laSegundaNavInit = true;
    const body = document.body;
    const burger = document.querySelector('.nav-burger');
    const links = document.querySelector('.nav-links');
    if (!burger || !links) return;

    // Backdrop element (created once)
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    // Belt-and-braces vs iOS Safari blur: the drawer is a composited layer
    // (fixed + transform transition); a fractional CSS-pixel width makes
    // WebKit rasterize it at a non-integer device-pixel size and blur its
    // text. CSS uses integer widths, but snap anyway in case another rule
    // ever yields a fraction.
    function snapWidth() {
      links.style.width = '';
      var w = links.getBoundingClientRect().width;
      var r = Math.round(w);
      if (Math.abs(w - r) > 0.001) links.style.width = r + 'px';
    }

    // iOS Safari keeps the blurry mid-animation raster of the composited
    // drawer layer after the slide-in ends. Removing the transform once the
    // transition finishes de-promotes the layer so text re-renders sharp.
    function settle(e) {
      if (e && e.target !== links) return;
      links.removeEventListener('transitionend', settle);
      if (body.classList.contains('nav-open')) links.style.transform = 'none';
    }

    function open() {
      snapWidth();
      body.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      links.addEventListener('transitionend', settle);
      setTimeout(settle, 450); // fallback if transitionend never fires
      // Move focus into the drawer for keyboard users
      const firstLink = links.querySelector('a');
      if (firstLink) setTimeout(() => firstLink.focus(), 240);
    }
    function close() {
      // Restore the transitionable transform before sliding out
      links.removeEventListener('transitionend', settle);
      links.style.transform = '';
      void links.offsetWidth; // force reflow so the restore takes effect
      body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      if (body.classList.contains('nav-open')) close();
      else open();
    }

    burger.addEventListener('click', toggle);
    backdrop.addEventListener('click', close);

    // Close after tapping a link (most are same-page or new-page nav)
    links.addEventListener('click', function (e) {
      const a = e.target.closest('a');
      if (a) close();
    });

    // Esc to dismiss
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('nav-open')) close();
    });

    // If viewport grows past mobile breakpoint, dismiss the drawer
    const mq = window.matchMedia('(min-width: 1041px)');
    const onChange = function (e) { if (e.matches) close(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);

    // Re-snap if the viewport changes while the drawer exists
    window.addEventListener('resize', function () {
      if (body.classList.contains('nav-open')) snapWidth();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
