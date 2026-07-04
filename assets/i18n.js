/* ============================================================
   La Segunda · one-click site-wide EN/ES toggle
   - Persists choice in localStorage across every page.
   - Elements carry data-es="<spanish markup>"; original (English)
     markup is cached the first time it's touched so it can be
     restored exactly.
   - Attribute variants: data-es-placeholder / data-es-aria-label /
     data-es-title / data-es-alt swap the matching real attribute.
   - Client-side only: does not change the page's crawlable HTML
     or hreflang — see /es/ pages for that.
============================================================ */
(function(){
  var STORAGE_KEY = 'site-lang';

  function getLang(){
    try { return localStorage.getItem(STORAGE_KEY) || 'en'; } catch(e){ return 'en'; }
  }
  function setLang(l){
    try { localStorage.setItem(STORAGE_KEY, l); } catch(e){}
  }

  var ATTR_MAP = {
    'data-es-placeholder': 'placeholder',
    'data-es-aria-label': 'aria-label',
    'data-es-title': 'title',
    'data-es-alt': 'alt'
  };

  function applyLang(lang){
    var isEs = lang === 'es';
    document.documentElement.setAttribute('lang', isEs ? 'es' : 'en');
    document.documentElement.setAttribute('data-site-lang', isEs ? 'es' : 'en');

    document.querySelectorAll('[data-es]').forEach(function(el){
      if(!el.hasAttribute('data-en-cache')){
        el.setAttribute('data-en-cache', el.innerHTML);
      }
      el.innerHTML = isEs ? el.getAttribute('data-es') : el.getAttribute('data-en-cache');
    });

    Object.keys(ATTR_MAP).forEach(function(dataAttr){
      var realAttr = ATTR_MAP[dataAttr];
      document.querySelectorAll('[' + dataAttr + ']').forEach(function(el){
        var cacheAttr = 'data-en-cache-' + realAttr;
        if(!el.hasAttribute(cacheAttr)){
          el.setAttribute(cacheAttr, el.getAttribute(realAttr) || '');
        }
        el.setAttribute(realAttr, isEs ? el.getAttribute(dataAttr) : el.getAttribute(cacheAttr));
      });
    });

    document.querySelectorAll('.lang-toggle-label').forEach(function(el){
      el.textContent = isEs ? 'English' : 'Español';
    });
    document.querySelectorAll('[data-lang-toggle]').forEach(function(el){
      el.setAttribute('aria-pressed', isEs ? 'true' : 'false');
    });
    document.querySelectorAll('[data-lang-set]').forEach(function(el){
      el.classList.toggle('on', el.getAttribute('data-lang-set') === (isEs ? 'es' : 'en'));
    });

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: isEs ? 'es' : 'en' } }));
  }

  function toggleLang(){
    var next = getLang() === 'es' ? 'en' : 'es';
    setLang(next);
    applyLang(next);
  }

  window.SiteLang = {
    get: getLang,
    set: function(l){ setLang(l); applyLang(l); },
    toggle: toggleLang,
    apply: applyLang
  };

  function init(){
    applyLang(getLang());
    document.querySelectorAll('[data-lang-toggle]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        toggleLang();
      });
    });
    document.querySelectorAll('[data-lang-set]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        window.SiteLang.set(btn.getAttribute('data-lang-set'));
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
