'use strict';

(function () {

  var KEYCODE_ENTER = 13;
  var KEYCODE_ESC = 27;

  var map = document.querySelector('.map');
  var mapForPins = map.querySelector('.map__pins');
  var pinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var mapFilters = map.querySelector('.map__filters-container');

  function renderCardOnMap(ad, filtersForMap, mapBlock) {
    var templateCard = document.querySelector('#card').content.querySelector('.map__card');
    var card = window.card.renderCard(ad, templateCard);
    mapBlock.insertBefore(card, filtersForMap);
  }

  function removeCardOnMap() {
    var card = map.querySelector('.map__card');
    if (card) {
      card.remove();
    }
  }

  function onPinClose() {
    removeCardOnMap();
    document.removeEventListener('keydown', onPinEsc);
  }

  function onPinEsc(evt) {
    if (evt.keyCode === KEYCODE_ESC) {
      removeCardOnMap();
      document.removeEventListener('keydown', onPinEsc);
    }
  }

  function onPinClick(ad) {
    removeCardOnMap();
    if (!window.setData.isDisabled) {
      renderCardOnMap(ad, mapFilters, map);
      var popupClose = map.querySelector('.map__card .popup__close');
      popupClose.addEventListener('click', onPinClose);
      document.addEventListener('keydown', onPinEsc);
    }
  }

  function renderPinsOnMap(ads, mapForAllPins) {
    var fragmentForPins = document.createDocumentFragment();
    var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');

    ads.forEach(function (ad) {
      var pin = window.pin.renderPin(ad, templatePin);
      pin.disabled = true;
      pin.addEventListener('click', function () {
        onPinClick(ad);
      });
      pin.addEventListener('keydown', function (evt) {
        if (evt.keyCode === KEYCODE_ENTER) {
          onPinClick(ad, pin);
        }
      });
      window.setData.pins.push(pin);
      fragmentForPins.appendChild(pin);
    });

    mapForAllPins.appendChild(fragmentForPins);
  }

  renderPinsOnMap(window.setData.ads, mapForPins);

  pinMain.addEventListener('mousedown', function () {
    window.setData.togglePage(adForm, false);
    window.form.changeAddress();
  });

  pinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEYCODE_ENTER) {
      window.setData.togglePage(adForm, false);
      window.form.changeAddress();
    }
  });

  window.setData.togglePage(adForm, true);
  window.form.changeAddress();

})();
