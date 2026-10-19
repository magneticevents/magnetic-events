/* Magnetic Events – Google Analytics 4 a měření reklam jen podle výslovné volby.
 * Měřicí ID webového streamu Magnetic Events: G-HKC5TJV83X.
 * Události odeslání formulářů neobsahují osobní údaje.
 */
(function () {
  'use strict';

  var measurementId = 'G-HKC5TJV83X';
  var adsId = 'AW-18508886463';
  var adsConversion = adsId + '/ShIyCMOzrKIdEL_j3PlE';
  var adsConfigured = false;
  var enabled = /^G-[A-Z0-9]{6,20}$/.test(measurementId);
  var storageKey = 'magnetic_analytics_consent_v1';
  var selected = null;
  var adsStorageKey = 'magnetic_ads_measurement_consent_v1';
  var adsSelected = null;
  var initialized = false;
  var banner = null;

  function readChoice(key) {
    try {
      var stored = window.localStorage.getItem(key || storageKey);
      return stored === 'accepted' || stored === 'rejected' ? stored : null;
    } catch (e) { return null; }
  }

  function saveChoice(choice, key) {
    try { window.localStorage.setItem(key || storageKey, choice); } catch (e) { /* Souhlas platí jen v aktuální návštěvě. */ }
  }

  function clearCookies(pattern) {
    document.cookie.split(';').forEach(function (pair) {
      var name = pair.split('=')[0].trim();
      if (!pattern.test(name)) return;
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
    applyConsent();
  }

  function applyConsent() {
    if (!window.gtag) return;
    window.gtag('consent', 'update', {
      analytics_storage: selected === 'accepted' ? 'granted' : 'denied',
      ad_storage: selected === 'accepted' && adsSelected === 'accepted' ? 'granted' : 'denied',
      ad_user_data: selected === 'accepted' && adsSelected === 'accepted' ? 'granted' : 'denied',
      ad_personalization: 'denied'
    });
  }

  function configureAds() {
    if (adsSelected !== 'accepted' || selected !== 'accepted' || adsConfigured) return;
    window.gtag('config', adsId, { allow_ad_personalization_signals: false });
    adsConfigured = true;
  }

  function startAnalytics() {
    if (!enabled) return;
    window['ga-disable-' + measurementId] = false;
    if (initialized) {
      applyConsent();
      configureAds();
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
    configureAds();
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function updateSettings() {
    var status = document.getElementById('analytics-consent-status');
    if (status) status.textContent = !enabled ? 'Měření zatím není aktivní.' :
      'Analytika: ' + (selected === 'accepted' ? 'povolena' : selected === 'rejected' ? 'odmítnuta' : 'bez souhlasu') +
      '. Měření účinnosti reklam: ' + (adsSelected === 'accepted' && selected === 'accepted' ? 'povoleno' : adsSelected === 'rejected' ? 'odmítnuto' : 'bez souhlasu') +
      '. Personalizovaná reklama je vypnutá.';
    ['analytics-accept', 'analytics-accept-ads', 'analytics-reject'].forEach(function (id) {
      var button = document.getElementById(id);
      if (button) {
        button.disabled = !enabled;
        button.setAttribute('aria-pressed', id === 'analytics-accept-ads'
          ? String(selected === 'accepted' && adsSelected === 'accepted')
          : id === 'analytics-accept' ? String(selected === 'accepted' && adsSelected !== 'accepted')
          : String(selected === 'rejected'));
      }
    });
  }

  function choose(allow, allowAds) {
    if (!enabled) return;
    var wasRejected = selected === 'rejected';
    var wasInitialized = initialized;
    selected = allow ? 'accepted' : 'rejected';
    adsSelected = allow && allowAds ? 'accepted' : 'rejected';
    saveChoice(selected);
    saveChoice(adsSelected, adsStorageKey);
    if (allow) {
      startAnalytics();
      if (wasRejected && wasInitialized && window.gtag) {
        window.gtag('event', 'page_view', { page_location: window.location.href });
      }
    } else if (initialized && window.gtag) {
      applyConsent();
      window['ga-disable-' + measurementId] = true;
      clearCookies(/^_ga(?:_|$)/);
    }
    if (adsSelected !== 'accepted') clearCookies(/^_gcl_/);
    if (banner) banner.hidden = true;
    updateSettings();
  }

  function showBanner() {
    if (!enabled || adsSelected !== null) return;
    banner = document.createElement('aside');
    banner.className = 'cookie-banner';
    banner.setAttribute('aria-label', 'Nastavení cookies a měření reklam');
    banner.innerHTML =
      '<div class="cookie-banner-content">' +
      '<div><div class="cookie-title">Vyberte si, co nám dovolíte měřit.</div>' +
      '<p>Volitelně používáme Google Analytics k měření návštěvnosti. Můžete zvlášť povolit i měření účinnosti Google Ads, které spojuje kliknutí na reklamu s odesláním formuláře. Personalizovanou reklamu nepoužíváme. <a href="/cookies.html">Více o cookies</a>.</p></div>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-outline" data-cookie-choice="reject">Odmítnout</button>' +
      '<button type="button" class="btn btn-outline" data-cookie-choice="accept">Jen analytika</button>' +
      '<button type="button" class="btn" data-cookie-choice="ads">Povolit i měření reklam</button>' +
      '</div></div>';
    document.body.appendChild(banner);
    banner.querySelector('[data-cookie-choice="reject"]').addEventListener('click', function () { choose(false, false); });
    banner.querySelector('[data-cookie-choice="accept"]').addEventListener('click', function () { choose(true, false); });
    banner.querySelector('[data-cookie-choice="ads"]').addEventListener('click', function () { choose(true, true); });
  }

  function setup() {
    if (!enabled) { updateSettings(); return; }
    selected = readChoice();
    adsSelected = readChoice(adsStorageKey);
    // Dřívější odmítnutí zachovat; starý souhlas s analytikou není souhlas s reklamami.
    if (selected === 'rejected' && adsSelected === null) {
      adsSelected = 'rejected';
      saveChoice(adsSelected, adsStorageKey);
    }
    if (selected === 'accepted') startAnalytics();
    showBanner();

    var accept = document.getElementById('analytics-accept');
    var reject = document.getElementById('analytics-reject');
    var acceptAds = document.getElementById('analytics-accept-ads');
    if (accept) accept.addEventListener('click', function () { choose(true); });
    if (acceptAds) acceptAds.addEventListener('click', function () { choose(true, true); });
    if (reject) reject.addEventListener('click', function () { choose(false); });
    updateSettings();
  }

  // Události se spustí výhradně po potvrzení úspěšného HTTP odeslání formuláře.
  // Neukládat ani neodesílat osobní údaje (jméno, e-mail, zprávu, termín apod.).
  window.MagneticAnalytics = {
    trackFormSuccess: function (type) {
      if (!enabled || selected !== 'accepted' || !initialized || !window.gtag) return;
      if (type === 'kontakt') window.gtag('event', 'contact_form_success');
      if (type === 'poptavka') {
        window.gtag('event', 'inquiry_form_success');
        if (adsSelected === 'accepted') {
          window.gtag('event', 'conversion', { send_to: adsConversion });
        }
      }
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
