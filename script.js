/* Mobilní navigace */
(function () {
  var menu = document.querySelector('.mobile-menu');
  if (!menu) return;
  var toggle = menu.querySelector('.menu-toggle');
  var links = menu.querySelector('.mobile-links');
  function setOpen(open, restoreFocus) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    links.hidden = !open;
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  links.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });
  function closeOutside(event) {
    if (!menu.contains(event.target)) setOpen(false);
  }
  document.addEventListener('pointerdown', closeOutside);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });
  var desktop = window.matchMedia('(min-width: 1101px)');
  function onResize(event) { if (event.matches) setOpen(false); }
  if (desktop.addEventListener) desktop.addEventListener('change', onResize);
  else if (desktop.addListener) desktop.addListener(onResize);
  setOpen(false);
})();

/* ===== NASTAVENÍ ===== */
var CONFIG = {
  // Adresa formuláře z Formspree
  formEndpoint: 'https://formspree.io/f/xqpepgre',
  // Záložní e-mail, když formulář selže
  fallbackEmail: 'poptavky@magneticevents.cz',
  // Kontakty zobrazené na webu
  firma: 'Tomáš Wolf',
  ico: '08817740',
  adresa: 'Krásná 239, 739 04 Krásná',
  email: 'poptavky@magneticevents.cz'
};


/* Form feedback is localised; Formspree field keys remain in Czech for the inbox workflow. */
var PAGE_LANG = /^(en|pl)$/.test(document.documentElement.lang) ? document.documentElement.lang : 'cs';
var FORM_UI = {
  cs: { sending: 'Odesílání…', requestSubmit: 'Odeslat nezávaznou poptávku', contactSubmit: 'Odeslat zprávu', requestError: 'Poptávku se nepodařilo odeslat. Zkuste to znovu nebo napište na ', contactError: 'Zprávu se nepodařilo odeslat. Zkuste to znovu nebo napište na ' },
  en: { sending: 'Sending…', requestSubmit: 'Send a no-obligation enquiry', contactSubmit: 'Send message', requestError: 'The enquiry could not be sent. Please try again or email ', contactError: 'The message could not be sent. Please try again or email ' },
  pl: { sending: 'Wysyłanie…', requestSubmit: 'Wyślij niezobowiązujące zapytanie', contactSubmit: 'Wyślij wiadomość', requestError: 'Nie udało się wysłać zapytania. Spróbuj ponownie lub napisz na ', contactError: 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz na ' }
};
var FEEDBACK = FORM_UI[PAGE_LANG];

// vyplnění kontaktů na všech stránkách
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('[data-k]'), function (el) {
    var v = CONFIG[el.getAttribute('data-k')];
    if (v) el.textContent = v;
  });
})();

(function () {
  var form = document.getElementById('poptavka');
  if (!form) return;
  var err = document.getElementById('err');
  var done = document.getElementById('done');
  var q = new URLSearchParams(location.search);
  var choice = (q.get('sluzba') || '').toLowerCase();
  var chosen = {
    event: 'Technická produkce', technika: 'Technická produkce',
    kreativa: 'Grafika a vizualizace', konzultace: 'Konzultace'
  };
  if (chosen[choice]) form.elements.sluzba.value = chosen[choice];
  else if (q.get('vybaveni')) form.elements.sluzba.value = 'Technická produkce';
  if (q.get('datum')) form.elements.datum.value = q.get('datum');
  if (q.get('hosti')) form.elements.hosti.value = q.get('hosti');
  var parts = [];
  if (q.get('vybaveni')) parts.push('Zajímá mě: ' + q.get('vybaveni'));
  if (q.get('typ')) parts.push('Typ akce: ' + q.get('typ'));
  if (parts.length) form.elements.zprava.value = parts.join('\n');
  if (q.get('datum') || q.get('hosti')) form.querySelector('.request-details').open = true;
  function show(msg) { err.textContent = msg; err.hidden = !msg; }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    show('');
    if (form.elements._gotcha.value || !form.reportValidity()) return;
    var data = {
      'Jazyk webu': PAGE_LANG.toUpperCase(),
      'Typ služby': form.elements.sluzba.value,
      'Jméno a firma': form.elements.jmeno.value.trim(),
      'E-mail': form.elements.email.value.trim(),
      'Zadání': form.elements.zprava.value.trim(),
      'Datum akce': form.elements.datum.value,
      'Počet hostů': form.elements.hosti.value,
      'Místo konání': form.elements.misto.value.trim(),
      email: form.elements.email.value.trim(),
      _subject: 'Nová B2B poptávka z webu Magnetic Events',
      _replyto: form.elements.email.value.trim()
    };
    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = FEEDBACK.sending;
    fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (response) {
      if (!response.ok) throw new Error('Odeslání selhalo');
      if (window.MagneticAnalytics) window.MagneticAnalytics.trackFormSuccess('poptavka');
      form.hidden = true;
      done.hidden = false;
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }).catch(function () {
      show(FEEDBACK.requestError + CONFIG.fallbackEmail + '.');
    }).finally(function () {
      button.disabled = false;
      button.textContent = FEEDBACK.requestSubmit;
    });
  });
})();

// Kontaktní formulář
(function () {
  var form = document.getElementById('kontakt');
  if (!form) return;
  var service = new URLSearchParams(location.search).get('sluzba');
  var subjects = { cisteni: 'Mám zájem o čištění stanu u vašeho partnera.', koncept: 'Mám zájem o návrh tématu a stylu akce.', vizualizace: 'Mám zájem o vizuální návrh akce.', grafika: 'Mám zájem o grafiku pro akci.' };
  if (subjects[service]) form.elements.zprava.value = subjects[service] + '\n\n';
  var error = document.getElementById('kontakt-error');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    error.hidden = true;
    if (form.elements._gotcha.value || !form.reportValidity()) return;
    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = FEEDBACK.sending;
    fetch(CONFIG.formEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ 'Jazyk webu': PAGE_LANG.toUpperCase(), 'Jméno': form.elements.jmeno.value.trim(), email: form.elements.email.value.trim(), message: form.elements.zprava.value.trim(), _subject: 'Kontaktní zpráva z webu Magnetic Events', _replyto: form.elements.email.value.trim() })
    }).then(function (response) {
      if (!response.ok) throw new Error('Odeslání selhalo');
      if (window.MagneticAnalytics) window.MagneticAnalytics.trackFormSuccess('kontakt');
      form.hidden = true;
      document.getElementById('kontakt-done').hidden = false;
    }).catch(function () {
      error.textContent = FEEDBACK.contactError + CONFIG.fallbackEmail + '.';
      error.hidden = false;
    }).finally(function () { button.disabled = false; button.textContent = FEEDBACK.contactSubmit; });
  });
})();

