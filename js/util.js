'use strict';

(function () {

  window.util = {
    getRandomInRange: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomMixingArray: function (arr) {
      var randomIndex;
      var randomEl;

      for (var i = arr.length - 1; i > 0; i--) {
        randomIndex = Math.floor(Math.random() * (i + 1));
        randomEl = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = randomEl;
      }

      return arr;
    },

    getRandomElementFromArray: function (arr) {
      return arr[this.getRandomInRange(0, arr.length - 1)];
    }
  };

})();
