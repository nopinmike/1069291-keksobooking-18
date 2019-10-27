'use strict';

(function () {

  var WIDTH_PHOTO_IN_POPUP = 45;
  var HEIGHT_PHOTO_IN_POPUP = 40;

  function setFeaturesForCard(featureList, featuresNode) {
    featuresNode.textContent = '';

    for (var i = 0; i < featureList.length; i++) {
      var feature = document.createElement('li');
      feature.classList.add('popup__feature');
      feature.classList.add('popup__feature--' + featureList[i]);
      featuresNode.appendChild(feature);
    }
  }

  function setPhotosForCard(photosList, photosNode) {
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

  function checkingData(el, data) {
    if (data && typeof data !== 'object') {
      return data;
    } else if (typeof data === 'object' && data.length) {
      return data;
    }
    el.remove();

    return data;
  }

  window.card = {
    removeCardOnMap: function () {
      var card = document.querySelector('.map__card');
      if (card) {
        card.remove();
      }
    },

    renderCard: function (ad, template) {
      var card = template.cloneNode(true);
      var title = card.querySelector('.popup__title');
      var address = card.querySelector('.popup__text--address');
      var price = card.querySelector('.popup__text--price');
      var type = card.querySelector('.popup__type');
      var capacityCard = card.querySelector('.popup__text--capacity');
      var time = card.querySelector('.popup__text--time');
      var features = card.querySelector('.popup__features');
      var description = card.querySelector('.popup__description');
      var photos = card.querySelector('.popup__photos');
      var avatar = card.querySelector('.popup__avatar');
      var translations = {flat: 'Квартира', bungalo: 'Бунгало', house: 'Дом', palace: 'Дворец'};

      title.textContent = checkingData(title, ad.offer.title);
      address.textContent = checkingData(address, ad.offer.address);
      price.textContent = checkingData(price, ad.offer.price) + '₽/ночь';
      type.textContent = translations[checkingData(type, ad.offer.type)];
      capacityCard.textContent = checkingData(capacityCard, ad.offer.rooms) + ' комнаты для ' + checkingData(capacityCard, ad.offer.guests) + ' гостей';
      time.textContent = 'Заезд после ' + checkingData(time, ad.offer.checkin) + ', выезд до ' + checkingData(time, ad.offer.checkout);
      description.textContent = checkingData(description, ad.offer.description);
      avatar.setAttribute('src', checkingData(avatar, ad.author.avatar));

      setFeaturesForCard(checkingData(features, ad.offer.features), features);
      setPhotosForCard(checkingData(photos, ad.offer.photos), photos);

      return card;
    }
  };

})();
