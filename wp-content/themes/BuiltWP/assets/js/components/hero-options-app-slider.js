"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/* global Swiper */
jQuery(document).ready(function ($) {
  'use strict';

  $('.js-hero-options-app-slider').each(function () {
    var self = {
      componentEl: $(this),
      "class": 'js-hero-options-app-slider',
      paginationItemElSet: {},
      isMobile: null,
      resizeTimer: null,
      videoSetLazyLoader: new window.builtwp.VideoSetLazyLoader()
    };
    self.options = {
      paginationItemActiveClass: ''
    };
    $.extend(self.options, self.componentEl.data('heroOptionsAppSlider'));
    self.containerEl = self.componentEl.find(".".concat(self["class"], "__container"));
    self.loaderEl = self.componentEl.find(".".concat(self["class"], "__loader"));
    self.paginationItemEls = self.componentEl.find(".".concat(self["class"], "__pagination-item"));

    self.isObject = function (value) {
      return 'object' === _typeof(value) && !Array.isArray(value) && null !== value;
    };

    self.checkMobile = function () {
      var isMobile = !window.matchMedia('(min-width: 1024px)').matches;

      if (isMobile === self.isMobile) {
        return;
      }

      self.isMobile = isMobile;
      self.onChangeDevice();
    };

    self.onChangeDevice = function () {
      if (self.swiper) {
        self.destroySwiper();
      }

      self.initSwiper();
    };

    self.showCaptionByIndex = function (index) {
      self.paginationItemEls.removeClass("".concat(self["class"], "__pagination-item--active"));
      $(self.paginationItemEls[index]).addClass("".concat(self["class"], "__pagination-item--active"));
      $.each(self.paginationItemElSet, function (selector, item) {
        item.elements.forEach(function (element) {
          return $(element).removeClass(item.classes);
        });
        $(item.elements[index]).addClass(item.classes);
      });
    };

    self.initSwiper = function () {
      var parameters = {
        loop: false,
        spaceBetween: 40,
        speed: 500,
        runCallbacksOnInit: false,
        on: {
          init: function init(swiper) {
            self.videoSetLazyLoader.swiper = swiper;
            self.videoSetLazyLoader.getVideoFromSwiper(swiper);
            self.loaderEl.addClass('hidden');
            self.containerEl.removeClass('invisible');
            self.showCaptionByIndex(swiper.activeIndex);
            self.videoSetLazyLoader.initSwiperObserver(self.containerEl.get(0));
          },
          slideChange: function slideChange(swiper) {
            self.showCaptionByIndex(swiper.activeIndex);
          },
          slideChangeTransitionEnd: function slideChangeTransitionEnd(swiper) {
            self.videoSetLazyLoader.pauseAllVideo();
            self.videoSetLazyLoader.playVideo(swiper.activeIndex);
          }
        }
      };

      if (!self.isMobile) {
        parameters.spaceBetween = 0;
        parameters.effect = 'fade';
      }

      self.swiper = new Swiper(self.containerEl.get(0), parameters);
    };

    self.destroySwiper = function () {
      self.loaderEl.removeClass('hidden');
      self.containerEl.addClass('invisible');
      self.swiper.destroy();
    };

    if (self.options.paginationItemActiveClass) {
      if (self.isObject(self.options.paginationItemActiveClass)) {
        $.each(self.options.paginationItemActiveClass, function (selector, classes) {
          self.paginationItemElSet[selector] = {
            elements: [],
            classes: classes
          };
        });
      } else {
        self.paginationItemElSet[':root'] = {
          elements: [],
          classes: self.options.paginationItemActiveClass
        };
      }
    }

    self.paginationItemEls.each(function (index) {
      var paginationItemEl = $(this);

      if (self.options.paginationItemActiveClass) {
        if (self.isObject(self.options.paginationItemActiveClass)) {
          $.each(self.options.paginationItemActiveClass, function (selector) {
            self.paginationItemElSet[selector].elements[index] = ':root' === selector ? paginationItemEl : paginationItemEl.find(selector);
          });
        } else {
          self.paginationItemElSet[':root'].elements[index] = paginationItemEl;
        }
      }

      paginationItemEl.on('click', function (event) {
        event.preventDefault();

        if (self.currentIndex !== index) {
          self.swiper.slideTo(index);
          self.currentIndex = index;
        }
      });
    });
    $(window).on('resize', function () {
      clearTimeout(self.resizeTimer);
      self.resizeTimer = setTimeout(function () {
        self.checkMobile();
      }, 100);
    });
    self.checkMobile();
  });
});