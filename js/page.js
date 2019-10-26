'use strict';

(function () {

  var statusPage = false;

  var selectNameToValue = {
    type: 'flat',
    timein: '12:00',
    timeout: '12:00',
    rooms: '1',
    capacity: '3'
  };

  function resetPinMain(adForm) {
    var pinMain = document.querySelector('.map__pin--main');
    var defaultPinMain = window.setting.getDefaultPinMain();
    if (defaultPinMain.defaultCoordinates) {
      var address = adForm.querySelector('#address');
      address.value = defaultPinMain.defaultCoordinates;
      pinMain.style.left = defaultPinMain.defaultPinMainPosition[0] + 'px';
      pinMain.style.top = defaultPinMain.defaultPinMainPosition[1] + 'px';
    }
  }

  function resetPage(pins, adForm, map) {
    var fields = adForm.querySelectorAll('input, textarea');
    var selects = adForm.querySelectorAll('select');
    var filterMethod = [].filter;
    var findMethod = [].find;

    filterMethod.call(fields, function (field) {
      return field.type === 'text' || field.type === 'number' || field.type === 'file';
    }).forEach(function (field) {
      field.value = '';
    });

    filterMethod.call(fields, function (field) {
      return field.type === 'checkbox';
    }).forEach(function (field) {
      field.checked = false;
    });

    findMethod.call(fields, function (field) {
      return field.type === 'number';
    }).placeholder = '1000';

    selects.forEach(function (select) {
      select.value = selectNameToValue[select.name];
    });

    window.page.removeCardOnMap(map);
    window.page.removePinsOnMap(pins);
    resetPinMain(adForm);
  }

  window.page = {
    removePinsOnMap: function (pins) {
      pins.forEach(function (pin) {
        pin.remove();
      });
    },

    removeCardOnMap: function (map) {
      var card = map.querySelector('.map__card');
      if (card) {
        card.remove();
      }
    },

    getCurrentCoordinates: function (pinMain) {
      var x;
      var y;

      x = Math.round(parseInt(pinMain.style.left, 10) + window.setting.getPinSize('PIN_MAIN_WIDTH') / 2);

      if (statusPage) {
        var styleAfterEl = window.getComputedStyle(pinMain, 'after');
        var positionAfter = parseInt(styleAfterEl.top, 10) + parseInt(styleAfterEl.height, 10);

        y = Math.round(parseInt(pinMain.style.top, 10) + positionAfter);
        return x + ', ' + y;
      }

      y = Math.round(parseInt(pinMain.style.top, 10) + window.setting.getPinSize('PIN_MAIN_HEIGHT') / 2);
      return x + ', ' + y;
    },

    setStatusPage: function (status) {
      var map = document.querySelector('.map');
      var mapFilters = map.querySelector('.map__filters-container');
      var adForm = document.querySelector('.ad-form');
      var sliceMethod = Array.prototype.slice;
      var pins = window.setting.getPins();
      var formInteractiveElements = []
        .concat(sliceMethod.call(mapFilters.querySelectorAll('fieldset, select')))
        .concat(sliceMethod.call(adForm.querySelectorAll('fieldset')));

      statusPage = status;

      var methodName = statusPage ? 'remove' : 'add';

      map.classList[methodName]('map--faded');
      adForm.classList[methodName]('ad-form--disabled');

      formInteractiveElements.forEach(function (el) {
        el.disabled = !statusPage;
      });

      if (statusPage === false) {
        resetPage(pins, adForm, map);
      } else {
        pins.forEach(function (pin) {
          pin.disabled = false;
        });
      }
    },

    getStatusPage: function () {
      return statusPage;
    }
  };

})();
