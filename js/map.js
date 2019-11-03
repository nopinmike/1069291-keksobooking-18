'use strict';

(function () {
  var START_SYMBOL_FILTER_NAME = 8;

  var map = document.querySelector('.map');
  var mapForPins = map.querySelector('.map__pins');
  var pinMain = document.querySelector('.map__pin--main');
  var mapFilters = map.querySelector('.map__filters-container');
  var selectFilters = mapFilters.querySelectorAll('.map__filter');
  var featuresFilters = mapFilters.querySelectorAll('input[name="features"]');
  var mainBlock = document.querySelector('main');
  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var templateError = document.querySelector('#error').content.querySelector('.error');

  var serverData = {};

  function renderCardOnMap(ad, filtersForMap, mapBlock) {
    var card = window.card.getReady(ad, templateCard);
    mapBlock.insertBefore(card, filtersForMap);
  }

  function onPopupClick() {
    window.card.removeOnMap();
    document.removeEventListener('keydown', onPopupKeydown);
  }

  function onPopupKeydown(evt) {
    if (evt.keyCode === window.setting.getKeyCode('KEYCODE_ESC')) {
      window.card.removeOnMap();
      document.removeEventListener('keydown', onPopupKeydown);
    }
  }

  function onPinClick(ad) {
    window.card.removeOnMap();
    if (window.setting.getStatusPage()) {
      renderCardOnMap(ad, mapFilters, map);
      var popupClose = map.querySelector('.map__card .popup__close');
      popupClose.addEventListener('click', onPopupClick);
      document.addEventListener('keydown', onPopupKeydown);
    }
  }

  function withError(message) {
    showErrorMessage(message);
  }

  function withSuccess(data) {
    serverData = data;
    renderPinsOnMap();
  }

  function getAds() {
    if (!Object.keys(serverData).length) {
      window.serverAccess('GET', window.setting.getDataUrl().loadUrl, withSuccess, withError);
    } else {
      renderPinsOnMap();
    }
  }

  function renderPinsOnMap() {
    var currentPins = window.setting.getPins();
    var fragmentForPins = document.createDocumentFragment();
    var pins = [];
    var allowedAds = window.filter.countPins(serverData, pinMain);

    allowedAds.forEach(function (ad) {
      var pin = window.renderPin(ad, templatePin);
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

    if (top < window.setting.getHeightRestrictions().top - pinMainHeight) {
      top = window.setting.getHeightRestrictions().top - pinMainHeight;
    }

    if (top > window.setting.getHeightRestrictions().bottom - pinMainHeight) {
      top = window.setting.getHeightRestrictions().bottom - pinMainHeight;
    }

    pinMain.style.left = left + 'px';
    pinMain.style.top = top + 'px';
  }

  function showErrorMessage(message) {
    var blockError = templateError.cloneNode(true);
    var blockTextError = blockError.querySelector('.error__message');
    var buttonError = blockError.querySelector('.error__button');

    function onButtonErrorClick(evt) {
      evt.preventDefault();
      window.serverAccess('GET', window.setting.getDataUrl().loadUrl, withSuccess, withError);
      buttonError.removeEventListener('click', onButtonErrorClick);
      blockError.remove();
    }

    blockTextError.textContent = message;
    mainBlock.appendChild(blockError);

    buttonError.addEventListener('click', onButtonErrorClick);
  }

  function getFunctionRenderPins() {
    getAds();
  }

  function setDefaultCoordinates(value) {
    var leftPositionPinMain = pinMain.offsetLeft;
    var topPositionPinMain = pinMain.offsetTop;
    window.setting.setDefaultPinMain(value, [leftPositionPinMain, topPositionPinMain]);
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
      window.changeAddress();
    }

    function onMouseUp(upEvt) {

      function onPinMainClick(clickEvt) {
        clickEvt.preventDefault();
        pinMain.removeEventListener('click', onPinMainClick);
      }

      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        pinMain.addEventListener('click', onPinMainClick);
      }

      getAds();
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    window.page.setStatus(true);

    window.changeAddress();
  });

  pinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.setting.getKeyCode('KEYCODE_ENTER')) {
      getAds();
      window.page.setStatus(true);
      window.changeAddress();
    }
  });

  selectFilters.forEach(function (filter) {
    filter.addEventListener('change', function (evt) {
      var name = evt.target.name.slice(START_SYMBOL_FILTER_NAME, evt.target.name.length);
      var value = evt.target.value;
      window.filter.set(name, value);
      window.card.removeOnMap();
      window.setting.debounce(getFunctionRenderPins, window.setting.getDebounceInterval());
    });
  });

  featuresFilters.forEach(function (filter) {
    filter.addEventListener('change', function (evt) {
      var name = evt.target.value;
      var value = evt.target.checked;
      window.filter.setFeatures(name, value);
      window.card.removeOnMap();
      window.setting.debounce(getFunctionRenderPins, window.setting.getDebounceInterval());
    });
  });

  setDefaultCoordinates(window.setting.getCurrentCoordinates(pinMain));
  window.page.setStatus(false);
  window.changeAddress();

})();
