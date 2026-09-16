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

/* ============================================================
   La Segunda · Google Ads / campaign click attribution
   Runs on every page (this file is loaded site-wide, EN and es/).

   A visitor usually lands from an ad on one page and converts on
   another, so the ad-click params are stashed on first sight and
   read back at submit time by the lead form — never off the URL
   that happens to be in the bar when they hit Send.

   Storage:  localStorage["lsb_attr"], a JSON record holding the
             ten click params plus captured_at (ISO 8601) and
             landing_page (the full URL the params arrived on).
   Rule:     first touch wins — an existing, unexpired record is
             never overwritten.
   Expiry:   90 days after captured_at; a stale record is dropped
             and the next ad click starts a fresh one.

   Read it with window.lsbAttribution(): always returns every
   field, using '' for anything unknown, so callers can spread it
   into a payload without null checks.

   All storage access is wrapped — Safari private mode and blocked
   third-party-storage contexts throw on localStorage access, and
   attribution must never take a form submit down with it.
============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'lsb_attr';
  var TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
  var MAX_LEN = 500; // defensive cap; real gclids run ~90 chars

  var PARAMS = [
    'gclid',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'matchtype',
    'network',
    // Google sends gbraid/wbraid in place of gclid for iOS app-to-web
    // clicks, where ATT blocks the gclid. Same job, different param.
    'gbraid',
    'wbraid'
  ];

  function blankRecord() {
    var rec = {};
    PARAMS.forEach(function (k) { rec[k] = ''; });
    rec.captured_at = '';
    rec.landing_page = '';
    return rec;
  }

  function rawRecord() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }

  function dropRecord() {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }

  // Returns the stored record, or null if absent, unreadable, or expired.
  function readRecord() {
    var raw = rawRecord();
    if (!raw) return null;

    var rec;
    try { rec = JSON.parse(raw); } catch (_) { return null; }
    if (!rec || typeof rec !== 'object') return null;

    var at = Date.parse(rec.captured_at);
    if (!at || (Date.now() - at) > TTL_MS) return null;

    return rec;
  }

  function capture() {
    var params;
    try { params = new URLSearchParams(window.location.search); } catch (_) { return; }

    var rec = blankRecord();
    var found = false;
    PARAMS.forEach(function (k) {
      var v = params.get(k);
      if (v) { rec[k] = String(v).slice(0, MAX_LEN); found = true; }
    });

    var existing = readRecord();

    // Clear a record that's expired or corrupt so it can't be read back
    // half-alive and so the next ad click isn't blocked by it.
    if (!existing && rawRecord()) dropRecord();

    if (!found) return;   // ordinary page view — nothing to attribute
    if (existing) return; // first touch wins

    rec.captured_at = new Date().toISOString();
    rec.landing_page = window.location.href;

    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rec)); } catch (_) {}
  }

  window.lsbAttribution = function () {
    var stored = readRecord() || {};
    var out = blankRecord();
    Object.keys(out).forEach(function (k) {
      if (typeof stored[k] === 'string') out[k] = stored[k];
    });
    return out;
  };

  capture();
})();
