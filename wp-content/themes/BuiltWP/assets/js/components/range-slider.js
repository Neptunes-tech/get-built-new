"use strict";

jQuery(document).ready(function ($) {
  'use strict';

  $('.js-range-slider').each(function () {
    var self = {
      componentEl: $(this),
      "class": 'js-range-slider',
      videos: []
    };
    self.options = {
      classes: {
        'ui-slider': 'c-range-slider',
        'ui-slider-handle': 'c-range-slider__handle',
        'ui-slider-range': 'c-range-slider__range'
      }
    };
    $.extend(self.options, self.componentEl.data('rangeSlider'));
    self.sliderOptions = {
      orientation: 'horizontal',
      range: 'min',
      classes: self.options.classes,
      slide: function slide(event, ui) {
        self.componentEl.val(ui.value);
        self.componentEl.trigger('change');
      },
      value: self.componentEl.val()
    };
    ['min', 'max', 'step'].forEach(function (name) {
      var value = self.componentEl.attr(name);

      if (undefined !== value) {
        self.sliderOptions[name] = parseInt(value);
      }
    });
    self.sliderEl = $('<div></div>');
    self.componentEl.after(self.sliderEl);
    self.sliderEl.slider(self.sliderOptions);
    self.componentEl.on('jsrs.change', function () {
      self.sliderEl.slider('value', $(this).val());
    });
    self.componentEl.addClass('hidden');
  });
});