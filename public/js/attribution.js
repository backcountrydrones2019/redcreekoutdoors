/* First landing page and referrer, kept for the visit so every form can send
   them with the lead. sessionStorage can throw in private windows; the form
   still works without it. */
(function () {
  try {
    var s = window.sessionStorage;
    if (!s.getItem('rc_land')) {
      s.setItem('rc_land', location.pathname + location.search);
      s.setItem('rc_ref', document.referrer || '');
    }
  } catch (e) {}
})();
