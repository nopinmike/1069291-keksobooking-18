'use strict';

(function () {

  window.pin = {
    renderPin: function (ad, template) {
      var pin = template.cloneNode(true);
      var img = pin.querySelector('img');

      pin.style.left = ad.location.x - window.setData.PIN_WIDTH / 2 + 'px';
      pin.style.top = ad.location.y - window.setData.PIN_HEIGHT + 'px';
      img.setAttribute('src', ad.author.avatar);
      img.setAttribute('alt', ad.offer.title);

      return pin;
    }
  };

})();
