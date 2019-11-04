'use strict';

(function () {
  var MIN_LENGTH = 30;
  var MAX_LENGTH = 100;
  var MAX_PRICE = 1000000;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var adForm = document.querySelector('.ad-form');
  var reset = adForm.querySelector('.ad-form__reset');
  var capacity = adForm.querySelector('#capacity');
  var titleInForm = adForm.querySelector('#title');
  var priceInForm = adForm.querySelector('#price');
  var typeInForm = adForm.querySelector('#type');
  var timeInForm = adForm.querySelector('#timein');
  var timeOutInForm = adForm.querySelector('#timeout');
  var rooms = adForm.querySelector('#room_number');
  var mainBlock = document.querySelector('main');
  var pinMain = document.querySelector('.map__pin--main');
  var templateSuccess = document.querySelector('#success').content.querySelector('.success');
  var templateError = document.querySelector('#error').content.querySelector('.error');
  var addressInput = adForm.querySelector('#address');
  var avatarBlock = adForm.querySelector('.ad-form-header__upload');
  var avatarField = avatarBlock.querySelector('.ad-form-header__input');
  var avatarPreview = avatarBlock.querySelector('.ad-form-header__preview img');
  var housingPhoto = adForm.querySelector('.ad-form__photo-container');
  var housingPhotoField = housingPhoto.querySelector('.ad-form__input');
  var housingPhotoPreview = housingPhoto.querySelector('.ad-form__photo');

  var housingPhotoWidth = housingPhotoPreview.offsetWidth;
  var housingPhotoHeight = housingPhotoPreview.offsetHeight;

  var roomsValueToMaxGuests = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var typeValueHousingToMinPrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var typeValueHousingToText = {
    'bungalo': 'бунгало',
    'flat': 'квартиры',
    'house': 'дома',
    'palace': 'дворца'
  };

  function checkCapacity() {
    var maxGuests = roomsValueToMaxGuests[rooms.value];
    var textValidity;
    var flag = maxGuests.find(function (el) {
      return el === capacity.value;
    });

    textValidity = (flag) ? '' : 'Такое количество гостей не подходит';
    capacity.setCustomValidity(textValidity);
  }

  function onTitleChange() {
    var length = titleInForm.value.length;

    if (length >= MIN_LENGTH && length <= MAX_LENGTH) {
      titleInForm.setCustomValidity('');
      return;
    }
    titleInForm.setCustomValidity('Некорректная длина ввода');
  }

  function onPriceChange() {
    checkPrice();
  }

  function onTypeChange() {
    checkPrice();
  }

  function checkPrice() {
    var typeValue = typeInForm.value;
    var minPrice = typeValueHousingToMinPrice[typeValue];
    var currentPrice = priceInForm.value;
    var text = typeValueHousingToText[typeValue];

    priceInForm.placeholder = minPrice;

    if (!currentPrice) {
      priceInForm.setCustomValidity('Необходимо установить цену');
      return;
    }

    if (currentPrice > MAX_PRICE) {
      priceInForm.setCustomValidity('Слишком большая цена');
      return;
    }

    if (currentPrice < minPrice) {
      priceInForm.setCustomValidity('Слишком низкая цена для ' + text);
      return;
    }

    priceInForm.setCustomValidity('');
  }

  function onTimeChange(evt) {
    var eventTimeId = evt.target.id;
    var newValue = evt.target.value;

    switch (eventTimeId) {
      case 'timein':
        timeOutInForm.value = newValue;
        break;
      case 'timeout':
        timeInForm. value = newValue;
        break;
    }
  }

  function setFile(file, callback) {
    var fileName = file.name.toLowerCase();

    var check = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });

    if (check) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        callback(reader);
      });

      reader.readAsDataURL(file);
    }
  }

  function setAvatar(reader) {
    avatarPreview.src = reader.result;
  }

  function setPhoto(reader) {
    var oldPicture = housingPhotoPreview.querySelector('img');
    var image = document.createElement('img');

    if (oldPicture) {
      oldPicture.remove();
    }

    image.src = reader.result;
    image.width = housingPhotoWidth;
    image.height = housingPhotoHeight;
    housingPhotoPreview.append(image);
  }

  function onSuccessMessageClick() {
    var successBlock = mainBlock.querySelector('.success');
    if (successBlock) {
      successBlock.remove();
    }
    document.removeEventListener('click', onSuccessMessageClick);
    document.removeEventListener('keydown', onSuccessMessageKeydown);
  }

  function onSuccessMessageKeydown(evt) {
    var successBlock = mainBlock.querySelector('.success');
    if (evt.keyCode === window.setting.getKeyCode('KEYCODE_ESC')) {
      if (successBlock) {
        successBlock.remove();
      }
      document.removeEventListener('click', onSuccessMessageClick);
      document.removeEventListener('keydown', onSuccessMessageKeydown);
    }
  }

  function showSuccessMessage() {
    var newSuccessBlock = templateSuccess.cloneNode(true);
    mainBlock.appendChild(newSuccessBlock);
    document.addEventListener('click', onSuccessMessageClick);
    document.addEventListener('keydown', onSuccessMessageKeydown);
  }

  function showErrorMessage(message) {
    var errorBlock = templateError.cloneNode(true);
    var blockTextError = errorBlock.querySelector('.error__message');
    var buttonError = errorBlock.querySelector('.error__button');

    function onButtonErrorClick(evt) {
      evt.preventDefault();
      window.serverAccess('POST', window.setting.getDataUrl().saveUrl, withSuccess, withError, new FormData(adForm));
      buttonError.removeEventListener('click', onButtonErrorClick);
      errorBlock.remove();
    }

    blockTextError.textContent = message;
    mainBlock.appendChild(errorBlock);

    buttonError.addEventListener('click', onButtonErrorClick);
  }

  function withSuccess() {
    window.page.setStatus(false);
    showSuccessMessage();
  }

  function withError(message) {
    showErrorMessage(message);
  }

  capacity.addEventListener('change', function () {
    checkCapacity();
  });

  rooms.addEventListener('change', function () {
    checkCapacity();
  });

  titleInForm.required = true;
  titleInForm.addEventListener('change', onTitleChange);

  priceInForm.required = true;
  priceInForm.addEventListener('change', onPriceChange);
  typeInForm.addEventListener('change', onTypeChange);

  timeInForm.addEventListener('change', onTimeChange);
  timeOutInForm.addEventListener('change', onTimeChange);

  avatarField.addEventListener('change', function (evt) {
    setFile(evt.target.files[0], setAvatar);
  });

  housingPhotoField.addEventListener('change', function (evt) {
    setFile(evt.target.files[0], setPhoto);
  });

  checkCapacity();
  checkPrice();

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.serverAccess('POST', window.setting.getDataUrl().saveUrl, withSuccess, withError, new FormData(adForm));
  });

  reset.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.page.setStatus(false);
  });

  window.changeAddress = function () {
    var addressValue = window.setting.getCurrentCoordinates(pinMain);
    addressInput.readOnly = true;
    addressInput.value = addressValue;
  };

})();
