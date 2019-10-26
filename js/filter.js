'use strict';

(function () {

  var filters = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any'
  };

  var filterFeatures = {
    wifi: false,
    dishwasher: false,
    parking: false,
    washer: false,
    elevator: false,
    conditioner: false,
  };

  var valueFilterPriceToCount = {
    low: {min: 0, max: 9999},
    middle: {min: 10000, max: 49999},
    high: {min: 50000, max: Infinity},
  };

  function compareNumeric(a, b) {
    var status;

    if (a > b) {
      status = 1;
    }
    if (a === b) {
      status = 0;
    }
    if (a < b) {
      status = -1;
    }

    return status;
  }

  window.filter = {
    setFilter: function (key, value) {
      filters[key] = value;
    },

    setFilterFeatures: function (key, value) {
      filterFeatures[key] = value;
    },

    countPins: function (ads, pinMain) {
      var currentCoordinatesPinMain = window.page.getCurrentCoordinates(pinMain).split(', ').map(function (el) {
        return parseInt(el, 10);
      });

      var newAds = ads.slice();

      newAds.forEach(function (ad) {
        var points = 0;
        var differenceX = currentCoordinatesPinMain[0] - ad.location.x;
        var differenceY = currentCoordinatesPinMain[1] - ad.location.y;
        var pointsX = Math.abs(differenceX) / 10;
        var pointsY = Math.abs(differenceY) / 10;
        points = pointsX + pointsY;
        ad.points = points;
      });

      Object.keys(filters).forEach(function (filter) {
        if (filters[filter] === 'any') {
          return;
        }

        newAds = newAds.filter(function (ad) {
          if (filter === 'price') {
            return ad.offer.price >= valueFilterPriceToCount[filters[filter]].min &&
                   ad.offer.price <= valueFilterPriceToCount[filters[filter]].max;
          }
          return String(ad.offer[filter]) === filters[filter];
        });
      });

      Object.keys(filterFeatures).forEach(function (filter) {
        if (!filterFeatures[filter]) {
          return;
        }

        newAds = newAds.filter(function (ad) {
          var searchFeature = ad.offer.features.find(function (el) {
            return el === filter;
          });
          return (searchFeature) ? true : false;
        });
      });

      newAds.sort(function (a, b) {
        return compareNumeric(a.points, b.points);
      }).splice(5, newAds.length - 1);

      return newAds;
    }
  };
})();
