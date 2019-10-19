'use strict';

(function () {

  window.pin = {
    renderPin: function (ad, template) {
      try {
        var pin = template.cloneNode(true);
        var img = pin.querySelector('img');

        pin.style.left = ad.location.x - window.setting.getPinSizes()[0] / 2 + 'px';
        pin.style.top = ad.location.y - window.setting.getPinSizes()[1] + 'px';
        img.setAttribute('src', ad.author.avatar);
        img.setAttribute('alt', ad.offer.title);

        return pin;
      } catch (err) {
        return false;
      }
    }
  };

})();
