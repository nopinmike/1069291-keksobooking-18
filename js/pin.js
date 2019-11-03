'use strict';

(function () {

  window.renderPin = function (ad, template) {
    try {
      var pin = template.cloneNode(true);
      var img = pin.querySelector('img');

      pin.style.left = ad.location.x - window.setting.getPinSize('PIN_WIDTH') / 2 + 'px';
      pin.style.top = ad.location.y - window.setting.getPinSize('PIN_HEIGHT') + 'px';
      img.setAttribute('src', ad.author.avatar);
      img.setAttribute('alt', ad.offer.title);

      return pin;
    } catch (err) {
      return false;
    }
  };

})();
