'use strict';

(function () {

  var KEYCODE_ENTER = 13;
  var KEYCODE_ESC = 27;

  var map = document.querySelector('.map');
  var mapForPins = map.querySelector('.map__pins');
  var pinMain = document.querySelector('.map__pin--main');
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
    if (!window.setting.getStatusPage()) {
      renderCardOnMap(ad, mapFilters, map);
      var popupClose = map.querySelector('.map__card .popup__close');
      popupClose.addEventListener('click', onPinClose);
      document.addEventListener('keydown', onPinEsc);
    }
  }

  function renderPinsOnMap(ads) {
    var fragmentForPins = document.createDocumentFragment();
    var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
    var pins = [];
    ads.forEach(function (ad) {
      var pin = window.pin.renderPin(ad, templatePin);
      if (!pin) {
        return;
      }
      pin.disabled = true;
      pin.addEventListener('click', function () {
        onPinClick(ad);
      });
      pin.addEventListener('keydown', function (evt) {
        if (evt.keyCode === KEYCODE_ENTER) {
          onPinClick(ad, pin);
        }
      });
      pins.push(pin);
      fragmentForPins.appendChild(pin);
    });
    window.setting.setPins(pins);
    mapForPins.appendChild(fragmentForPins);
  }

  function setPinMainCoordinates(shift) {
    var x = shift.x;
    var y = shift.y;

    var statusPage = window.setting.getStatusPage();
    var pinMainWidth = pinMain.offsetWidth;
    var heightAfterEl = parseInt(window.getComputedStyle(pinMain, 'after').height, 10);
    var pinMainHeight = (statusPage) ? pinMain.offsetHeight : pinMain.offsetHeight + heightAfterEl;

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
    var blockTextError = templateError.querySelector('.error__message');
    var buttonError = templateError.querySelector('.error__button');

    function onReload(evt) {
      evt.preventDefault();
      window.fetch.load('https://js.dump.academy/keksobooking/data', onSuccess, onError);
      buttonError.removeEventListener('click', onReload);
      templateError.remove();
    }

    blockTextError.textContent = message;
    mainBlock.appendChild(templateError);

    buttonError.addEventListener('click', onReload);
  }

  function onError(message) {
    showErrorMessage(message);
  }

  function onSuccess(data) {
    renderPinsOnMap(data);

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
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      window.setting.setStatusPage(false);

      window.form.changeAddress();
    });

    pinMain.addEventListener('keydown', function (evt) {
      if (evt.keyCode === KEYCODE_ENTER) {
        window.setting.setStatusPage(false);
        window.form.changeAddress();
      }
    });
  }

  window.setting.setStatusPage(true);
  window.fetch.load('https://js.dump.academy/keksobooking/dataa', onSuccess, onError);
  window.form.changeAddress();

})();
