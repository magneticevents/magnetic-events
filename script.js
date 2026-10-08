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
  tel: '+420 777 781 315',
  email: 'poptavky@magneticevents.cz'
};

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

  // předvyplnění z odkazů (?datum=…&hosti=…&typ=…&vybaveni=…)
  var q = new URLSearchParams(location.search);
  if (q.get('datum')) form.datum.value = q.get('datum');
  if (q.get('hosti')) form.hosti.value = q.get('hosti');
  var typ = q.get('typ');
  if (typ) Array.prototype.forEach.call(form.querySelectorAll('input[name=typ]'), function (r) {
    if (typ.toLowerCase().indexOf(r.value.split(' ')[0].toLowerCase().slice(0, 5)) === 0) r.checked = true;
  });
  var vyb = q.get('vybaveni');
  if (vyb) form.zprava.value = 'Zajímá mě: ' + vyb;

  function show(msg) { err.textContent = msg; err.hidden = !msg; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    show('');
    if (form._gotcha.value) return; // spam
    if (!form.datum.value || !form.hosti.value || !form.jmeno.value.trim() || !form.email.value.trim()) {
      show('Vyplňte prosím datum, počet hostů, jméno a e-mail.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.value)) {
      show('Zkontrolujte prosím e-mail.');
      return;
    }
    var potreba = Array.prototype.map.call(form.querySelectorAll('input[name=potreba]:checked'), function (c) { return c.value; }).join(', ');
    var data = {
      'Datum akce': form.datum.value, 'Počet hostů': form.hosti.value, 'Místo': form.misto.value,
      'Typ akce': (form.querySelector('input[name=typ]:checked') || {}).value || '',
      'Potřebuje': potreba, 'Jméno': form.jmeno.value, 'Telefon': form.telefon.value,
      'E-mail': form.email.value, 'Zpráva': form.zprava.value,
      _subject: 'Poptávka z webu Magnetic Events', _replyto: form.email.value
    };
    function ok() { form.hidden = true; done.hidden = false; done.scrollIntoView({ behavior: 'smooth', block: 'center' }); }

    if (CONFIG.formEndpoint) {
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true;
      fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); ok(); })
        .catch(function () { btn.disabled = false; show('Odeslání se nepovedlo. Zkuste to prosím znovu nebo nám napište na ' + CONFIG.fallbackEmail + '.'); });
    } else {
      var body = Object.keys(data).filter(function (k) { return k.charAt(0) !== '_'; }).map(function (k) { return k + ': ' + data[k]; }).join('\n');
      location.href = 'mailto:' + CONFIG.fallbackEmail + '?subject=' + encodeURIComponent(data._subject) + '&body=' + encodeURIComponent(body);
      ok();
    }
  });
})();

// Kontaktní formulář
(function () {
  var form = document.getElementById('kontakt');
  if (!form) return;
  var error = document.getElementById('kontakt-error');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    error.hidden = true;
    if (form.elements._gotcha.value || !form.reportValidity()) return;
    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Odesílání…';
    fetch(CONFIG.formEndpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ 'Jméno': form.elements.jmeno.value.trim(), email: form.elements.email.value.trim(), 'Telefon': form.elements.telefon.value.trim(), message: form.elements.zprava.value.trim(), _subject: 'Kontaktní zpráva z webu Magnetic Events', _replyto: form.elements.email.value.trim() })
    }).then(function (response) {
      if (!response.ok) throw new Error('Odeslání selhalo');
      form.hidden = true;
      document.getElementById('kontakt-done').hidden = false;
    }).catch(function () {
      error.textContent = 'Zprávu se nepodařilo odeslat. Zkuste to znovu nebo napište na ' + CONFIG.fallbackEmail + '.';
      error.hidden = false;
    }).finally(function () { button.disabled = false; button.textContent = 'Odeslat zprávu'; });
  });
})();
