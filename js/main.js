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
var AD_PRICES = [1400, 1100, 1200, 1700, 1600, 1250, 1150, 1770];
var AD_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var AD_ROOMS = [1, 2, 1, 1, 1, 1, 2, 3];
var AD_GUESTS = [2, 2, 1, 3, 1, 2, 2, 4];
var AD_CHECKINS = ['12:00', '13:00', '14:00'];
var AD_CHECKOUTS = ['12:00', '13:00', '14:00'];
var AD_DESCRIPTIONS = ['Описание 1', 'Описание 2', 'Описание 3', 'Описание 4', 'Описание 5', 'Описание 6'];
var AD_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var AD_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var ads = [];
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomMixingArray(arr) {
  var j;
  var temp;

  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }

  return arr;
}

function getRandomArrayFeatures() {
  randomMixingArray(AD_FEATURES);
  var length = getRandomInRange(1, AD_FEATURES.length);

  return AD_FEATURES.slice(0, length);
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

function generateAds() {

  for (var i = 0; i < AD_COUNT; i++) {
    var locationX = getRandomInRange(0, map.offsetWidth);
    var locationY = getRandomInRange(130, 630);
    var ad = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },

      'offer': {
        'title': AD_TITLES[i],
        'address': locationX + ', ' + locationY,
        'price': AD_PRICES[i],
        'type': AD_TYPES[getRandomInRange(0, AD_TYPES.length - 1)],
        'rooms': AD_ROOMS[i],
        'guests': AD_GUESTS[i],
        'checkin': AD_CHECKINS[getRandomInRange(0, AD_CHECKINS.length - 1)],
        'checkout': AD_CHECKOUTS[getRandomInRange(0, AD_CHECKOUTS.length - 1)],
        'features': getRandomArrayFeatures(),
        'description': AD_DESCRIPTIONS[i],
        'photos': getRandomArrayPhotos()
      },

      'location': {
        'x': locationX,
        'y': locationY
      }
    };
    ads.push(ad);
  }
}

function renderPin(ad) {
  var pin = templatePin.cloneNode(true);
  var img = pin.querySelector('img');
  pin.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
  pin.style.top = ad.location.y - PIN_HEIGHT + 'px';
  img.setAttribute('src', ad.author.avatar);
  img.setAttribute('alt', ad.offer.title);
  fragment.appendChild(pin);
}

function init() {
  generateAds();
  for (var i = 0; i < ads.length; i++) {
    renderPin(ads[i]);
  }
  mapPins.appendChild(fragment);
  map.classList.remove('.map--faded');
}

init();
