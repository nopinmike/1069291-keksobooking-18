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
var PIN_MAIN_WIDTH = 65;
var PIN_MAIN_HEIGHT = 65;
var WIDTH_PHOTO_IN_POPUP = 45;
var HEIGHT_PHOTO_IN_POPUP = 40;

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

function generateAds(mapWidth) {
  var ads = [];

  for (var i = 0; i < AD_COUNT; i++) {
    var locationX = getRandomInRange(0 + PIN_WIDTH / 2, mapWidth - PIN_WIDTH / 2);
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

function renderingPinsOnMap(ads, mapPins) {
  var fragmentForPins = document.createDocumentFragment();
  var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');

  for (var i = 0; i < ads.length; i++) {
    var pin = renderPin(ads[i], templatePin);
    fragmentForPins.appendChild(pin);
  }

  mapPins.appendChild(fragmentForPins);
}

function setFeaturesForPopup(featureList, featuresNode) {
  featuresNode.textContent = '';

  for (var i = 0; i < featureList.length; i++) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + featureList[i]);
    featuresNode.appendChild(feature);
  }
}

function setPhotosForPopup(photosList, photosNode) {
  photosNode.textContent = '';

  for (var i = 0; i < photosList.length; i++) {
    var photo = document.createElement('img');
    photo.classList.add('popup__photo');
    photo.setAttribute('width', WIDTH_PHOTO_IN_POPUP);
    photo.setAttribute('height', HEIGHT_PHOTO_IN_POPUP);
    photo.setAttribute('src', photosList[i]);
    photo.setAttribute('alt', 'Фотография жилья');
    photosNode.appendChild(photo);
  }
}

function renderCard(ad, template) {
  var card = template.cloneNode(true);
  var title = card.querySelector('.popup__title');
  var address = card.querySelector('.popup__text--address');
  var price = card.querySelector('.popup__text--price');
  var type = card.querySelector('.popup__type');
  var capacity = card.querySelector('.popup__text--capacity');
  var time = card.querySelector('.popup__text--time');
  var features = card.querySelector('.popup__features');
  var description = card.querySelector('.popup__description');
  var photos = card.querySelector('.popup__photos');
  var avatar = card.querySelector('.popup__avatar');
  var translations = {flat: 'Квартира', bungalo: 'Бунгало', house: 'Дом', palace: 'Дворец'};

  title.textContent = ad.offer.title;
  address.textContent = ad.offer.address;
  price.textContent = ad.offer.price + '₽/ночь';
  type.textContent = translations[ad.offer.type];
  capacity.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  time.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  description.textContent = ad.offer.description;
  avatar.setAttribute('src', ad.author.avatar);

  setFeaturesForPopup(ad.offer.features, features);
  setPhotosForPopup(ad.offer.photos, photos);

  return card;
}

function renderingCardOnMap(ad, mapFilters, map) {
  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  var card = renderCard(ad, templateCard);
  map.insertBefore(card, mapFilters);
}

function setDisabled(collection, isDisabled) {
  collection.forEach(function (el) {
    el.disabled = isDisabled;
  });
}

function setDisabledForCollections() {
  var isDisabled = arguments[arguments.length - 1];
  for (var i = 0; i < arguments.length - 1; i++) {
    setDisabled(arguments[i], isDisabled);
  }
}

function disabledPage(map, mapFilters, adForm, isDisabled) {
  var mapFiltersFieldsets = mapFilters.querySelectorAll('fieldset');
  var mapFiltersSelects = mapFilters.querySelectorAll('select');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  if (isDisabled) {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    setDisabledForCollections(adFormFieldsets, mapFiltersSelects, mapFiltersFieldsets, isDisabled);
    return;
  }

  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  setDisabledForCollections(adFormFieldsets, mapFiltersSelects, mapFiltersFieldsets, isDisabled);
}

function getCurrentCoordinates(pinMain, isDisabled) {
  var x;
  var y;

  x = Math.round(parseInt(pinMain.style.left, 10) + PIN_MAIN_WIDTH / 2);

  if (!isDisabled) {
    var styleAfterEl = window.getComputedStyle(pinMain, 'after');
    var positionAfter = parseInt(styleAfterEl.top, 10) + parseInt(styleAfterEl.height, 10);

    y = Math.round(parseInt(pinMain.style.top, 10) + positionAfter);
    return x + ', ' + y;
  }

  y = Math.round(parseInt(pinMain.style.top, 10) + PIN_MAIN_HEIGHT / 2);
  return x + ', ' + y;
}

function changeAddress(adForm, pinMain, isDisabled) {
  var addressInput = adForm.querySelector('#address');
  var addressValue = getCurrentCoordinates(pinMain, isDisabled);
  addressInput.readOnly = true;
  addressInput.value = addressValue;
}

function checkCapacity(capacity, rooms) {
  var maxGuests = 0;

  switch (rooms.value) {
    case '1':
      maxGuests = 1;
      break;
    case '2':
      maxGuests = 2;
      break;
    case '3':
      maxGuests = 3;
      break;
    case '100':
      maxGuests = 0;
      break;
  }

  if (capacity.value > maxGuests) {
    capacity.setCustomValidity('Такое количество гостей не подходит');
    return;
  }

  capacity.setCustomValidity('');
}

function init() {
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var pinMain = mapPins.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var capacity = adForm.querySelector('#capacity');
  var rooms = adForm.querySelector('#room_number');
  var mapFilters = map.querySelector('.map__filters-container');
  var mapWidth = map.offsetWidth;
  var ads = generateAds(mapWidth);

  changeAddress(adForm, pinMain, true);

  renderingPinsOnMap(ads, mapPins);
  renderingCardOnMap(ads[0], mapFilters, map);

  disabledPage(map, mapFilters, adForm, true);

  pinMain.addEventListener('mousedown', function () {
    disabledPage(map, mapFilters, adForm, false);
    changeAddress(adForm, pinMain, false);
  });

  pinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 13) {
      disabledPage(map, mapFilters, adForm, false);
      changeAddress(adForm, pinMain, false);
    }
  });

  checkCapacity(capacity, rooms);

  capacity.addEventListener('change', function () {
    checkCapacity(capacity, rooms);
  });

  rooms.addEventListener('change', function () {
    checkCapacity(capacity, rooms);
  });
}

init();
