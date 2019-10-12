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

  window.card = {
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

      title.textContent = ad.offer.title;
      address.textContent = ad.offer.address;
      price.textContent = ad.offer.price + '₽/ночь';
      type.textContent = translations[ad.offer.type];
      capacityCard.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
      time.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
      description.textContent = ad.offer.description;
      avatar.setAttribute('src', ad.author.avatar);

      setFeaturesForCard(ad.offer.features, features);
      setPhotosForCard(ad.offer.photos, photos);

      return card;
    }
  };

})();
