'use strict';

(function () {
  var PinSize = {
    PIN_WIDTH: 50,
    PIN_HEIGHT: 70,
    PIN_MAIN_WIDTH: 65,
    PIN_MAIN_HEIGHT: 65
  };

  var KeyCode = {
    KEYCODE_ESC: 27,
    KEYCODE_ENTER: 13
  };

  var defaultPinMain = {
    defaultCoordinates: null,
    defaultPinMainPosition: null
  };

  var heightRestrictions = {
    top: 130,
    bottom: 630
  };

  // var adForm = document.querySelector('.ad-form');
  // var map = document.querySelector('.map');
  // var mapFilters = map.querySelector('.map__filters-container');

  var pins = [];
  var ads = [];

  window.setting = {
    getKeyCode: function (key) {
      return KeyCode[key];
    },

    getPinSize: function (key) {
      return PinSize[key];
    },

    setPinSize: function (key, value) {
      PinSize[key] = value;
    },

    setPins: function (value) {
      pins = value;
    },

    getPins: function () {
      return pins;
    },

    getAds: function () {
      return ads;
    },

    setAds: function (value) {
      ads = value;
    },

    getHeightRestrictions: function () {
      return heightRestrictions;
    },

    setDefaultPinMain: function (coordinates, position) {
      defaultPinMain.defaultCoordinates = coordinates;
      defaultPinMain.defaultPinMainPosition = position;
    },

    getDefaultPinMain: function () {
      return defaultPinMain;
    }
  };

})();
