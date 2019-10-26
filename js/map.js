'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapForPins = map.querySelector('.map__pins');
  var pinMain = document.querySelector('.map__pin--main');
  var mapFilters = map.querySelector('.map__filters-container');

  function renderCardOnMap(ad, filtersForMap, mapBlock) {
    var templateCard = document.querySelector('#card').content.querySelector('.map__card');
    var card = window.card.renderCard(ad, templateCard);
    mapBlock.insertBefore(card, filtersForMap);
  }

  function onPinClose() {
    window.card.removeCardOnMap();
    document.removeEventListener('keydown', onPinEsc);
  }

  function onPinEsc(evt) {
    if (evt.keyCode === window.setting.getKeyCode('KEYCODE_ESC')) {
      window.card.removeCardOnMap();
      document.removeEventListener('keydown', onPinEsc);
    }
  }

  function onPinClick(ad) {
    window.card.removeCardOnMap();
    if (window.setting.getStatusPage()) {
      renderCardOnMap(ad, mapFilters, map);
      var popupClose = map.querySelector('.map__card .popup__close');
      popupClose.addEventListener('click', onPinClose);
      document.addEventListener('keydown', onPinEsc);
    }
  }

  function renderPinsOnMap(ads) {
    var currentPins = window.setting.getPins();
    var fragmentForPins = document.createDocumentFragment();
    var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
    var pins = [];
    var allowedAds = window.filter.countPins(ads, pinMain);

    allowedAds.forEach(function (ad) {
      var pin = window.pin.renderPin(ad, templatePin);
      if (!pin) {
        return;
      }
      pin.addEventListener('click', function () {
        onPinClick(ad);
      });
      pin.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.setting.getKeyCode('KEYCODE_ENTER')) {
          onPinClick(ad, pin);
        }
      });
      pins.push(pin);
      fragmentForPins.appendChild(pin);
    });

    window.setting.setAds(allowedAds);
    window.setting.setPins(pins);
    window.page.removePinsOnMap(currentPins);
    mapForPins.appendChild(fragmentForPins);
  }

  function setPinMainCoordinates(shift) {
    var x = shift.x;
    var y = shift.y;

    var statusPage = window.setting.getStatusPage();
    var pinMainWidth = pinMain.offsetWidth;
    var heightAfterEl = parseInt(window.getComputedStyle(pinMain, 'after').height, 10);
    var pinMainHeight = (statusPage) ? pinMain.offsetHeight + heightAfterEl : pinMain.offsetHeight;

    var left = pinMain.offsetLeft - x;
    var top = pinMain.offsetTop - y;

    if (left < (-pinMainWidth / 2)) {
      left = -pinMainWidth / 2;
    }

    if (left > map.offsetWidth - pinMainWidth / 2) {
      left = map.offsetWidth - pinMainWidth / 2;
    }

    if (top < 130 - pinMainHeight) {
      top = 130 - pinMainHeight;
    }

    if (top > 630 - pinMainHeight) {
      top = 630 - pinMainHeight;
    }

    pinMain.style.left = left + 'px';
    pinMain.style.top = top + 'px';
  }

  function showErrorMessage(message) {
    var mainBlock = document.querySelector('main');
    var templateError = document.querySelector('#error').content.querySelector('.error');
    var blockError = templateError.cloneNode(true);
    var blockTextError = blockError.querySelector('.error__message');
    var buttonError = blockError.querySelector('.error__button');

    function onReload(evt) {
      evt.preventDefault();
      window.backend.load(window.config.getConfig().loadUrl, onSuccess, onError);
      buttonError.removeEventListener('click', onReload);
      blockError.remove();
    }

    blockTextError.textContent = message;
    mainBlock.appendChild(blockError);

    buttonError.addEventListener('click', onReload);
  }

  function onError(message) {
    showErrorMessage(message);
  }

  function onSuccess(data) {

    function getFunctionRenderPins() {
      renderPinsOnMap(data);
    }

    pinMain.addEventListener('mousedown', function (evt) {
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var dragged = false;

      function onMouseMove(moveEvt) {
        moveEvt.preventDefault();
        dragged = true;

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        setPinMainCoordinates(shift);
      }

      function onMouseUp(upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (dragged) {
          var onClickPreventDefault = function (clickEvt) {
            clickEvt.preventDefault();
            pinMain.removeEventListener('click', onClickPreventDefault);
          };
          pinMain.addEventListener('click', onClickPreventDefault);
        }

        window.form.changeAddress();
        renderPinsOnMap(data);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      window.page.setStatusPage(true);

      window.form.changeAddress();
    });

    pinMain.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.setting.getKeyCode('KEYCODE_ENTER')) {
        renderPinsOnMap(data);
        window.page.setStatusPage(true);
        window.form.changeAddress();
      }
    });

    var selectFilters = mapFilters.querySelectorAll('.map__filter');
    selectFilters.forEach(function (filter) {
      filter.addEventListener('change', function (evt) {
        var name = evt.target.name.slice(8, evt.target.name.length);
        var value = evt.target.value;
        window.filter.setFilter(name, value);
        window.card.removeCardOnMap();
        window.util.debounce(getFunctionRenderPins, window.setting.getDebounceInterval());
      });
    });

    var featuresFilters = mapFilters.querySelectorAll('input[name="features"]');
    featuresFilters.forEach(function (filter) {
      filter.addEventListener('change', function (evt) {
        var name = evt.target.value;
        var value = evt.target.checked;
        window.filter.setFilterFeatures(name, value);
        window.card.removeCardOnMap();
        window.util.debounce(getFunctionRenderPins, window.setting.getDebounceInterval());
      });
    });

  }

  function setDefaultCoordinates(value) {
    var leftPositionPinMain = pinMain.offsetLeft;
    var topPositionPinMain = pinMain.offsetTop;
    window.setting.setDefaultPinMain(value, [leftPositionPinMain, topPositionPinMain]);
  }

  setDefaultCoordinates(window.setting.getCurrentCoordinates(pinMain));
  window.page.setStatusPage(false);
  window.form.changeAddress();
  window.backend.load(window.config.getConfig().loadUrl, onSuccess, onError);

})();
