'use strict';

var ERROR_MESSAGE = 'Произошла ошибка соединения';
var TIMEOUT = 10000;
var SUCCESS_STATUS = 200;

(function () {
  window.serverAccess = function (type, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError(ERROR_MESSAGE);
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(type, url);

    if (data) {
      xhr.send(data);
      return;
    }

    xhr.send();
  };
})();
