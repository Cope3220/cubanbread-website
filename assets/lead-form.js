/* ============================================================
   La Segunda · wholesale lead form (shared)
   Used by contact.html, es/contact.html and wholesale/<market>.html.

   Validates required fields + reCAPTCHA, then POSTs JSON to the
   SalesPower public website-lead intake endpoint.

   Endpoint:  POST https://salespower-production.up.railway.app/api/website-lead
   Owner:     Giuseppe Bua (SalesPower) — public, no auth, recaptcha-gated

   Field mapping (website -> SalesPower leads table):
     company_name      -> company        (renamed)
     contact_name, email, phone, city, state -> same-named columns
     business_type     -> business_type (own field) AND folded into `notes`
                          (Giuseppe reads notes)
     message           -> notes          (combined w/ business_type)
     market            -> market            (optional; set on wholesale/ pages)
     distributor_named -> distributor_named (optional select)
     source            -> source         (hardcoded "Website")
     recaptcha_token   -> verified server-side, not stored

   Google Ads / campaign attribution:
     gclid, gbraid, wbraid, utm_source, utm_medium, utm_campaign,
     utm_content, utm_term, matchtype, network
                       -> same-named columns; always sent, '' when unknown
     attr_captured_at  -> when the click params were first seen (ISO 8601)
     attr_landing_page -> the URL they arrived on
   These come from the first-touch record that assets/site.js writes to
   localStorage on whatever page the ad dropped the visitor, NOT from the
   URL of this page. site.js is loaded on every page; if it is ever missing
   the lead still goes through with blank attribution.

   The form element carries data-form-lang="en" | "es" (fixed per page, not
   the live language toggle) so the notes label and button text match what
   each page always sent.
============================================================ */
(function () {
  'use strict';

  const LEAD_ENDPOINT = 'https://salespower-production.up.railway.app/api/website-lead';

  const leadForm = document.getElementById('leadForm');
  const leadSuccess = document.getElementById('leadSuccess');
  const leadFormError = document.getElementById('leadFormError');
  if (!leadForm) return;

  const ES = leadForm.getAttribute('data-form-lang') === 'es';
  const T = ES
    ? { sending: 'Enviando… <span class="arr">→</span>', bizLabel: 'Tipo de Negocio' }
    : { sending: 'Sending… <span class="arr">→</span>', bizLabel: 'Business Type' };

  // required field names (in order)
  const REQUIRED = ['company_name', 'contact_name', 'email', 'phone', 'business_type', 'city', 'state'];

  function setFieldError(name, hasError) {
    const input = leadForm.querySelector(`[name="${name}"]`);
    if (!input) return;
    const field = input.closest('.lf-field');
    if (field) field.classList.toggle('invalid', !!hasError);
  }

  function validateForm(f) {
    let firstInvalid = null;
    let ok = true;

    REQUIRED.forEach(name => {
      const input = f.querySelector(`[name="${name}"]`);
      const val = (input && input.value || '').trim();
      let bad = !val;
      if (!bad && name === 'email') {
        bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }
      setFieldError(name, bad);
      if (bad) { ok = false; firstInvalid = firstInvalid || input; }
    });

    // reCAPTCHA
    const recaptchaWrap = f.querySelector('.lf-recaptcha');
    let captchaOk = false;
    try {
      captchaOk = typeof grecaptcha !== 'undefined' && grecaptcha.getResponse && grecaptcha.getResponse().length > 0;
    } catch (_) { captchaOk = false; }
    if (recaptchaWrap) recaptchaWrap.classList.toggle('invalid', !captchaOk);
    if (!captchaOk) { ok = false; firstInvalid = firstInvalid || recaptchaWrap; }

    if (firstInvalid && firstInvalid.focus) {
      try { firstInvalid.focus({ preventScroll: false }); } catch (_) { firstInvalid.focus(); }
    }
    return ok;
  }

  // Clear field-level errors as the user fixes them
  REQUIRED.forEach(name => {
    const input = leadForm.querySelector(`[name="${name}"]`);
    if (!input) return;
    input.addEventListener('input', () => setFieldError(name, false));
    input.addEventListener('change', () => setFieldError(name, false));
  });

  // Build the JSON payload (also exposed so the local attribution test can read it)
  function buildPayload() {
    const get = n => {
      const el = leadForm.querySelector(`[name="${n}"]`);
      return el ? (el.value || '').trim() : '';
    };
    let recaptchaToken = '';
    try { recaptchaToken = (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse()) || ''; } catch (_) {}

    const businessType = get('business_type');
    const messageText = get('message');
    const notes = [
      businessType ? `${T.bizLabel}: ${businessType}` : '',
      messageText
    ].filter(Boolean).join('\n\n');

    const attr = (typeof window.lsbAttribution === 'function') ? window.lsbAttribution() : {};
    const attrGet = n => (attr && typeof attr[n] === 'string') ? attr[n] : '';

    return {
      company:         get('company_name'),
      contact_name:    get('contact_name'),
      email:           get('email'),
      phone:           get('phone'),
      city:            get('city'),
      state:           get('state'),
      notes:           notes,
      source:          get('source'),
      recaptcha_token: recaptchaToken,

      // Optional wholesale fields (the server treats them as optional)
      business_type:     businessType,
      market:            get('market'),
      distributor_named: get('distributor_named'),

      gclid:             attrGet('gclid'),
      gbraid:            attrGet('gbraid'),
      wbraid:            attrGet('wbraid'),
      utm_source:        attrGet('utm_source'),
      utm_medium:        attrGet('utm_medium'),
      utm_campaign:      attrGet('utm_campaign'),
      utm_content:       attrGet('utm_content'),
      utm_term:          attrGet('utm_term'),
      matchtype:         attrGet('matchtype'),
      network:           attrGet('network'),
      attr_captured_at:  attrGet('captured_at'),
      attr_landing_page: attrGet('landing_page')
    };
  }
  window.lsbBuildLeadPayload = buildPayload;

  leadForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    leadFormError.classList.remove('show');

    if (!validateForm(leadForm)) return;

    const submitBtn = leadForm.querySelector('.lf-submit');
    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = T.sending;

    const payload = buildPayload();

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      // success
      leadForm.style.display = 'none';
      leadSuccess.classList.add('show');
      window.scrollTo({ top: leadSuccess.offsetTop, behavior: 'smooth' });
    } catch (err) {
      console.error('Lead submit failed:', err);
      leadFormError.classList.add('show');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
      try { if (typeof grecaptcha !== 'undefined') grecaptcha.reset(); } catch (_) {}
    }
  });
})();
