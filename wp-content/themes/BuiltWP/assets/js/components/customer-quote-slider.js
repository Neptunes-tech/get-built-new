"use strict";

/* global Swiper */
jQuery(document).ready(function ($) {
  'use strict';

  $('.js-customer-quote-slider').each(function () {
    var self = {
      componentEl: $(this),
      "class": 'js-customer-quote-slider'
    };
    self.options = {
      captionItemActiveClass: 'b-customer-quote__caption-item--active'
    };
    $.extend(self.options, self.componentEl.data('customerQuoteSlider'));
    self.containerEl = self.componentEl.find(".".concat(self["class"], "__container"));
    self.controlEl = self.componentEl.find(".".concat(self["class"], "__control"));
    self.captionEl = self.componentEl.find(".".concat(self["class"], "__caption"));
    self.loaderEl = self.componentEl.find(".".concat(self["class"], "__loader"));
    self.swiperPrevEl = self.componentEl.find('.swiper-button-prev');
    self.swiperNextEl = self.componentEl.find('.swiper-button-next');
    self.captionItemEls = self.componentEl.find(".".concat(self["class"], "__caption-item"));

    self.showCaptionByIndex = function (index) {
      self.captionItemEls.removeClass("".concat(self["class"], "__caption-item--active"));
      $(self.captionItemEls[index]).addClass("".concat(self["class"], "__caption-item--active"));

      if (self.options.captionItemActiveClass) {
        self.captionItemEls.removeClass(self.options.captionItemActiveClass);
        $(self.captionItemEls[index]).addClass(self.options.captionItemActiveClass);
      }
    };

    new Swiper(self.componentEl.find('.swiper-container').get(0), {
      loop: true,
      navigation: {
        nextEl: self.swiperNextEl.get(0),
        prevEl: self.swiperPrevEl.get(0)
      },
      runCallbacksOnInit: false,
      slidesPerView: 1,
      spaceBetween: 22,
      speed: 500,
      on: {
        init: function init(swiper) {
          self.loaderEl.addClass('hidden');
          self.containerEl.removeClass('invisible');
          self.controlEl.removeClass('invisible');
          self.captionEl.removeClass('invisible');
          self.showCaptionByIndex(swiper.realIndex);
        },
        slideChange: function slideChange(swiper) {
          self.showCaptionByIndex(swiper.realIndex);
        }
      }
    });
  });
});