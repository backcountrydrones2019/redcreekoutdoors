/**
 * Backcountry Drones address search for the intake maps.
 *
 * Landowners do not always know where their place is on a satellite tile, and a
 * frightened dog does not go missing at a mapped address. This lets someone type
 * "1234 FM 2484, Salado TX" or a county road and have the map fly there, then
 * drop their pins by hand from a view they recognize.
 *
 * GEOCODER: Nominatim, the OpenStreetMap service. No API key, no account, no
 * third-party script, no cookies. Their usage policy is real and it shapes this
 * file, so read this before changing anything:
 *
 *   1. NO AUTOCOMPLETE. The policy says outright that per-keystroke search "must
 *      not" be implemented client side. That is why this searches on Enter or on
 *      the button and never while typing. Do not add a debounced keyup handler.
 *   2. Absolute maximum one request per second. MIN_GAP_MS enforces it.
 *   3. Repeated identical queries can get you blocked, so answers are cached for
 *      the life of the page.
 *   4. Attribution is required. The markup carries it next to the box, because
 *      the satellite layer is the default and its Esri credit does not cover this.
 *
 * Commercial use of this shape is within the policy: user-triggered searches
 * from a moderate-sized user base. What is not allowed is bulk geocoding or any
 * service whose main job is geocoding. If this ever starts getting rate limited,
 * the fix is a paid geocoder behind the Worker, not a faster retry loop here.
 *
 * SECURITY: result text is written with textContent, never innerHTML. These
 * strings come off a public API and are treated as untrusted.
 */
(function () {
  var ENDPOINT = 'https://nominatim.openstreetmap.org/search';
  var MIN_GAP_MS = 1100;
  var lastCallAt = 0;
  var cache = {};

  function attach(opts) {
    var map = opts.map;
    var input = opts.input;
    var button = opts.button;
    var list = opts.results;
    var status = opts.status;
    var onPick = opts.onPick;
    if (!map || !input || !list) return;

    function say(msg) {
      if (status) status.textContent = msg || '';
    }

    function clear() {
      while (list.firstChild) list.removeChild(list.firstChild);
      list.hidden = true;
    }

    function pick(hit) {
      var lat = parseFloat(hit.lat);
      var lon = parseFloat(hit.lon);
      if (isNaN(lat) || isNaN(lon)) return;
      map.setView([lat, lon], 16);
      clear();
      say('Moved to ' + hit.display_name + '. Drop your pins from here.');
      input.value = hit.display_name;
      if (typeof onPick === 'function') onPick(lat, lon, hit.display_name);
    }

    function render(hits) {
      clear();
      if (!hits.length) {
        say('Nothing found. Try the nearest town, a county road, or a crossroads.');
        return;
      }
      for (var i = 0; i < hits.length; i++) {
        (function (hit) {
          var li = document.createElement('li');
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'mapsearch__hit';
          b.textContent = hit.display_name;
          b.addEventListener('click', function () {
            pick(hit);
          });
          li.appendChild(b);
          list.appendChild(li);
        })(hits[i]);
      }
      list.hidden = false;
      say(hits.length + (hits.length === 1 ? ' match.' : ' matches. Pick one.'));
    }

    function search() {
      var q = (input.value || '').trim();
      if (q.length < 3) {
        say('Type a few more characters.');
        return;
      }
      if (cache[q]) {
        render(cache[q]);
        return;
      }

      var wait = Math.max(0, MIN_GAP_MS - (Date.now() - lastCallAt));
      say('Searching...');
      setTimeout(function () {
        lastCallAt = Date.now();
        var url =
          ENDPOINT +
          '?format=jsonv2&addressdetails=1&limit=5&countrycodes=us&q=' +
          encodeURIComponent(q);

        fetch(url, { headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
          })
          .then(function (data) {
            var hits = Array.isArray(data) ? data : [];
            cache[q] = hits;
            render(hits);
          })
          .catch(function () {
            clear();
            say('Address lookup is not answering. Drop the pin by hand, or type the address in the form below and we will find it.');
          });
      }, wait);
    }

    if (button) button.addEventListener('click', search);

    // Enter inside a form submits the form. Not here it does not.
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        search();
      } else if (e.key === 'Escape') {
        clear();
        say('');
      }
    });
  }

  window.RCMapSearch = { attach: attach };
})();
