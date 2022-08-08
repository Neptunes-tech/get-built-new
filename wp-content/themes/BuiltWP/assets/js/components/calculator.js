"use strict";

/* global Inputmask, mexp, BigPicture */
jQuery(document).ready(function ($) {
  'use strict';

  $('.js-calculator').each(function () {
    var self = {
      componentEl: $(this),
      "class": 'js-calculator',
      controls: {},
      variables: {},
      placeholders: []
    };
    self.controlEls = self.componentEl.find(".".concat(self["class"], "__control"));
    self.controlFieldEls = self.controlEls.filter(".".concat(self["class"], "__control--field"));
    self.placeholderEls = self.componentEl.find(".".concat(self["class"], "__placeholder"));
    self.resultButtonEl = self.componentEl.find(".".concat(self["class"], "__result-button"));
    self.resultBlockEl = self.componentEl.find(".".concat(self["class"], "__result-block"));

    self.extractValue = function (value) {
      return parseFloat(value.replace(/\D+/g, ''));
    };

    self.updateControls = function (elements, value) {
      if (0 === elements.length) {
        return;
      }

      elements.each(function () {
        var element = $(this);

        if ('radio' === element.attr('type')) {
          if (value === element.val()) {
            element.prop('checked', true);
          }
        } else {
          element.val(value);
          element.trigger('jsrs.change');
        }
      });
    };

    self.calculatePlaceholders = function () {
      self.placeholders.forEach(function (item) {
        var value = parseInt(mexp.eval(item.formula, Object.keys(self.variables).map(function (name) {
          return {
            type: 3,
            token: '$' + name,
            show: '$' + name,
            value: name
          };
        }), self.variables));

        if (item.property) {
          item.element.css(item.property, Math.min(Math.max(value, 0), 100));
        } else {
          item.element.html(value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        }
      });
    };

    self.controlFieldEls.each(function () {
      var element = $(this);
      var options = element.data('calculatorInputmask');
      options.rightAlign = false;
      options.alias = 'currency';
      options.digits = 0;

      options.oncomplete = function () {
        return element.trigger('change');
      };

      Inputmask(options).mask(this);
    });
    self.controlEls.each(function () {
      var element = $(this);
      var name = element.data('calculatorName');
      self.controls[name] = name in self.controls ? self.controls[name].add(element) : element;
      self.variables[name] = self.extractValue(element.val());
      element.on('change', function () {
        self.variables[name] = self.extractValue(element.val());
        self.updateControls(self.controls[name].not(element), self.variables[name].toString());
        self.calculatePlaceholders();
      });
    });
    self.placeholderEls.each(function () {
      var element = $(this);
      self.placeholders.push({
        element: element,
        formula: element.data('calculatorFormula'),
        property: element.data('calculatorProperty')
      });
    });

    if (self.resultButtonEl.length) {
      var onMessage = function onMessage(event) {
        if (self.resultButtonEl.get(0).origin !== event.origin) {
          return;
        }

        if ('function' === typeof window[event.data.callback]) {
          window[event.data.callback].call(null);
        }
      };

      if (window.addEventListener) {
        window.addEventListener('message', onMessage, false);
      } else if (window.attachEvent) {
        window.attachEvent('onmessage', onMessage, false);
      }

      self.resultButtonEl.on('click', function (event) {
        event.preventDefault();
        self.bigpicture = BigPicture({
          el: this,
          iframeSrc: self.resultButtonEl.attr('href'),
          dimensions: [904, 700],
          animationEnd: function animationEnd() {
            window.builtwpCalculatorResults = function () {
              self.bigpicture.close();
              self.resultButtonEl.addClass('hidden');
              self.resultBlockEl.removeClass('hidden');
            };
          },
          onClose: function onClose() {
            if (!self.resultBlockEl.hasClass('hidden')) {
              $([document.documentElement, document.body]).animate({
                scrollTop: self.resultBlockEl.offset().top - $('.site-header').height() - 20
              }, 1000);
            }
          }
        });
      });
    }

    self.calculatePlaceholders();
  });
});