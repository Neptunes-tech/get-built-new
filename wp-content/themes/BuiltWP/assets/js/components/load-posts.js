"use strict";

/* global builtwpTheme */
jQuery(document).ready(function ($) {
  'use strict';

  $('.js-load-posts').each(function () {
    var self = {
      componentEl: $(this),
      "class": 'js-load-posts',
      ajaxQueue: false,
      ajaxRunning: false
    };
    self.options = {
      alertClass: 'c-alert',
      boundControls: []
    };
    $.extend(self.options, self.componentEl.data('loadPosts'));
    self.inputEls = self.componentEl.find('input, select');
    self.pagedinputEls = self.inputEls.filter('[name="paged"]');
    self.controlEls = self.componentEl.find(".".concat(self["class"], "__control"));
    self.itemsEl = self.componentEl.find(".".concat(self["class"], "__items"));
    self.paginationEl = self.componentEl.find(".".concat(self["class"], "__pagination"));
    self.loaderEl = self.componentEl.find(".".concat(self["class"], "__loader"));
    self.alertEl = self.componentEl.find(".".concat(self["class"], "__alert"));
    self.clearFilters = self.componentEl.find('#clear-filters');

    self.toggleLoader = function (state) {
      self.alertEl.toggleClass('opacity-50', state);
      self.itemsEl.toggleClass('opacity-50', state);
      self.paginationEl.toggleClass('opacity-50', state);
      self.loaderEl.toggleClass('hidden', !state);
    };

    self.showAlert = function (message) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      self.itemsEl.addClass('hidden');
      self.paginationEl.addClass('hidden');
      self.alertEl.html(message);
      self.alertEl.toggleClass("".concat(self.options.alertClass, "--danger"), 1 === type);
      self.alertEl.toggleClass("".concat(self.options.alertClass, "--warning"), 2 === type);
      self.alertEl.removeClass('hidden');
    };

    self.getPosts = function () {
      if (self.ajaxRunning) {
        self.ajaxQueue = true;
        return;
      }

      self.ajaxRunning = true;
      self.toggleLoader(true);
      $.post(builtwpTheme.settings.ajaxURL, self.inputEls.serialize(), function (response) {
        if (response.success) {
          self.alertEl.html('').addClass('hidden');
          self.itemsEl.html(response.data.items).removeClass('hidden');
          self.paginationEl.html(response.data.pagination).removeClass('hidden');
        } else {
          self.showAlert(response.data, 2);
        }
      }).fail(function (jqXHR, textStatus, errorThrown) {
        self.showAlert(errorThrown);
      }).always(function () {
        self.toggleLoader(false);
        self.ajaxRunning = false;

        if (self.ajaxQueue) {
          self.ajaxQueue = false;
          self.getPosts();
        }
      });
    };

    self.updateBoundControls = function (currentEl) {
      var name = currentEl.attr('name');

      if (!self.options.boundControls.includes(name)) {
        return;
      }

      var value = currentEl.val();
      self.controlEls.filter("[name=\"".concat(name, "\"]")).not(currentEl).each(function () {
        var controlEl = $(this);

        if (controlEl.is('[type="radio"]')) {
          if (controlEl.is("[value=\"".concat(value, "\"]"))) {
            controlEl.prop('checked', true);
          }
        } else {
          controlEl.val(value);
        }
      });
    };

    self.controlEls.on('change', function () {
      var controlEl = $(this);
      self.updateBoundControls(controlEl);
      self.pagedinputEls.val(1);
      self.getPosts();
      self.clearFilters.show();
    });
    self.paginationEl.on('click', 'a', function (event) {
      event.preventDefault();
      var extraction = $(this).attr('href').match(/\/page\/([0-9]+)/i);
      self.pagedinputEls.val(extraction ? $(this).attr('href').match(/\/page\/([0-9]+)/i)[1] : 1);
      self.getPosts();
    });
    self.itemsEl.on('click', ".".concat(self["class"], "__eventcat"), function (event) {
      event.preventDefault();
      $('#category').val($(this).attr('href')).trigger('change');
    });
  });
});