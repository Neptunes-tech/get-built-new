"use strict";

/* global Cookies */
jQuery(document).ready(function ($) {
  'use strict';

  $('.js-grouped-toggles').each(function () {
    var self = {
      componentEl: $(this),
      "class": 'js-grouped-toggles',
      currentIndex: 0,
      targets: [],
      ids: [],
      cookies: []
    };
    self.options = {
      itemActiveClass: '',
      visibilityClass: 'hidden',
      saveChoiceInCookies: '',
      activeItemIndex: null
    };
    $.extend(self.options, self.componentEl.data('groupedToggles'));
    self.itemEls = self.componentEl.find(".".concat(self["class"], "__item"));

    self.getCurrentIndex = function () {
      if (self.options.saveChoiceInCookies && undefined !== Cookies.get(self.options.saveChoiceInCookies)) {
        self.currentIndex = parseInt(Cookies.get(self.options.saveChoiceInCookies));
      } else if (window.location.hash && -1 !== self.ids.indexOf(window.location.hash.replace('#', ''))) {
        self.currentIndex = self.ids.indexOf(window.location.hash.replace('#', ''));
      } else if (null !== self.options.activeItemIndex && self.itemEls[self.options.activeItemIndex]) {
        self.currentIndex = self.options.activeItemIndex;
      } else {
        self.currentIndex = self.itemEls.index(self.itemEls.filter(".".concat(self["class"], "__item--active")));
      }
    };

    self.selectCurrentItem = function () {
      var itemEl = $(self.itemEls[self.currentIndex]);
      self.itemEls.removeClass(".".concat(self["class"], "__item--active"));
      itemEl.addClass(".".concat(self["class"], "__item--active"));

      if (self.options.itemActiveClass) {
        self.itemEls.removeClass(self.options.itemActiveClass);
        itemEl.addClass(self.options.itemActiveClass);
      }
    };

    self.toggleTargets = function () {
      self.targets.filter(function (item, index) {
        return index !== self.currentIndex;
      }).forEach(function (item) {
        return item.addClass(self.options.visibilityClass);
      });
      self.targets[self.currentIndex].removeClass(self.options.visibilityClass);
    };

    self.itemEls.each(function (index) {
      var itemEl = $(this);
      self.targets[index] = $(itemEl.data('groupedTogglesTarget'));
      self.ids[index] = itemEl.data('groupedTogglesId');
      self.cookies[index] = itemEl.data('groupedTogglesCookie');
      itemEl.on('click', function (event) {
        event.preventDefault();

        if (self.currentIndex !== index) {
          self.currentIndex = index;

          if (self.options.saveChoiceInCookies && self.cookies[index]) {
            Cookies.set(self.options.saveChoiceInCookies, self.currentIndex, {
              expires: 365
            });
          }

          self.selectCurrentItem();
          self.toggleTargets();
        }
      });
    });
    self.getCurrentIndex();
    self.selectCurrentItem();
    self.toggleTargets();
  });
});