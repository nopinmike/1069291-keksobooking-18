'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var statusPage = false;

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

  var dataUrl = {
    loadUrl: 'https://js.dump.academy/keksobooking/data',
    saveUrl: 'https://js.dump.academy/keksobooking',
  };

  var lastTimeout;

  var pins = [];
  var ads = [];

  window.setting = {
    debounce: function (fun, interval) {
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      lastTimeout = setTimeout(fun, interval);
    },

    getDataUrl: function () {
      return dataUrl;
    },

    setStatusPage: function (value) {
      statusPage = value;
    },

    getStatusPage: function () {
      return statusPage;
    },

    getDebounceInterval: function () {
      return DEBOUNCE_INTERVAL;
    },

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
    },

    getCurrentCoordinates: function (pinMain) {
      var coordinates = {
        x: null,
        y: null
      };

      var coordinatePositionToSide = {
        x: 'PIN_MAIN_WIDTH',
        y: 'PIN_MAIN_HEIGHT'
      };

      var coordinatePositionToStylePosition = {
        x: 'left',
        y: 'top'
      };

      var numberSystem = 10;

      Object.keys(coordinates).forEach(function (el) {
        if (statusPage && el === 'y') {
          var styleAfterEl = window.getComputedStyle(pinMain, 'after');
          var positionAfter = parseInt(styleAfterEl.top, numberSystem) + parseInt(styleAfterEl.height, numberSystem);
          coordinates[el] = Math.round(parseInt(pinMain.style.top, numberSystem) + positionAfter);
          return;
        }
        coordinates[el] = Math.round(parseInt(pinMain.style[coordinatePositionToStylePosition[el]], numberSystem) + window.setting.getPinSize(coordinatePositionToSide[el]) / 2);
      });

      return coordinates.x + ', ' + coordinates.y;
    },
  };

})();
