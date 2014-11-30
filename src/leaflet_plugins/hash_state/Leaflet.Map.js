//@require leaflet
//@require leaflet.hash_state.js
(function() {
    "use strict";
    L.Map.include(L.Mixin.HashState);

    L.Map.include({
        stateChangeEvents: ['moveend'],

        _serializeState: function() {
            var center = this.getCenter();
            var zoom = this.getZoom();
            var precision = 5;
            var state = [
                zoom,
                center.lat.toFixed(precision),
                center.lng.toFixed(precision),
            ];
           return state;
        },

        _unserializeState: function(values) {
            if (!values || values.length != 3) {
                return false;
            }
            var zoom = parseInt(values[0], 10),
                lat  = parseFloat(values[1]),
                lng  = parseFloat(values[2]);
            if (isNaN(zoom) || isNaN(lat) || isNaN(lng) || zoom < 0 || zoom > 32 || lat < -90 || lat > 90 || lng < -180 || lng > 180)
                {
                    return false;
                }
            this._updating_state = true;
            this.setView([lat, lng], zoom);
            this._updating_state = false;
            return true;
        },
    });
})();
