"use strict";

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  if (!('builtwp' in window)) {
    window.builtwp = {};
  }

  window.builtwp.VideoSetLazyLoader = function () {
    var self = this;
    this.videos = [];
    this.swiper;

    this.getVideoFromSwiper = function () {
      self.swiper.slides.forEach(function (slide, index) {
        var videoEl = slide.querySelector('video');

        if (videoEl) {
          self.videos[index] = {
            videoEl: videoEl,
            sourceEl: videoEl.querySelector('source')
          };
        }
      });
    };

    this.initSwiperObserver = function (containerEl) {
      self.observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (null !== entry.target.offsetParent && entry.isIntersecting) {
            self.playVideo(self.swiper.activeIndex);
          } else {
            self.pauseAllVideo();
          }
        });
      });
      self.observer.observe(containerEl);
    };

    this.playVideo = function (index) {
      if (!self.videos[index]) {
        return;
      }

      if (!self.videos[index].sourceEl.hasAttribute('src')) {
        self.videos[index].sourceEl.src = self.videos[index].sourceEl.dataset.src;
        self.videos[index].videoEl.load();
      }

      self.videos[index].videoEl.muted = true;
      self.videos[index].videoEl.play();
    };

    this.pauseAllVideo = function () {
      self.videos.forEach(function (video) {
        return video.videoEl.pause();
      });
    };
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (null !== entry.target.offsetParent && entry.isIntersecting) {
        if (!entry.target.classList.contains('js-video-lazy-loader--loaded')) {
          for (var index in entry.target.children) {
            var source = entry.target.children[index];

            if ('string' === typeof source.tagName && 'SOURCE' === source.tagName) {
              source.src = source.dataset.src;
            }
          }

          entry.target.load();
          entry.target.classList.add('js-video-lazy-loader--loaded');
          entry.target.play();
        } else {
          entry.target.play();
        }
      } else {
        entry.target.pause();
      }
    });
  });
  document.querySelectorAll('.js-video-lazy-loader').forEach(function (element) {
    observer.observe(element);
  });
});