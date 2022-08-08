"use strict";

jQuery(document).ready(function ($) {
  'use strict';

  $('.js-counterup-progress-bar').each(function () {
    var self = {
      componentEl: $(this),
      "class": 'js-counterup-progress-bar',
      animatedItems: []
    };
    self.options = {
      targetVisibility: 100,
      counterDuration: 600,
      indicatorProperty: 'width',
      indicatorValue: '',
      animatedElements: {}
    };
    $.extend(self.options, self.componentEl.data('counterupProgressBar'));
    self.counterUp = window.counterUp["default"];
    self.indicatorEl = self.componentEl.find(".".concat(self["class"], "__indicator"));
    self.counterEl = self.componentEl.find(".".concat(self["class"], "__counter"));
    $.each(self.options.animatedElements, function (selector, classes) {
      self.animatedItems.push({
        element: self.componentEl.find(selector),
        classes: classes
      });
    });
    self.observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !self.counterEl.hasClass(".".concat(self["class"], "__value--active"))) {
          self.counterEl.one('transitionstart', function () {
            self.counterUp(self.counterEl.get(0), {
              duration: self.options.counterDuration,
              delay: 25
            });
          });
          self.counterEl.addClass(".".concat(self["class"], "__value--active"));
          self.animatedItems.forEach(function (item) {
            return item.element.addClass(item.classes);
          });
          self.indicatorEl.css(self.options.indicatorProperty, self.options.indicatorValue);
        }
      });
    }, {
      threshold: self.options.targetVisibility / 100
    });
    self.observer.observe(self.componentEl.get(0));
  });
});