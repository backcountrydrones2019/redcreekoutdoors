/* Property-marking map for /hog-trap-request. Ported from the
   backcountrydrones.com hog assessment form. Satellite by default, street map
   as an option, pins and shaded areas per mode, undo, clear shading, use my
   location, address search (map-search.js) and corner dots (map-verts.js).

   RCIntakeMap.init(modes) builds it once Leaflet is loaded.
   RCIntakeMap.marks() returns { points, areas } for the submit payload. */
(function () {
  var map, mode, pins = [], polys = [], stack = [], drawing = null, MODES = [];
  var ORIGIN = { lat: 31.05, lng: -97.6 }; // Bell County

  function modeByKey(k) { for (var i = 0; i < MODES.length; i++) if (MODES[i].key === k) return MODES[i]; return MODES[0]; }
  function $(id) { return document.getElementById(id); }

  function mapStatus() {
    var el = $('map-status');
    if (!pins.length && !polys.length) { el.textContent = 'Nothing marked yet.'; return; }
    var bits = [];
    if (pins.length) bits.push(pins.length + ' point' + (pins.length > 1 ? 's' : ''));
    if (polys.length) bits.push(polys.length + ' area' + (polys.length > 1 ? 's' : ''));
    el.textContent = bits.join(', ') + ' marked.';
  }
  function pinIcon(color, label) {
    return L.divIcon({ className: 'pin', html: '<span style="background:' + color + '">' + label + '</span>', iconSize: [26, 26], iconAnchor: [13, 13] });
  }
  function vert(poly, ll) { if (window.rcVerts) window.rcVerts.add(map, poly, ll); }
  function unvert(poly) { if (window.rcVerts) window.rcVerts.clear(map, poly); }

  function init(modes) {
    if (map) return;
    MODES = modes; mode = MODES[0].key;
    map = L.map('map', { scrollWheelZoom: false }).setView([ORIGIN.lat, ORIGIN.lng], 9);
    var sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Imagery: Esri, Maxar, Earthstar Geographics' }).addTo(map);
    var street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' });
    L.control.layers({ Satellite: sat, Map: street }, null, { position: 'topright' }).addTo(map);

    (function wireSearch() {
      if (!window.RCMapSearch) { setTimeout(wireSearch, 100); return; }
      window.RCMapSearch.attach({
        map: map, input: $('map-search'), button: $('map-search-go'), results: $('map-search-results'), status: $('map-search-status'),
        onPick: function (lat, lon, label) { var a = document.querySelector('input[name="address"]'); if (a && !a.value) a.value = label; },
      });
    })();

    map.on('click', function (e) {
      var m = modeByKey(mode);
      if (m.kind === 'pin') {
        var count = 0;
        for (var i = 0; i < pins.length; i++) if (pins[i].kind === mode) count++;
        var mk = L.marker(e.latlng, { draggable: true, icon: pinIcon(m.color, String(count + 1)) }).addTo(map);
        mk.bindTooltip(m.label.replace(/^Mark /, ''));
        var rec = { kind: mode, marker: mk, label: m.label };
        pins.push(rec); stack.push({ t: 'pin', rec: rec });
      } else {
        if (!drawing || drawing._kind !== mode) {
          if (drawing) { polys.push({ kind: drawing._kind, poly: drawing }); stack.push({ t: 'poly', poly: drawing }); }
          // Thin outlines vanish on satellite imagery; bright yellow reads.
          drawing = L.polygon([e.latlng], { color: '#f2c200', weight: 4, opacity: 1, dashArray: mode === 'nogo' ? '6 6' : null, fillColor: '#f2c200', fillOpacity: 0.25 }).addTo(map);
          drawing._kind = mode; vert(drawing, e.latlng);
          $('map-hint').textContent = 'Keep tapping the corners. Tap "' + m.label + '" again to close it.';
        } else { drawing.addLatLng(e.latlng); vert(drawing, e.latlng); }
      }
      mapStatus();
    });

    document.querySelectorAll('[data-mode]').forEach(function (b) {
      b.addEventListener('click', function () {
        var next = b.dataset.mode;
        if (drawing && drawing._kind === next) {
          polys.push({ kind: next, poly: drawing }); stack.push({ t: 'poly', poly: drawing }); drawing = null;
          $('map-hint').textContent = modeByKey(next).hint; mapStatus(); return;
        }
        mode = next;
        document.querySelectorAll('[data-mode]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        $('map-hint').textContent = modeByKey(next).hint;
      });
    });

    // Clears shading only. Pins are facts about the property and stay.
    $('btn-clear-shade').addEventListener('click', function () {
      for (var i = 0; i < polys.length; i++) { unvert(polys[i].poly); map.removeLayer(polys[i].poly); }
      if (drawing) { unvert(drawing); map.removeLayer(drawing); drawing = null; }
      polys = []; stack = stack.filter(function (x) { return x.t !== 'poly'; }); mapStatus();
    });

    $('btn-undo').addEventListener('click', function () {
      var last = stack.pop();
      if (!last) return;
      if (last.t === 'pin') { map.removeLayer(last.rec.marker); pins = pins.filter(function (p) { return p !== last.rec; }); }
      if (last.t === 'poly') { unvert(last.poly); map.removeLayer(last.poly); polys = polys.filter(function (p) { return p.poly !== last.poly; }); if (drawing === last.poly) drawing = null; }
      mapStatus();
    });

    $('btn-locate').addEventListener('click', function () {
      var btn = this;
      if (!navigator.geolocation) { btn.textContent = 'Location not available'; return; }
      btn.textContent = 'Finding you...';
      navigator.geolocation.getCurrentPosition(
        function (pos) { map.setView(L.latLng(pos.coords.latitude, pos.coords.longitude), 16); btn.textContent = 'Use my location'; },
        function () { btn.textContent = 'Could not get location'; setTimeout(function () { btn.textContent = 'Use my location'; }, 2500); },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  function marks() {
    if (drawing) { polys.push({ kind: drawing._kind, poly: drawing }); drawing = null; }
    return {
      points: pins.map(function (p) { var ll = p.marker.getLatLng(); return { kind: p.kind, label: p.label, lat: +ll.lat.toFixed(6), lng: +ll.lng.toFixed(6) }; }),
      areas: polys.map(function (p) { return { kind: p.kind, points: p.poly.getLatLngs()[0].map(function (ll) { return [+ll.lat.toFixed(6), +ll.lng.toFixed(6)]; }) }; }),
    };
  }

  window.RCIntakeMap = { init: init, marks: marks };
})();
