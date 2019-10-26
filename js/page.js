'use strict';

(function () {

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
    var selectFilters = map.querySelectorAll('.map__filter');
    var featuresFilters = map.querySelectorAll('input[name="features"]');
    var fields = adForm.querySelectorAll('input, textarea');
    var selects = adForm.querySelectorAll('select');
    var filterMethod = [].filter;
    var findMethod = [].find;

    selectFilters.forEach(function (filter) {
      filter.value = 'any';
    });

    featuresFilters.forEach(function (filter) {
      filter.checked = false;
    });

    window.filter.resetFilters();

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

    window.card.removeCardOnMap();
    window.page.removePinsOnMap(pins);
    resetPinMain(adForm);
  }

  window.page = {
    removePinsOnMap: function (pins) {
      pins.forEach(function (pin) {
        pin.remove();
      });
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

      window.setting.setStatusPage(status);

      var methodName = status ? 'remove' : 'add';

      map.classList[methodName]('map--faded');
      adForm.classList[methodName]('ad-form--disabled');

      formInteractiveElements.forEach(function (el) {
        el.disabled = !status;
      });

      if (status === false) {
        resetPage(pins, adForm, map);
      } else {
        pins.forEach(function (pin) {
          pin.disabled = false;
        });
      }
    }
  };

})();
