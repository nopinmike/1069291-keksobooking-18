'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 65;

  var heightRestrictions = {
    top: 130,
    bottom: 630
  };

  var isDisabled = false;

  var pinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters-container');

  var pins = [];

  function setDisabled(formInteractiveElements) {
    formInteractiveElements.forEach(function (el) {
      el.disabled = isDisabled;
    });
  }

  window.setting = {
    getPins: function () {
      return pins;
    },

    setPins: function (value) {
      pins = value;
    },

    getPinSizes: function () {
      return [PIN_WIDTH, PIN_HEIGHT];
    },

    getPinMainSizes: function () {
      return [PIN_MAIN_WIDTH, PIN_MAIN_HEIGHT];
    },

    getHeightRestrictions: function () {
      return heightRestrictions;
    },

    getStatusPage: function () {
      return isDisabled;
    },

    setStatusPage: function (value) {
      isDisabled = value;
      this.togglePage();
    },

    getCurrentCoordinates: function () {
      var x;
      var y;

      x = Math.round(parseInt(pinMain.style.left, 10) + PIN_MAIN_WIDTH / 2);

      if (!isDisabled) {
        var styleAfterEl = window.getComputedStyle(pinMain, 'after');
        var positionAfter = parseInt(styleAfterEl.top, 10) + parseInt(styleAfterEl.height, 10);

        y = Math.round(parseInt(pinMain.style.top, 10) + positionAfter);
        return x + ', ' + y;
      }

      y = Math.round(parseInt(pinMain.style.top, 10) + PIN_MAIN_HEIGHT / 2);
      return x + ', ' + y;
    },

    togglePage: function () {
      var sliceMethod = Array.prototype.slice;

      var formInteractiveElements = []
        .concat(sliceMethod.call(mapFilters.querySelectorAll('fieldset, select')))
        .concat(sliceMethod.call(adForm.querySelectorAll('fieldset')));

      var methodName = isDisabled ? 'add' : 'remove';
      map.classList[methodName]('map--faded');
      adForm.classList[methodName]('ad-form--disabled');
      setDisabled(formInteractiveElements);

      pins.forEach(function (pin) {
        pin.disabled = isDisabled;
      });
    }
  };

})();
