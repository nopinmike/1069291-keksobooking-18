'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 65;

  var defaultCoordinates;
  var defaultPinMainPosition;

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
  var ads = [];

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

    getAds: function () {
      return ads;
    },

    setAds: function (value) {
      ads = value;
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

    removeCardOnMap: function () {
      var card = map.querySelector('.map__card');
      if (card) {
        card.remove();
      }
    },

    setDefaultCoordinates: function (value) {
      var leftPositionPinMain = pinMain.offsetLeft;
      var topPositionPinMain = pinMain.offsetTop;
      defaultCoordinates = value;
      defaultPinMainPosition = [leftPositionPinMain, topPositionPinMain];
    },

    resetPinMain: function () {
      if (defaultCoordinates) {
        var address = adForm.querySelector('#address');
        address.value = defaultCoordinates;
        pinMain.style.left = defaultPinMainPosition[0] + 'px';
        pinMain.style.top = defaultPinMainPosition[1] + 'px';
      }
    },

    removePinsOnMap: function () {
      pins.forEach(function (pin) {
        pin.remove();
      });
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
    },

    resetPage: function () {
      var fields = adForm.querySelectorAll('input, textarea');
      var selects = adForm.querySelectorAll('select');
      fields.forEach(function (field) {
        if (field.name === 'description') {
          field.value = '';
        }
        switch (field.type) {
          case 'text':
            if (field.hasAttribute('readonly')) {
              break;
            }
            field.value = '';
            break;
          case 'number':
            field.placeholder = '1000';
            field.value = '';
            break;
          case 'checkbox':
            field.checked = false;
            break;
          case 'file':
            field.value = '';
            break;
        }
      });
      selects.forEach(function (select) {
        switch (select.name) {
          case 'type':
            select.value = 'flat';
            break;
          case 'timein':
            select.value = '12:00';
            break;
          case 'timeout':
            select.value = '12:00';
            break;
          case 'rooms':
            select.value = '1';
            break;
          case 'capacity':
            select.value = '3';
            break;
        }
      });

      this.removeCardOnMap();
      this.resetPinMain();
      this.setStatusPage(true);
      this.removePinsOnMap();
    }
  };

})();
