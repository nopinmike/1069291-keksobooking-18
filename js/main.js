'use strict';

var AD_COUNT = 8;
var AD_TITLES = [
  '1-к квартира, 41 м², 7/20 эт.',
  '2-к квартира, 44 м², 1/9 эт.',
  '1-к квартира, 33 м², 2/5 эт.',
  '1-к квартира, 38 м², 27/45 эт.',
  '1-к квартира, 39 м², 11/17 эт.',
  '1-к квартира, 22 м², 5/9 эт.',
  '2-к квартира, 45 м², 1/5 эт.',
  '3-к квартира, 80.7 м², 12/14 эт.'
];
var AD_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var AD_CHECKINS = ['12:00', '13:00', '14:00'];
var AD_CHECKOUTS = ['12:00', '13:00', '14:00'];
var AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var AD_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomMixingArray(arr) {
  var arrCopy = arr.concat();
  var j;
  var temp;

  for (var i = arrCopy.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arrCopy[j];
    arrCopy[j] = arrCopy[i];
    arrCopy[i] = temp;
  }

  return arrCopy;
}

function getRandomElementFromArray(arr) {
  return arr[getRandomInRange(0, arr.length - 1)];
}

function getRandomArrayFeatures(arr) {
  var arrCopy = randomMixingArray(arr);
  var length = getRandomInRange(1, arrCopy.length);

  return arrCopy.slice(0, length);
}

function getRandomArrayPhotos() {
  var adPhotosCopy = AD_PHOTOS.concat();
  var photos = [];
  var length = getRandomInRange(1, AD_PHOTOS.length);

  for (var i = 1; i <= length; i++) {
    var adPhotosCopyLength = adPhotosCopy.length;
    var randomPhotosIndex = getRandomInRange(0, adPhotosCopyLength - 1);
    var randomPhotos = adPhotosCopy[randomPhotosIndex];
    adPhotosCopy.splice(randomPhotosIndex, 1);
    photos.push(randomPhotos);
  }
  return photos;
}

function generateAds(map) {
  var ads = [];

  for (var i = 0; i < AD_COUNT; i++) {
    var locationX = getRandomInRange(0 + PIN_WIDTH / 2, map.offsetWidth - PIN_WIDTH / 2);
    var locationY = getRandomInRange(130 + PIN_HEIGHT, 630);
    var ad = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },

      'offer': {
        'title': AD_TITLES[i],
        'address': locationX + ', ' + locationY,
        'price': getRandomInRange(1000, 2000),
        'type': getRandomElementFromArray(AD_TYPES),
        'rooms': getRandomInRange(1, 4),
        'guests': getRandomInRange(1, 4),
        'checkin': getRandomElementFromArray(AD_CHECKINS),
        'checkout': getRandomElementFromArray(AD_CHECKOUTS),
        'features': getRandomArrayFeatures(AD_FEATURES),
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

function renderPin(ad, template) {
  var pin = template.cloneNode(true);
  var img = pin.querySelector('img');

  pin.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
  pin.style.top = ad.location.y - PIN_HEIGHT + 'px';
  img.setAttribute('src', ad.author.avatar);
  img.setAttribute('alt', ad.offer.title);

  return pin;
}

function setDisabled(collection) {
  collection.forEach(function (el) {
    el.disabled = true;
  });
}

function setDisabledForCollections() {
  for (var i = 0; i < arguments.length; i++) {
    setDisabled(arguments[i]);
  }
}

function disabledPage(map, adForm) {
  var mapFilters = document.querySelector('.map__filters');
  var mapFiltersFieldsets = mapFilters.querySelectorAll('fieldset');
  var mapFiltersSelects = mapFilters.querySelectorAll('select');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  map.classList.add('map--faded');

  setDisabledForCollections(adFormFieldsets, mapFiltersSelects, mapFiltersFieldsets);
}

function init() {
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var mapPins = map.querySelector('.map__pins');
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();
  var ads = generateAds(map);

  for (var i = 0; i < ads.length; i++) {
    var pin = renderPin(ads[i], templatePin, fragment);
    fragment.appendChild(pin);
  }

  mapPins.appendChild(fragment);

  disabledPage(map, adForm);
}

init();
