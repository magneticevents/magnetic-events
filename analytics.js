/* Magnetic Events – Google Analytics 4 jen po výslovném souhlasu.
 * Měřicí ID webového streamu Magnetic Events: G-HKC5TJV83X.
 * Události odeslání formulářů neobsahují osobní údaje.
 */
(function () {
  'use strict';

  var measurementId = 'G-HKC5TJV83X';
  var enabled = /^G-[A-Z0-9]{6,20}$/.test(measurementId);
  var storageKey = 'magnetic_analytics_consent_v1';
  var selected = null;
  var initialized = false;
  var banner = null;

  function readChoice() {
    try {
      var stored = window.localStorage.getItem(storageKey);
      return stored === 'accepted' || stored === 'rejected' ? stored : null;
    } catch (e) { return null; }
  }

  function saveChoice(choice) {
    try { window.localStorage.setItem(storageKey, choice); } catch (e) { /* Souhlas platí jen v aktuální návštěvě. */ }
  }

  function clearGaCookies() {
    document.cookie.split(';').forEach(function (pair) {
      var name = pair.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
      document.cookie = name + '=; Max-Age=0; path=/; domain=.magneticevents.cz; SameSite=Lax';
    });
  }

  function initGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    // Základní Consent Mode: externí skript se načítá až po udělení souhlasu.
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  function startAnalytics() {
    if (!enabled) return;
    window['ga-disable-' + measurementId] = false;
    if (initialized) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    initialized = true;
    initGtag();
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true,
      allow_google_signals: false,
      cookie_expires: 15552000
    });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function updateSettings() {
    var status = document.getElementById('analytics-consent-status');
    if (status) {
      status.textContent = !enabled
        ? 'Měření zatím není aktivní.'
        : selected === 'accepted'
          ? 'Analytické cookies jsou povolené.'
          : selected === 'rejected'
            ? 'Analytické cookies jsou odmítnuté.'
            : 'Dosud jste nevybrali, zda analytické cookies povolíte.';
    }
    var yes = document.getElementById('analytics-accept');
    var no = document.getElementById('analytics-reject');
    if (yes) { yes.disabled = !enabled; yes.setAttribute('aria-pressed', selected === 'accepted' ? 'true' : 'false'); }
    if (no) { no.disabled = !enabled; no.setAttribute('aria-pressed', selected === 'rejected' ? 'true' : 'false'); }
  }

  function choose(allow) {
    if (!enabled) return;
    var wasRejected = selected === 'rejected';
    selected = allow ? 'accepted' : 'rejected';
    saveChoice(selected);
    if (allow) {
      startAnalytics();
      // Po opětovném povolení ve stejné návštěvě doměřit otevřenou stránku.
      if (wasRejected && initialized && window.gtag) {
        window.gtag('event', 'page_view', { page_location: window.location.href });
      }
    } else {
      if (initialized && window.gtag) {
        window.gtag('consent', 'update', { analytics_storage: 'denied' });
        window['ga-disable-' + measurementId] = true;
        clearGaCookies();
      }
    }
    if (banner) banner.hidden = true;
    updateSettings();
  }

  function showBanner() {
    if (!enabled || selected) return;
    banner = document.createElement('aside');
    banner.className = 'cookie-banner';
    banner.setAttribute('aria-label', 'Nastavení analytických cookies');
    banner.innerHTML =
      '<div class="cookie-banner-content">' +
      '<div><div class="cookie-title">Pomozte nám vylepšovat web.</div>' +
      '<p>Používáme volitelné analytické cookies Google Analytics 4 k měření návštěvnosti a zájmu o naše služby. Bez vašeho souhlasu analytiku nespustíme. <a href="/cookies.html">Více o cookies</a>.</p></div>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-outline" data-cookie-choice="reject">Odmítnout</button>' +
      '<button type="button" class="btn" data-cookie-choice="accept">Povolit analytiku</button>' +
      '</div></div>';
    document.body.appendChild(banner);
    banner.querySelector('[data-cookie-choice="reject"]').addEventListener('click', function () { choose(false); });
    banner.querySelector('[data-cookie-choice="accept"]').addEventListener('click', function () { choose(true); });
  }

  function setup() {
    if (!enabled) { updateSettings(); return; }
    selected = readChoice();
    if (selected === 'accepted') startAnalytics();
    else if (!selected) showBanner();

    var accept = document.getElementById('analytics-accept');
    var reject = document.getElementById('analytics-reject');
    if (accept) accept.addEventListener('click', function () { choose(true); });
    if (reject) reject.addEventListener('click', function () { choose(false); });
    updateSettings();
  }

  // Události se spustí výhradně po potvrzení úspěšného HTTP odeslání formuláře.
  // Neukládat ani neodesílat osobní údaje (jméno, e-mail, zprávu, termín apod.).
  window.MagneticAnalytics = {
    trackFormSuccess: function (type) {
      if (!enabled || selected !== 'accepted' || !initialized || !window.gtag) return;
      if (type === 'kontakt') window.gtag('event', 'contact_form_success');
      if (type === 'poptavka') window.gtag('event', 'inquiry_form_success');
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
