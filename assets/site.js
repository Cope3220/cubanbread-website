/* ============================================================
   La Segunda · shared site behaviors
   - Mobile nav drawer toggle
   - Backdrop dismiss + Esc to close + scroll lock
   - Auto-close after tapping a link
============================================================ */
(function () {
  'use strict';

  function init() {
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

    function open() {
      body.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      // Move focus into the drawer for keyboard users
      const firstLink = links.querySelector('a');
      if (firstLink) setTimeout(() => firstLink.focus(), 240);
    }
    function close() {
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
    const mq = window.matchMedia('(min-width: 981px)');
    const onChange = function (e) { if (e.matches) close(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
