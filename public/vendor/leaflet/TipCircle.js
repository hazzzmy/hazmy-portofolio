L.TipCircle = L.Circle.extend({
    initialize: function(latlng, options, legacyOptions) {
      // Create invisible marker
      this._tip = L.circleMarker([0,0], {opacity: 0, radius: 0});
      // Initialize as a normal Circle
      L.Circle.prototype.initialize.call(this, latlng, options, legacyOptions);
    },
    redraw: function() {
      L.Circle.prototype.redraw.call(this);
      this._setTip();
    },
    onAdd: function() {
      L.Circle.prototype.onAdd.call(this);
      this._setTip();
      this._tip.addTo(map);
    },
    onRemove: function() {
      this._tip.remove();
      L.Circle.prototype.onAdd.call(this);
    },
    _setTip: function() {
      // Set the location for the tooltip to latitude of the bottom of the circle's
      // bounding box, and the longitude of its centre.
      let tipText;
      
      this._tip.setLatLng([
        this.getBounds()._southWest.lat,
        this.getLatLng().lng]);
      // Set the label to the circle's radius in metres
      if (this.getRadius()>50){
        const radiusText = String(this.getRadius())
        tipText =`${radiusText} m <br>(Poor Accuracy)` ;
      } else {
        const radiusText = String(this.getRadius())
        tipText =`${radiusText} m <br>(Good Accuracy)` ;
      }
  
      // Remove any old tooltip and attach the new one
      this._tip.unbindTooltip();
      this._tip.bindTooltip(tipText, {
                              direction: 'center',
                              permanent: true,
                              className: 'circleTip'
                            });
    }
  });
  L.tipCircle = (latlng, options, legacyOptions) => new L.TipCircle(latlng, options, legacyOptions);