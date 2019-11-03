'use strict';

var map = document.querySelector('.map');
var mapFilters = map.querySelector('.map__filters-container');
var filterFields = mapFilters.querySelectorAll('fieldset, select')
var adForm = document.querySelector('.ad-form');
var formFields = adForm.querySelectorAll('fieldset');
var pinMain = document.querySelector('.map__pin--main');
var filters = map.querySelector('.map__filters');

(function () {
  function resetPinMain() {
    var defaultPinMain = window.setting.getDefaultPinMain();
    if (defaultPinMain.defaultCoordinates) {
      var address = adForm.querySelector('#address');
      address.value = defaultPinMain.defaultCoordinates;
      pinMain.style.left = defaultPinMain.defaultPinMainPosition[0] + 'px';
      pinMain.style.top = defaultPinMain.defaultPinMainPosition[1] + 'px';
    }
  }

  function resetPage(pins) {
    adForm.reset();
    filters.reset();
    window.card.removeOnMap();
    window.page.removePinsOnMap(pins);
    window.filter.reset();
    resetPinMain(adForm);
  }

  window.page = {
    removePinsOnMap: function (pins) {
      pins.forEach(function (pin) {
        pin.remove();
      });
    },

    setStatus: function (status) {
      var sliceMethod = Array.prototype.slice;
      var pins = window.setting.getPins();
      var formInteractiveElements = []
        .concat(sliceMethod.call(filterFields))
        .concat(sliceMethod.call(formFields));

      window.setting.setStatusPage(status);

      var methodName = status ? 'remove' : 'add';

      map.classList[methodName]('map--faded');
      adForm.classList[methodName]('ad-form--disabled');

      formInteractiveElements.forEach(function (el) {
        el.disabled = !status;
      });

      if (status === false) {
        resetPage(pins);
      } else {
        pins.forEach(function (pin) {
          pin.disabled = false;
        });
      }
    }
  };

})();
