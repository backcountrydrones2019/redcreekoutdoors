/**
 * Visible vertices for the shading polygons.
 *
 * THE PROBLEM THIS SOLVES. A Leaflet polygon draws the line between points and
 * nothing at the points themselves. The first tap therefore produces no visible
 * mark at all, and the second produces a hairline. On a phone the finger covers
 * the spot it just touched, so the only way to find out whether a tap
 * registered is to lift off and look. People then tap again, and again, which
 * is how you end up with six overlapping shapes and somebody giving up.
 *
 * A landowner in their seventies marking a pasture on a phone in the truck is
 * the person this form has to work for. Every tap now leaves a dot under the
 * finger that is big enough to see around it.
 *
 * WHY A LAYER GROUP PER POLYGON. The dots belong to their shape. Undo and Clear
 * shading remove the polygon, and the dots have to go with it rather than being
 * left floating over the imagery, so each polygon carries its own group.
 */
(function () {
  var R = 9;

  window.rcVerts = {
    /** Drop a dot at a point that was just added to `poly`. */
    add: function (map, poly, latlng) {
      if (!map || !poly || typeof L === 'undefined') return;
      if (!poly._verts) {
        poly._verts = L.layerGroup().addTo(map);
      }
      L.circleMarker(latlng, {
        radius: R,
        /* White ring, yellow centre. Satellite imagery is dark, busy and full
           of greens and browns, and this is the one combination that stays
           readable over pasture, roof, road and shadow alike. */
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillColor: '#f2c200',
        fillOpacity: 1,
        /* The dots are feedback, not controls. Letting them swallow taps would
           mean a second tap near the first one does nothing at all, which is
           exactly the confusion this is meant to remove. */
        interactive: false,
      }).addTo(poly._verts);
    },

    /** Remove the dots belonging to `poly`. Safe to call twice. */
    clear: function (map, poly) {
      if (!poly || !poly._verts) return;
      if (map) map.removeLayer(poly._verts);
      poly._verts = null;
    },
  };
})();
