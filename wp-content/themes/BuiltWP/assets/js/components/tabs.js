"use strict";

jQuery(document).ready(function ($) {
  'use strict';

  $('.js-tabs').each(function () {
    var self = {
      componentEl: $(this),
      "class": 'js-tabs',
      videos: []
    };
    self.options = {
      navigationActiveClass: '',
      contentActiveClass: '',
      navigationExtraSelector: '',
      contentExtraSelector: ''
    };
    $.extend(self.options, self.componentEl.data('tabs'));
    self.navigationEls = self.componentEl.find(".".concat(self["class"], "__navigation").concat(self.options.navigationExtraSelector));
    self.contentEls = self.componentEl.find(".".concat(self["class"], "__content").concat(self.options.contentExtraSelector));
    self.currentIndex = self.contentEls.index(self.contentEls.filter(".".concat(self["class"], "__content--active")));
    self.componentEl.find('video').each(function () {
      self.videos.push({
        videoEl: this,
        sourceEl: this.querySelector('source')
      });
    });

    self.playVisibleVideos = function () {
      self.videos.forEach(function (item) {
        if ($(item.videoEl).is(':visible') && 'visible' === $(item.videoEl).css('visibility')) {
          if (!item.sourceEl.hasAttribute('src')) {
            item.sourceEl.src = item.sourceEl.dataset.src;
            item.videoEl.load();
          }

          item.videoEl.muted = true;
          item.videoEl.play();
        } else {
          item.videoEl.pause();
        }
      });
    };

    self.navigationEls.each(function (index) {
      var navigationEl = $(this);
      var contentEl = $(self.contentEls.get(index));
      navigationEl.on('click', function (event) {
        if (0 === $(event.target).closest('a').length) {
          event.preventDefault();

          if (self.currentIndex !== index) {
            $(self.contentEls[index]).one('transitionend', function () {
              self.playVisibleVideos();
            });
            self.navigationEls.removeClass(".".concat(self["class"], "__navigation--active"));
            $(self.navigationEls[index]).addClass(".".concat(self["class"], "__navigation--active"));
            self.contentEls.removeClass(".".concat(self["class"], "__content--active"));
            $(self.contentEls[index]).addClass(".".concat(self["class"], "__content--active"));

            if (self.options.navigationActiveClass) {
              self.navigationEls.removeClass(self.options.navigationActiveClass);
              navigationEl.addClass(self.options.navigationActiveClass);
            }

            if (self.options.contentActiveClass) {
              self.contentEls.removeClass(self.options.contentActiveClass);
              contentEl.addClass(self.options.contentActiveClass);
            }

            self.playVisibleVideos();
            self.currentIndex = index;
          }
        }
      });
    });
  });
});