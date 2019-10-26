'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var capacity = adForm.querySelector('#capacity');
  var titleInForm = adForm.querySelector('#title');
  var priceInForm = adForm.querySelector('#price');
  var typeInForm = adForm.querySelector('#type');
  var timeInForm = adForm.querySelector('#timein');
  var timeOutInForm = adForm.querySelector('#timeout');
  var rooms = adForm.querySelector('#room_number');
  var mainBlock = document.querySelector('main');
  var pinMain = document.querySelector('.map__pin--main');

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

  function onCheckTitle() {
    var length = titleInForm.value.length;
    var minLength = 30;
    var maxLength = 100;

    if (length >= minLength && length <= maxLength) {
      titleInForm.setCustomValidity('');
      return;
    }
    titleInForm.setCustomValidity('Некорректная длина ввода');
  }

  function onCheckPrice() {
    var typeValue = typeInForm.value;
    var maxPrice = 1000000;
    var minPrice = typeValueHousingToMinPrice[typeValue];
    var currentPrice = priceInForm.value;
    var text = typeValueHousingToText[typeValue];

    priceInForm.placeholder = minPrice;

    if (!currentPrice) {
      priceInForm.setCustomValidity('Необходимо установить цену');
      return;
    }

    if (currentPrice > maxPrice) {
      priceInForm.setCustomValidity('Слишком большая цена');
      return;
    }

    if (currentPrice < minPrice) {
      priceInForm.setCustomValidity('Слишком низкая цена для ' + text);
      return;
    }

    priceInForm.setCustomValidity('');
  }

  function onCheckTime(evt) {
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

  function onClickSuccessMessage() {
    var successBlock = mainBlock.querySelector('.success');
    if (successBlock) {
      successBlock.remove();
    }
    document.removeEventListener('click', onClickSuccessMessage);
  }

  function onEscSuccessMessage(evt) {
    if (evt.keyCode === window.setting.getKeyCode('KEYCODE_ESC')) {
      var successBlock = mainBlock.querySelector('.success');
      if (successBlock) {
        successBlock.remove();
      }
      document.removeEventListener('keydown', onEscSuccessMessage);
    }
  }

  function showSuccessMessage() {
    var templateSuccess = document.querySelector('#success').content.querySelector('.success');
    var successBlock = templateSuccess.cloneNode(true);
    mainBlock.appendChild(successBlock);
    document.addEventListener('click', onClickSuccessMessage);
    document.addEventListener('keydown', onEscSuccessMessage);
  }

  function showErrorMessage(message) {
    var templateError = document.querySelector('#error').content.querySelector('.error');
    var errorBlock = templateError.cloneNode(true);
    var blockTextError = errorBlock.querySelector('.error__message');
    var buttonError = errorBlock.querySelector('.error__button');

    function onReload(evt) {
      evt.preventDefault();
      window.backend.save(window.config.getConfig().saveUrl, new FormData(adForm), onSuccess, onError);
      buttonError.removeEventListener('click', onReload);
      errorBlock.remove();
    }

    blockTextError.textContent = message;
    mainBlock.appendChild(errorBlock);

    buttonError.addEventListener('click', onReload);
  }

  function onSuccess() {
    window.page.setStatusPage(false);
    showSuccessMessage();
  }

  function onError(message) {
    showErrorMessage(message);
  }

  capacity.addEventListener('change', function () {
    checkCapacity();
  });

  rooms.addEventListener('change', function () {
    checkCapacity();
  });

  titleInForm.required = true;
  titleInForm.addEventListener('change', onCheckTitle);

  priceInForm.required = true;
  priceInForm.addEventListener('change', onCheckPrice);
  typeInForm.addEventListener('change', onCheckPrice);

  timeInForm.addEventListener('change', onCheckTime);
  timeOutInForm.addEventListener('change', onCheckTime);

  checkCapacity();
  onCheckPrice();

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(window.config.getConfig().saveUrl, new FormData(adForm), onSuccess, onError);
  });

  adForm.addEventListener('reset', function (evt) {
    evt.preventDefault();
    window.page.setStatusPage(false);
  });

  window.form = {
    changeAddress: function () {
      var addressInput = adForm.querySelector('#address');
      var addressValue = window.setting.getCurrentCoordinates(pinMain);
      addressInput.readOnly = true;
      addressInput.value = addressValue;
    }
  };

})();
