'use strict';

var data = {
  loadUrl: 'https://js.dump.academy/keksobooking/data',
  saveUrl: 'https://js.dump.academy/keksobooking',
};

(function () {

  window.config = {
    getConfig: function () {
      return data;
    }
  };

})();
