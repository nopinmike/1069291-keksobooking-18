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

  function checkCapacity() {
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

  function onCheckTitle() {
    var length = titleInForm.value.length;
    var minLength = 30;
    var maxLength = 100;

    if (length >= minLength && length <= maxLength) {
      titleInForm.setCustomValidity('');
      return;
    } else {
      titleInForm.setCustomValidity('Некорректная длина ввода');
    }
  }

  function onCheckPrice() {
    var value = priceInForm.value;
    var maxValue = 1000000;
    var minValue = 1000;
    var typeValue = typeInForm.value;
    var textValue = 'квартиры';

    switch (typeValue) {
      case 'bungalo':
        minValue = 0;
        textValue = 'бунгало';
        break;
      case 'flat':
        minValue = 1000;
        textValue = 'квартиры';
        break;
      case 'house':
        minValue = 5000;
        textValue = 'дома';
        break;
      case 'palace':
        minValue = 10000;
        textValue = 'дворца';
        break;
    }

    priceInForm.placeholder = minValue;

    if (value > maxValue) {
      priceInForm.setCustomValidity('Слишком большая цена');
      return;
    }

    if (value < minValue) {
      priceInForm.setCustomValidity('Слишком низкая цена для ' + textValue);
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

  window.form = {
    changeAddress: function () {
      var addressInput = adForm.querySelector('#address');
      var addressValue = window.setData.getCurrentCoordinates();
      addressInput.readOnly = true;
      addressInput.value = addressValue;
    }
  };

})();
