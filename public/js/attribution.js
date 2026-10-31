/* Lead attribution, ported from backcountrydrones.com. One question: where
   did this lead come from?

   FIRST TOUCH, NOT LAST. Somebody lands on the Salado town page from Google,
   reads it, then submits from /hog-trap-request. Last touch credits the form
   page, which is where every lead submits. So the first page of the visit and
   the referrer that brought them are recorded once, and every form carries
   them.

   sessionStorage, not a cookie: no consent banner, nothing cross-site, gone
   when the tab closes, and it only leaves the tab inside a form the visitor
   chose to send. No IP, no fingerprint, no identifier. Keep it that way.

   rc_land / rc_ref are kept for the forms that still read them. */
(function () {
  var KEY = 'rc_attr';
  try {
    var s = window.sessionStorage;
    if (!s.getItem('rc_land')) {
      s.setItem('rc_land', location.pathname + location.search);
      s.setItem('rc_ref', document.referrer || '');
    }
    if (!s.getItem(KEY)) {
      var ref = document.referrer || '', host = '';
      try { if (ref) host = new URL(ref).hostname; } catch (e) {}
      // A referrer from our own site is navigation, not a source.
      if (host && host.replace(/^www\./, '') === location.hostname.replace(/^www\./, '')) { ref = ''; host = ''; }
      var attr = { landing: (location.pathname + location.search).slice(0, 300), referrer: ref.slice(0, 300), referrerHost: host, at: new Date().toISOString() };
      var q = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach(function (k) {
        var v = q.get(k); if (v) attr[k] = String(v).slice(0, 120);
      });
      s.setItem(KEY, JSON.stringify(attr));
    }
  } catch (e) {
    /* Private mode or storage off. Attribution must never be why a form fails. */
  }
  window.rcAttribution = function () {
    try {
      var raw = sessionStorage.getItem(KEY), a = raw ? JSON.parse(raw) : {};
      a.submittedFrom = location.pathname;
      return a;
    } catch (e) { return { submittedFrom: location.pathname }; }
  };
})();
