'use strict';

(function () {
  var AD_COUNT = 8;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 65;

  var adTitles = [
    '1-к квартира, 41 м², 7/20 эт.',
    '2-к квартира, 44 м², 1/9 эт.',
    '1-к квартира, 33 м², 2/5 эт.',
    '1-к квартира, 38 м², 27/45 эт.',
    '1-к квартира, 39 м², 11/17 эт.',
    '1-к квартира, 22 м², 5/9 эт.',
    '2-к квартира, 45 м², 1/5 эт.',
    '3-к квартира, 80.7 м², 12/14 эт.'
  ];
  var adTypes = ['palace', 'flat', 'house', 'bungalo'];
  var adCheckins = ['12:00', '13:00', '14:00'];
  var adCheckouts = ['12:00', '13:00', '14:00'];
  var adFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var adPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var pinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters-container');

  var pins = [];

  function getRandomArrayFeatures(arr) {
    var arrCopy = window.util.randomMixingArray(arr.concat());
    var length = window.util.getRandomInRange(1, arrCopy.length);

    return arrCopy.slice(0, length);
  }

  function getRandomArrayPhotos() {
    var adPhotosCopy = adPhotos.concat();
    var photos = [];
    var length = window.util.getRandomInRange(1, adPhotos.length);

    for (var i = 1; i <= length; i++) {
      var adPhotosCopyLength = adPhotosCopy.length;
      var randomPhotosIndex = window.util.getRandomInRange(0, adPhotosCopyLength - 1);
      var randomPhotos = adPhotosCopy[randomPhotosIndex];
      adPhotosCopy.splice(randomPhotosIndex, 1);
      photos.push(randomPhotos);
    }
    return photos;
  }

  function generateAds(mapWidth) {
    var ads = [];

    for (var i = 0; i < AD_COUNT; i++) {
      var locationX = window.util.getRandomInRange(0 + PIN_WIDTH / 2, mapWidth - PIN_WIDTH / 2);
      var locationY = window.util.getRandomInRange(130 + PIN_HEIGHT, 630);
      var ad = {
        'author': {
          'avatar': 'img/avatars/user0' + (i + 1) + '.png'
        },

        'offer': {
          'title': adTitles[i],
          'address': locationX + ', ' + locationY,
          'price': window.util.getRandomInRange(1000, 2000),
          'type': window.util.getRandomElementFromArray(adTypes),
          'rooms': window.util.getRandomInRange(1, 4),
          'guests': window.util.getRandomInRange(1, 4),
          'checkin': window.util.getRandomElementFromArray(adCheckins),
          'checkout': window.util.getRandomElementFromArray(adCheckouts),
          'features': getRandomArrayFeatures(adFeatures),
          'description': 'Описание ' + i,
          'photos': getRandomArrayPhotos()
        },

        'location': {
          'x': locationX,
          'y': locationY
        }
      };

      ads.push(ad);
    }

    return ads;
  }

  function setDisabled(formInteractiveElements) {
    formInteractiveElements.forEach(function (el) {
      el.disabled = window.setData.isDisabled;
    });
  }

  window.setData = {
    ads: generateAds(map.offsetWidth),
    pins: pins,
    PIN_WIDTH: 50,
    PIN_HEIGHT: 70,
    isDisabled: false,
    getCurrentCoordinates: function () {
      var x;
      var y;

      x = Math.round(parseInt(pinMain.style.left, 10) + PIN_MAIN_WIDTH / 2);

      if (!window.setData.isDisabled) {
        var styleAfterEl = window.getComputedStyle(pinMain, 'after');
        var positionAfter = parseInt(styleAfterEl.top, 10) + parseInt(styleAfterEl.height, 10);

        y = Math.round(parseInt(pinMain.style.top, 10) + positionAfter);
        return x + ', ' + y;
      }

      y = Math.round(parseInt(pinMain.style.top, 10) + PIN_MAIN_HEIGHT / 2);
      return x + ', ' + y;
    },
    togglePage: function (form, isDisabledFlag) {
      window.setData.isDisabled = isDisabledFlag;
      var sliceMethod = Array.prototype.slice;

      var formInteractiveElements = []
        .concat(sliceMethod.call(mapFilters.querySelectorAll('fieldset, select')))
        .concat(sliceMethod.call(form.querySelectorAll('fieldset')));

      var methodName = window.setData.isDisabled ? 'add' : 'remove';
      map.classList[methodName]('map--faded');
      adForm.classList[methodName]('ad-form--disabled');
      setDisabled(formInteractiveElements);

      pins.forEach(function (pin) {
        pin.disabled = window.setData.isDisabled;
      });
    }
  };

})();
