require.config({
    baseUrl: gs_custom_js.stylesheet_directory_uri + "/js", // NOTE: gs_custom_js defined in theme/wp_modules/markup.php
    paths: {
        jquery: "jquery/jquery",
        Barba: "barba." + "js/barba",
        validation: "jquery-validation/jquery." + "validate",
        magnific: "magnific-popup/jquery." + "magnific-popup",
        sticky: "sticky-kit/jquery." + "sticky-kit",
        slick: "slick-carousel/slick",
        jscookie: "js-cookie/js." + "cookie",
        imagesLoaded: "imagesloaded/imagesloaded." + "pkgd",
        "gsap.ScrollToPlugin": "gsap/plugins/ScrollToPlugin",
        TweenLite: "gsap/TweenLite",
        TweenMax: "gsap/TweenMax",
        lodash: "lodash/lodash",
        // 'alton':				'alton/jquery.' + 'alton'
    },
    shim: {
        sticky: {
            deps: ["jquery"],
        },
        "gsap.ScrollToPlugin": {
            deps: ["TweenLite"],
        },
        TweenLite: {
            exports: "TweenLite",
        },
        TweenMax: {
            deps: [
                /* Activate */
                "gsap.ScrollToPlugin",
            ],
            exports: "TweenMax",
        },
    },
});

define("add-bind-js-in-global-scope", ["bind"], function (bind) {
    window.Bind = bind;
});

require(["entry"], function () { });

define("global", [
    // module name
    // dependencies
    "jquery",
    "TweenMax",
    "lodash",
    "gsap.ScrollToPlugin",
    "magnific",
    "slick",
    "sticky",
    "imagesLoaded",
], function ($, TweenMax, _) {
    // callback

    var _lastScrollTop = window.pageYOffset || document.documentElement.scrollTop,
        _lastWindowDimensions = {
            width: window.innerWidth,
            height: window.innerHeight,
        },
        _tabletWidth = 991,
        _mobileWidth = 767,
        _topOffset = 80,
        _followIds = [],
        _pageIsReady = true,
        _isFF = !!navigator.userAgent.match(/firefox/i),
        snapscroll = false,
        _scrollDirection = "down",
        all_elements = $("section.gs-module"),
        current_element_index = 0;

    function show_back_to_top() {
        if (
            $(".scroll-hijack").length &&
            window.innerWidth > 991 &&
            window.innerHeight > 719
        ) {
            if (_lastScrollTop > window.innerHeight - _topOffset) {
                if (!$(".back-to-top").hasClass("shown")) {
                    $(".back-to-top").addClass("shown");
                }
            } else {
                if ($(".back-to-top").hasClass("shown")) {
                    $(".back-to-top").removeClass("shown");
                }
            }
        }
    }

    function _check_mobile_os() {
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            return {
                ios: /iPhone|iPad|iPod/i.test(navigator.userAgent),
                iphone: /iPhone/i.test(navigator.userAgent),
                ipod: /iPod/i.test(navigator.userAgent),
                ipad: /iPad/i.test(navigator.userAgent),
                android: /Android/i.test(navigator.userAgent),
                webos: /webOS/i.test(navigator.userAgent),
                blackberry: /BlackBerry/i.test(navigator.userAgent),
                iemobile: /IEMobile/i.test(navigator.userAgent),
                operamini: /Opera Mini/i.test(navigator.userAgent),
            };
        } else {
            return false;
        }
    }

    function _sticky_check() {
        var wd = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        if (wd.width >= _mobileWidth && !_isFF) {
            $(".sticky")
                .stick_in_parent({
                    parent: "main",
                    offset_top: $("header").outerHeight(),
                })
                .on("sticky_kit:bottom", function (evt) {
                    $(evt.target).parent().css("position", "static");
                })
                .on("sticky_kit:unbottom", function (evt) {
                    $(evt.target).parent().css("position", "");
                });
        } else {
            $(".sticky").trigger("sticky_kit:detach");
        }
    }

    function create_stickyness(
        sticky_element,
        parent_element,
        offset_top_amount
    ) {
        var wd = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        if (wd.width >= _mobileWidth) {
            // NOTE: there used to be the conditions `&& ! _isFF`, so if something with StickyKit starts breaking, this could be the reason
            $(sticky_element)
                .stick_in_parent({
                    parent: parent_element,
                    offset_top: offset_top_amount,
                })
                .on("sticky_kit:bottom", function (evt) {
                    $(evt.target).parent().css("position", "static");
                })
                .on("sticky_kit:unbottom", function (evt) {
                    $(evt.target).parent().css("position", "");
                });
        } else {
            $(sticky_element).trigger("sticky_kit:detach");
        }
    }

    // function _follow_check() {
    // 	if ( ! $( '#follow-line' ).length ) {
    // 		var follow_line = $( '<div id="follow-line"></div>' );
    // 		$( '.follow-me' ).append( follow_line );
    // 		$( '.follow-me > ul > li > a:not(.open-window)' ).each( function( ix, obj ) {
    // 			var id = $( obj ).attr( 'href' );
    // 			_followIds.push( id );
    // 		} );
    // 	}
    // }

    function activate_sub_menus() {
        // $( '.menu-alt-1' ).on( 'mouseover', function ( evt ) {
        // 	var first_item = $( this ).find( '.sub-menu[data-depth="0"] > li.menu-item-has-children:first-child' );
        // 	if ( first_item.length ) {
        // 		$( first_item[0] ).mouseover();
        // 	}
        // 	// $( this ).find( '.sub-menu[data-depth="0"] > li.menu-item-has-children:first-child' ).mouseover();
        // 	// console.log( $( this ).find( '.sub-menu[data-depth="0"] > li.menu-item-has-children:first-child' ).length );
        // } );
    }

    function close_mobile_menu(evt) {
        $(".hamburger-icon-container").removeClass("open");
        $("html").removeClass("mobile-menu-open");
    }

    // function _hamburger_check( css_hamburger_selector ) {
    // 	$( css_hamburger_selector ).on( 'click', function( evt ) {
    // 		evt.stopPropagation();
    // 		evt.preventDefault();
    //
    // 		// $( this ).toggleClass( 'open' );
    //
    // 		if ( ! $( this ).hasClass( 'open' ) ) {
    // 			$( this ).addClass( 'open' );
    // 			$( 'html' ).addClass( 'mobile-menu-open' );
    // 			$( '.nav-mobile ul > li > a' ).on( 'click', close_mobile_menu );
    // 		} else {
    // 			$( this ).removeClass( 'open' );
    // 			$( 'html' ).removeClass( 'mobile-menu-open' );
    // 			$( '.nav-mobile ul > li > a' ).off( 'click', close_mobile_menu );
    // 		}
    // 	} );
    // }

    function lazy_bg() {
        if ($("*[data-style]").length) {
            $("*[data-style]").each(function () {
                // pull styles from data attribute
                var thisStyle = $(this).attr("data-style");

                // push styles into style attribute, add preload class
                $(this).attr("style", thisStyle).addClass("image-preload");

                // run bg preload function to catch newly classed elements
                image_preload();
            });
        }
    }

    function image_preload() {
        if ($(".image-preload").length) {
            $(".image-preload")
                .imagesLoaded({}, function () { })
                .progress(function (instance, image) {
                    // $( image.element ).addClass( 'loaded' );
                    //
                    // if ( $( image.element ).hasClass( 'overlay-top-layer' ) ) {
                    // 	// if we are checking the homepage hero overlay image,
                    // 	// we should also show the highlight element
                    // 	$( image.element ).siblings( '.highlight-container' ).addClass( 'visible' );
                    // }
                });
        }
    }

    function svgDraw() {
        $(".svg-draw").each(function (i, elm) {
            var screenBottom = $(window).scrollTop() + $(window).height();
            var buffer = 0;
            var target = $(elm).offset().top + buffer;
            var lineLength = $(elm).attr("stroke-length");

            if (screenBottom >= target) {
                // this relies on the pre-calculating done in svg.js
                $(elm).css("stroke-dashoffset", lineLength * 2);
                $(elm).addClass("animate-ready");
            }
        });
    }

    function scroll_trigger() {
        $(".scroll-trigger").each(function (i, elm) {
            var screenBottom = $(window).scrollTop() + $(window).height();
            var buffer = 0;
            var target = $(elm).offset().top + buffer;
            var animated = $(elm).hasClass("active");

            if (screenBottom >= target) {
                if (!animated) {
                    $(elm).addClass("active");
                }
            }
        });
    }
    function video_start_on_scroll() {
        $(".video-scroll-start").each(function (i, elm) {
            if ($(elm).find("video").length) {
                var video = $(elm).find("video");
                var screenBottom = $(window).scrollTop() + $(window).height();
                var buffer = 80;
                var target_top = $(elm).offset().top + buffer;
                var is_playing = $(elm).hasClass("video-playing");

                if (!is_playing) {
                    video[0].pause();

                    if (screenBottom >= target_top) {
                        $(elm).addClass("video-playing");
                        video[0].play();
                    }
                }
            }
        });
    }

    function throttle(fn, wait) {
        var time = Date.now();
        return function () {
            if (time + wait - Date.now() < 0) {
                fn();
                time = Date.now();
            }
        };
    }

    function scrollAnimation() {
        if (_pageIsReady) {
            svgDraw();
            scroll_trigger();
            video_start_on_scroll();
        }
    }

    // function attach_nav_hover_submenu_events( class_identifier ) {
    // 	var hover_element = $( '.' + class_identifier ),
    // 		dropdown_element = $( '[data-menu-item="' + class_identifier + '"]' );
    //
    // 	hover_element.on( 'mouseenter', function () {
    // 		clearTimeout( $( this ).data( 'timeout-id' ) );
    // 		$( 'html' ).addClass( 'menu-open' );
    // 		dropdown_element.addClass( 'active' );
    // 	} ).on( 'mouseleave', function () {
    // 		var timeout_id = setTimeout( function () {
    // 			dropdown_element.removeClass( 'active' );
    // 			$( 'html' ).removeClass( 'menu-open' );
    // 		}, 50 );
    // 		//set the timeout_id, allowing us to clear this trigger if the mouse comes back over this element, or other element of interest
    // 		$( this ).data( 'timeout-id', timeout_id );
    // 	} );
    //
    // 	dropdown_element.on( 'mouseenter', function () {
    // 		clearTimeout( hover_element.data( 'timeout-id' ) );
    // 	}).on( 'mouseleave', function () {
    // 		var someElement = hover_element,
    // 		timeout_id = setTimeout( function () {
    // 			dropdown_element.removeClass( 'active' );
    // 			$( 'html' ).removeClass( 'menu-open' );
    // 		}, 50 );
    // 		//set the timeout_id, allowing us to clear this trigger if the mouse comes back over
    // 		someElement.data( 'timeout-id', timeout_id );
    // 	});
    // }

    function prepare_dropdowns_for_styling() {
        var select_parents = $("select").parent(".input");
        select_parents.addClass("select");
    }

    function prepare_expandable_content() {
        $(".expandable-content-trigger").on("click", function (evt) {
            $(this).closest(".expandable-content").toggleClass("open");
        });
    }

    function prepare_content_toggle() {
        $(".dropdown-list-trigger").on("click", function (evt) {
            $(".dropdown-list.open").removeClass("open");
            $(this).parent(".dropdown-list").toggleClass("open");
        });
        $(document).click(function (event) {
            if (!$(event.target).parent(".dropdown-list").length) {
                $(".dropdown-list").removeClass("open");
            }
        });
    }

    function prepare_tab_sections() {
        $('[data-toggle="tab"]').on("click", function (evt) {
            evt.preventDefault();
            evt.stopPropagation();

            var tabs = $(this).closest(".tabs");
            $(tabs).find(".tab-control > li").removeClass("active");
            $(tabs).find(".tab-panel").removeClass("active");

            $(this).closest("li").addClass("active");
            var id = $(this).data("anchor");
            $(tabs)
                .find("#" + id + ".tab-panel")
                .addClass("active");
        });
    }

    function optimize_loading() {
        lazy_bg();
        $("html").removeClass("preload");

        if ($("body.home").length) {
            $("html").addClass("animation-running");
            setTimeout(function () {
                $("html").removeClass("animation-running");
            }, 1800); // this delay time coordinates with the total animation time in home.scss
        }
    }

    function sticky_kit() {
        if ($(".sticky").length)
            create_stickyness(".sticky", "main", $("header").outerHeight());
    }

    function magnific() {
        if ($(".magnific").length) $(".magnific").magnificPopup();
    }

    function slick() {
        if ($(".slick").length) {
            $(".slick")
                .not(".slick-initialized")
                .slick({
                    lazyLoad: "ondemand",
                    customPaging: function (slider, i) {
                        var title = $(slider.$slides[i])
                            .find(".carousel-slide")
                            .data("title");
                        return $('<button type="button" />');
                    },
                });
            if ($(".slick.one-slide").length) {
                $(".slick.one-slide").slick("slickSetOption", "autoplay", false, true);
                $(".slick.one-slide").slick("slickSetOption", "arrows", false, true);
                $(".slick.one-slide").slick("slickSetOption", "slidesToShow", 0, true);
            }
        }
    }

    function setup_header_nav() {
        var checkExternalHeaderExists = setInterval(function () {
            if ($("header.site-header").length) {
                // header has loaded

                clearInterval(checkExternalHeaderExists);

                $(".mobile-menu-button-container").on("click", function (evt) {
                    $("html").toggleClass("mobile-menu-open");
                });

                $(".mobile-nav li:not(.menu-item-has-children) a").on(
                    "click",
                    function (evt) {
                        $(".sub-menu").hide();
                        $("html").removeClass("mobile-menu-open");
                    }
                );

                $(".mobile-nav > li.menu-item-has-children > a").on("click", function (
                    evt
                ) {
                    $(this).next().toggle();
                });
            }
        }, 200);
    }

    function custom_stickiness() {
        $('[data-sticky="true"]').each(function (ix, obj) {
            var sticky_class = $(this).data("sticky-class");
            var parent = $(this).data("sticky-parent-class");
            var offset = $(this).data("sticky-offset-pixels");
            var min_width = $(this).data("sticky-min-width-pixels");

            var wd = {
                width: window.innerWidth,
                height: window.innerHeight,
            };

            if (wd.width >= min_width) {
                create_stickyness(
                    "." + sticky_class,
                    "." + parent,
                    offset * 1 + _topOffset
                );
            }
        });
    }

    function smooth_scroll() {
        /*
                SMOOTH SCROLLING FOR HASH ANCHORS
                */
        // Select all links with hashes
        $('a[href*="#"]')
            // Remove links that don't actually link to anything
            .not('[href="#"]')
            .not('[href="#0"]')
            .not(".magnific")
            .not(".magnific-project")
            .not('[data-toggle="tab"]')
            .click(function (event) {
                // On-page links
                if (
                    location.pathname.replace(/^\//, "") ==
                    this.pathname.replace(/^\//, "") &&
                    location.hostname == this.hostname
                ) {
                    // Figure out element to scroll to
                    var target = $(this.hash);
                    target = target.length
                        ? target
                        : $("[name=" + this.hash.slice(1) + "]");
                    // Does a scroll target exist?
                    if (target.length) {
                        // Only prevent default if animation is actually gonna happen
                        event.preventDefault();
                        var scroll_container = $(this).data("scroll-container")
                            ? $(this).data("scroll-container")
                            : "html, body";
                        if ($(target).hasClass("full-height")) {
                            _topOffset = 0;
                        }
                        $(scroll_container).animate(
                            {
                                scrollTop: target.offset().top - _topOffset,
                            },
                            1000,
                            function () {
                                // Callback after animation
                                // Must change focus!
                                var $target = $(target);
                                // $target.focus();
                                if ($target.is(":focus")) {
                                    // Checking if the target was focused
                                    return false;
                                } else {
                                    $target.attr("tabindex", "-1"); // Adding tabindex for elements not focusable
                                    // $target.focus(); // Set focus again
                                }
                            }
                        );
                    }
                }
            });
    }

    function is_hsforms_loaded(url) {
        var scripts = document.getElementsByTagName("script");
        for (var i = scripts.length; i--;) {
            if (scripts[i].src === url) {
                return true;
            }
        }
        return false;
    }

    function load_hsforms(cb) {
        if (!is_hsforms_loaded("//js.hsforms.net/forms/v2.js")) {
            $.getScript("//js.hsforms.net/forms/v2.js").done(function (
                script,
                textStatus
            ) {
                cb();
            });
        } else {
            cb();
        }
    }

    function load_hsform(portal_id, form_id, target) {
        hbspt.forms.create({
            portalId: portal_id,
            formId: form_id,
            css: "",
            target: target,
        });
    }

    var set_scroll_direction = function () {
        var st = get_current_scroll_top();
        if (st > _lastScrollTop) {
            _scrollDirection = "down";
        } else {
            _scrollDirection = "up";
        }
    };

    function on_wheel_homepage_scroll(evt) {
        var delta_y = evt.originalEvent.deltaY;
        deltaOfInterest = -delta_y;

        if (deltaOfInterest === 0) {
            return;
        }

        if (deltaOfInterest > 0) {
            current_element_index -= 1;
        } else if (deltaOfInterest < 0) {
            current_element_index += 1;
        }

        if (current_element_index < 0) {
            current_element_index = 0;
            $("body").addClass("scrolling");
            return;
        }
        if (current_element_index > all_elements.length - 1) {
            current_element_index = all_elements.length;
            $("body").removeClass("scrolling");
            return;
        }

        TweenMax.to(window, 1, {
            scrollTo: {
                y: $(all_elements[current_element_index]).offset().top,
            },
        });
    }

    function prepare_homepage_scroll() {
        current_element_index = 0;
        all_elements = $("section.gs-module");
        $("body").removeClass("scrolling");
        $(document).off("wheel");

        if ($(".scroll-hijack").length) {
            if (window.innerWidth > 991 && window.innerHeight > 719) {
                if (!$("body").hasClass("scrolling")) {
                    $("body").addClass("scrolling");
                }

                TweenMax.to(window, 1, {
                    scrollTo: {
                        y: $(all_elements[current_element_index]).offset().top,
                    },
                    // onComplete: function () {
                    // 	$( 'body' ).addClass( 'scrolling' );
                    // }
                });

                $(document).on(
                    "wheel",
                    _.throttle(on_wheel_homepage_scroll, 1500, {
                        leading: true,
                        trailing: false,
                    })
                );
            }
        }

        // $( '.back-to-top > a' ).off( 'click' );
        // $( '.anchor > a.more' ).off( 'click' );
        if (
            $(".scroll-hijack").length &&
            window.innerWidth > 991 &&
            window.innerHeight > 719
        ) {
            $(".anchor > a.more").on("click", function (evt) {
                current_element_index++;
            });
            $(".back-to-top > a").on("click", function (evt) {
                current_element_index = 0;
            });
            // if ( snapscroll !== false ) { snapscroll.destroy(); }
            $(".back-to-top").addClass("active");
            // snapscroll = $( '.module-scrollify' ).SnapScroll( {
            // 	animateDuration: 1000,
            // 	wheelInterval: 2000
            // } );
        } else {
            $(".back-to-top").removeClass("active");
            // if ( snapscroll !== false ) {
            // 	snapscroll.destroy();
            // 	snapscroll = false;
            // }
        }
    }

    function get_current_scroll_top() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }
    function get_last_scroll_top() {
        return _lastScrollTop;
    }
    function set_last_scroll_top(val) {
        if (val !== undefined) {
            _lastScrollTop = val;
        }
    }

    // // Returns a function, that, when invoked, will only be triggered at most once
    // // during a given window of time. Normally, the throttled function will run
    // // as much as it can, without ever going more than once per `wait` duration;
    // // but if you'd like to disable the execution on the leading edge, pass
    // // `{leading: false}`. To disable execution on the trailing edge, ditto.
    // _.throttle = function(func, wait, options) {
    // 	var context, args, result;
    // 	var timeout = null;
    // 	var previous = 0;
    // 	if (!options) options = {};
    // 	var later = function() {
    // 		previous = options.leading === false ? 0 : _.now();
    // 		timeout = null;
    // 		result = func.apply(context, args);
    // 		if (!timeout) context = args = null;
    // 	};
    // 	return function() {
    // 		var now = _.now();
    // 		if (!previous && options.leading === false) previous = now;
    // 		var remaining = wait - (now - previous);
    // 		context = this;
    // 		args = arguments;
    // 		if (remaining <= 0 || remaining > wait) {
    // 			if (timeout) {
    // 				clearTimeout(timeout);
    // 				timeout = null;
    // 			}
    // 			previous = now;
    // 			result = func.apply(context, args);
    // 			if (!timeout) context = args = null;
    // 		} else if (!timeout && options.trailing !== false) {
    // 			timeout = setTimeout(later, remaining);
    // 		}
    // 		return result;
    // 	};
    // };

    return {
        set_scroll_direction: set_scroll_direction,
        show_back_to_top: show_back_to_top,
        load_hsforms: function (cb) {
            load_hsforms(cb);
        },
        get_element_index: function (node) {
            var index = 0;
            while ((node = node.previousElementSibling)) {
                index += 1;
            }
            return index;
        },
        /*
                SCROLL TOP
                */
        get_current_scroll_top: get_current_scroll_top,

        get_last_scroll_top: get_last_scroll_top,

        set_last_scroll_top: function (val) {
            set_last_scroll_top(val);
        },

        /*
                WINDOW DIMENSIONS
                */
        get_current_window_dimensions: function () {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },

        get_last_window_dimensions: function () {
            return _lastWindowDimensions;
        },

        set_last_window_dimensions: function (val) {
            if (val !== undefined) {
                _lastWindowDimensions = val;
            }
        },

        resize_slick_items: function () {
            if ($(".slick.squared").length) {
                $(".slick.squared .slick-slide").each(function (ix, obj) {
                    var width = $(obj).outerWidth();
                    $(obj).css("height", width + "px");
                });
            }
        },

        stick: function (sticky_el, parent_el, offset_top_amt) {
            create_stickyness(sticky_el, parent_el, offset_top_amt);
        },

        ie: function () {
            var ua = window.navigator.userAgent;

            var msie = ua.indexOf("MSIE ");
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
            }

            var trident = ua.indexOf("Trident/");
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf("rv:");
                return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
            }

            var edge = ua.indexOf("Edge/");
            if (edge > 0) {
                // IE 12 => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
            }

            // other browser
            return false;
        },

        // follow_me: function() {
        // 	if ( $( '.follow-me' ).length ) _follow_check();
        // },
        // follow: function() {
        // 	var $follow_line = $( '#follow-line' );
        // 	if ( $follow_line.length && _followIds.length ) {
        // 		_followIds.map( function( currentValue, index, arr ) {
        // 			if ( _lastScrollTop + _topOffset + ( $( window ).height() / 3 ) >= $( currentValue ).offset().top ) {
        // 				$item = $( '.follow-me' ).find( 'a[href="' + currentValue + '"]' ).closest( 'li' );
        // 				$follow_line
        // 					.width( $item.width() )
        // 					.css( 'left', $item.position().left );
        // 			}
        // 		} );
        // 	}
        // },

        // hamburger: function() {
        // 	if ( $( '.hamburger-icon-container' ).length ) _hamburger_check( '.hamburger-icon-container' );
        // },

        close_mobile: close_mobile_menu,
        svg_draw: svgDraw,
        scroll_trigger: scroll_trigger,
        video_start_on_scroll: video_start_on_scroll,
        optimize_loading: optimize_loading,
        sticky_kit: sticky_kit,
        magnific: magnific,
        slick: slick,
        setup_header_nav: setup_header_nav,
        prepare_dropdowns_for_styling: prepare_dropdowns_for_styling,
        prepare_expandable_content: prepare_expandable_content,
        prepare_content_toggle: prepare_content_toggle,
        prepare_tab_sections: prepare_tab_sections,
        custom_stickiness: custom_stickiness,
        smooth_scroll: smooth_scroll,
        activate_sub_menus: activate_sub_menus,
        throttle: throttle,
        scroll_animation: scrollAnimation,
        page_is_ready: _pageIsReady,
        mobile_os: _check_mobile_os,
        prepare_homepage_scroll: prepare_homepage_scroll,
        last_scroll_top: _lastScrollTop,
    };
});

// check to see if jQuery is already loaded
if (typeof jQuery === "function") {
    define("jquery", function () {
        return jQuery;
    });
}

define("main", [
    // module name
    // dependencies
    "jquery",
    "global",
    "svg",
    "home",
    "resources",
    "modules",
], function ($, global, svg, home, resources, modules) {
    // callback

    var scroll_animation_throttle = global.throttle(global.scroll_animation, 500);
    var scroll_sticky_throttle = global.throttle(
        global.scroll_to_next_section,
        1500
    );

    function window_on_transition(cb) {
        global.scroll_trigger();
        global.video_start_on_scroll();
        global.optimize_loading();
        global.sticky_kit();
        global.magnific();
        global.slick();
        global.prepare_dropdowns_for_styling();
        global.prepare_expandable_content();
        global.prepare_content_toggle();
        global.prepare_tab_sections();
        global.custom_stickiness();
        global.smooth_scroll();
        global.prepare_homepage_scroll();

        resources.prepare_topics_form();
        modules.prepare_modules();

        if (typeof cb === "function") cb();
    }

    function window_on_load(cb) {
        window_on_transition();

        global.setup_header_nav();
        global.activate_sub_menus();
        global.video_start_on_scroll();

        if (typeof cb === "function") cb();
    }

    function window_on_resize(evt) {
        var st = global.get_current_scroll_top(),
            wd = global.get_current_window_dimensions();

        // sticky
        global.sticky_kit();

        // slick
        if (global.get_last_window_dimensions().width !== wd.width) {
            global.resize_slick_items();
        }

        // global.follow_me();
        global.close_mobile();
        global.prepare_homepage_scroll();

        global.set_last_window_dimensions(wd);
        global.set_last_scroll_top(st);
    }

    function window_on_scroll(evt) {
        var lst = global.get_last_scroll_top(),
            st = global.get_current_scroll_top();

        if (st > 0) {
            $("body").addClass("page-scroll");
        } else {
            $("body").removeClass("page-scroll");
        }

        global.show_back_to_top();
        global.set_scroll_direction();

        // global.follow();
        // scroll_animation_throttle();
        global.scroll_animation();

        if ($("body.home-2").length) {
            if (window.innerWidth > 991 && window.innerHeight > 719) {
                // evt.preventDefault();
                // evt.stopPropagation();

                scroll_sticky_throttle();
            }
        }

        global.set_last_scroll_top(st);
    }

    document.documentElement.setAttribute("data-ie", global.ie()); // for stylesheet useage and ie version targeting

    window.addEventListener("resize", window_on_resize);
    window.addEventListener("scroll", window_on_scroll);

    // var last_scroll_top = window.pageYOffset || document.documentElement.scrollTop;
    // window.addEventListener( 'scroll', _.throttle( function () {
    // 	var st = window.pageYOffset || document.documentElement.scrollTop;
    //
    // 	// show/hide nav bar
    // 	if ( st > last_scroll_top && st > 0 ) {
    // 		$( 'body' ).addClass( 'scrolled' );
    // 	} else {
    // 		$( 'body' ).removeClass( 'scrolled' );
    // 	}
    //
    // 	global.scroll_animation();
    //
    // 	// show/hide "Back to Top" anchor
    // 	if ( $( '.module-scrollify' ).length && window.innerWidth > 991 && window.innerHeight > 719 ) {
    // 		if ( last_scroll_top > ( window.innerHeight - 80 ) ) {
    // 			if ( ! $( '.back-to-top' ).hasClass( 'shown' ) ) {
    // 				$( '.back-to-top' ).addClass( 'shown' );
    // 			}
    // 		} else {
    // 			if ( $( '.back-to-top' ).hasClass( 'shown' ) ) {
    // 				$( '.back-to-top' ).removeClass( 'shown' );
    // 			}
    // 		}
    // 	}
    //
    // 	last_scroll_top = st <= 0 ? 0 : st;
    // }, 500 ) );

    window_on_load();

    // sneaking this into the wrong place
    // TODO put this in clean function
    // var checkExternalHeaderExists = setInterval(function() {
    // 	console.log('searching for header .nav-drop-down');
    // 	if ($('header .nav-drop-down').length) {
    // 		console.log('found header .nav-drop-down');
    // 		clearInterval(checkExternalHeaderExists);
    // 		global.setup_header_nav();
    // 	}
    // }, 200);

    return {
        // window_on_load: load_window
        window_on_transition: window_on_transition,
    };
});

define("transition", [
    // module name
    // dependencies
    "jquery",
    "global",
    "main",
    "Barba",
], function ($, global, __m, Barba) {
    // callback

    // override default getHref check
    Barba.Pjax.getHref = function (el) {
        if (!el) {
            return undefined;
        }

        if (el.getAttribute && typeof el.getAttribute("xlink:href") === "string") {
            // return el.getAttribute('xlink:href');
        }

        if (typeof el.href === "string") {
            return el.href;
        }

        return undefined;
    };

    if ($('#barba-wrapper[data-pagetransitions="true"]').length) {
        var GSPageTransition = Barba.BaseTransition.extend({
            start: function () {
                global.page_is_ready = false;

                /**
                 * This function is automatically called as soon the Transition starts
                 * this.newContainerLoading is a Promise for the loading of the new container
                 * (Barba.js also comes with an handy Promise polyfill!)
                 */

                // As soon the loading is finished and the old page is faded out, let's fade the new page
                Promise.all([this.newContainerLoading, this.fadeOut()]).then(
                    this.fadeIn.bind(this)
                );
            },
            fadeOut: function () {
                /**
                 * this.oldContainer is the HTMLElement of the old Container
                 */
                $("#barba-wrapper").addClass("is-exiting");
                $(".menu-bars").removeClass("open");

                return $(this.oldContainer)
                    .animate({ opacity: 0 }, 500, function () {
                        // $( 'body' ).css( 'overflow', 'auto' );
                        $("html, body").scrollTop(0);
                    })
                    .promise();
            },
            fadeIn: function () {
                /**
                 * this.newContainer is the HTMLElement of the new Container
                 * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
                 * Please note, newContainer is available just after newContainerLoading is resolved!
                 */
                var _this = this;
                var $el = $(this.newContainer);
                $(this.oldContainer).hide();
                $el.css({
                    opacity: 0,
                    visibility: "visible",
                });
                $el.animate({ opacity: 1 }, 500, function () {
                    // $( 'body' ).css( 'overflow', 'hidden' );
                    $("#barba-wrapper").removeClass("is-exiting").addClass("is-entering");

                    global.page_is_ready = true;
                    _this.done();
                });
            },
        });

        Barba.Pjax.getTransition = function () {
            return GSPageTransition;
        };

        Barba.Pjax.start();

        Barba.Dispatcher.on("newPageReady", function (
            current_status,
            previous_status,
            html_element_container,
            new_page_raw_html
        ) {
            var regx = new RegExp('<body.*class="([^"]*)">?', "g");
            var body_classes = regx.exec(new_page_raw_html);

            if (body_classes.length) {
                $("body").attr("class", body_classes[1]);
            }

            // var js = $( html_element_container ).find( "script" );
            // $( js ).each( function ( ix, obj ) {
            // 	if( obj != null ) {
            // 		eval( $( obj ).html() );
            // 	}
            // } );

            var newPage = $(new_page_raw_html);
            update_nav(newPage);
        });

        Barba.Dispatcher.on("transitionCompleted", function () {
            jQuery(function ($) {
                $("#barba-wrapper").removeClass("is-entering");
            });

            __m.window_on_transition();
        });
    }

    function update_nav(domDoc) {
        var $ = jQuery;

        // find the active nav element from the new page
        var activeNav = domDoc
            .find("#menu-header-main .current-menu-parent a")
            .first();

        // remove current active nav classes
        $("#menu-header-main .current-menu-parent").removeClass(
            "current-menu-parent"
        );
        $("#menu-header-main .current-menu-ancestor").removeClass(
            "current-menu-ancestor"
        );
        $("#menu-header-main .current-page-ancestor").removeClass(
            "current-page-ancestor"
        );
        $("#menu-header-main .current-page-item").removeClass("current-page-item");
        $("#menu-header-main .current-menu-item").removeClass("current-menu-item");

        // as long as the new active nav exists (we are loading a top-level nav page)
        if (activeNav["0"]) {
            // get the href of the active nav link from new page
            var activeHref = activeNav["0"].href;

            // find that link on the current site
            var newNav = $("#menu-header-main")
                .find('a[href="' + activeHref + '"]')
                .first()
                .parent("li");

            // if exists, add the class. Classy.
            if (newNav) {
                newNav.addClass("current-menu-item").addClass("current-menu-parent");
            }
        }

        // // find the active mobile nav element from the new page
        // var activeMobileNav = domDoc.find('#menu-mobile-menu-main .current-menu-item a');
        //
        // // remove current active mobile nav classes
        // $('#menu-mobile-menu-main .current-menu-item').removeClass('current-menu-item  current-page-ancestor');
        //
        // // as long as the new active mobile nav exists (we are loading a top-level nav page)
        // if(activeMobileNav["0"]){
        // 	// get the href of the active mobile nav link from new page
        // 	var activeMobileHref = activeMobileNav["0"].href;
        //
        // 	// find that link on the current site
        // 	var newMobileNav = $('#menu-mobile-menu-main').find('a[href="'+ activeMobileHref +'"]').parent('li');
        //
        // 	// if exists, add the class. Classy.
        // 	if(newMobileNav){
        // 		newMobileNav.addClass('current-menu-item');
        // 	}
        // }
    }

    // function update_resource_search_navs( domDoc ){
    // 	var $ = jQuery;
    //
    // 	// find the active nav element from the new page
    // 	var activeTypeNav = domDoc.find( '.resources-filter-types > ul > li.active' );
    //
    // 	// remove current active nav classes
    // 	$( '.resources-filter-types > ul > li' ).removeClass( 'active' );
    //
    // 	// as long as the new active nav exists (we are loading a top-level nav page)
    // 	if ( activeTypeNav["0"] ) {
    // 		// get the href of the active nav link from new page
    // 		var activeHref = activeTypeNav["0"].href;
    //
    // 		// find that link on the current site
    // 		var newNav = $( '#main-nav' ).find( 'a[href="' + activeHref + '"]' ).parent( 'li' );
    //
    // 		// if exists, add the class. Classy.
    // 		if ( newNav ) {
    // 			newNav.addClass( 'current-menu-item' );
    // 		}
    // 	}
    //
    // 	// find the active mobile nav element from the new page
    // 	var activeTopciNav = domDoc.find('.resources-filter-topics select[name="select-topics"] > option:selected');
    //
    // 	$( '[name="select-topics"]' ).off( 'change' );
    // 	$('.resources-filter-topics select[name="select-topics"] > option[value=""]').prop( 'selected', true );
    //
    // }
});

define("entry", ["main", "transition"], function () { });

define("home", [
    // module name
    // dependencies
    "jquery",
    "global",
], function ($, global, scroll) {
    // callback
});

define("modules", ["jquery", "global"], function ($, __g) {
    function prepare_modules() {
        // image-w-feature-list module
        $("ul.image-wfeature-list-features > li").off("mouseover");
        $("ul.image-wfeature-list-features > li").on("mouseover", function (evt) {
            var section = $(this).closest(".image-wfeature-list-module").attr("id");
            var id = $(this).data("id");
            var icon = $(this).data("icon");
            $(
                section + ' .image-wfeature-list-image[data-feature="' + id + '"]'
            ).addClass("active");
            $(section + " .image-wfeature-list-footer-icon").css({
                "background-image":
                    "url('" +
                    icon +
                    "'), url('" +
                    gs_custom_js.stylesheet_directory_uri +
                    "/img/icons/icon-circle.svg')",
            });
        });
        $("ul.image-wfeature-list-features > li").off("mouseout");
        $("ul.image-wfeature-list-features > li").on("mouseout", function (evt) {
            var section = $(this).closest(".image-wfeature-list-module").attr("id");
            $(section + " .image-wfeature-list-image").removeClass("active");
            $(section + " .image-wfeature-list-footer-icon").css({
                "background-image":
                    "url('" +
                    gs_custom_js.stylesheet_directory_uri +
                    "/img/icons/icon-circle-dots.svg'), url('" +
                    gs_custom_js.stylesheet_directory_uri +
                    "/img/icons/icon-circle.svg')",
            });
        });

        if ($(".svg-hover-animate").length) {
            $(".image-wfeature-list-features li").off("mouseover");
            $(".image-wfeature-list-features li").on("mouseover", function (evt) {
                var stage_class = $(this).data("class"),
                    this_module = $(this).closest(".svg-hover-animate");

                this_module.addClass(stage_class).addClass("svg-hover-animate-active");
            });
            $(".image-wfeature-list-features li").off("mouseout");
            $(".image-wfeature-list-features li").on("mouseout", function (evt) {
                var stage_class = $(this).data("class"),
                    this_module = $(this).closest(".svg-hover-animate");

                this_module
                    .removeClass(stage_class)
                    .removeClass("svg-hover-animate-active");
            });
        }

        // page-to-page navigation "module"
        $(".p2p-next-page-link > a").off("mouseover");
        $(".p2p-next-page-link > a").on("mouseover", function (evt) {
            $(".p2p-current-page").removeClass("active");
            $(".p2p-next-page").addClass("active");
        });
        $(".p2p-next-page-link > a").off("mouseout");
        $(".p2p-next-page-link > a").on("mouseout", function (evt) {
            $(".p2p-next-page").removeClass("active");
            $(".p2p-current-page").addClass("active");
        });

        if ($(".text-w-grid-magnific").length) {
            $(".text-w-grid-magnific").magnificPopup({
                type: "inline",
                closeBtnInside: true,
                callbacks: {
                    open: function () {
                        var mp = $.magnificPopup.instance,
                            current_link = $(mp.currItem.el[0]);

                        $(".text-w-grid-slick").slick();
                        $(".text-w-grid-slick").slick(
                            "slickGoTo",
                            current_link.data("slide-index"),
                            true
                        );
                    },
                    close: function () {
                        $(".text-w-grid-slick").slick("unslick");
                    },
                },
            });
        }

        var slick_w_nav_text = function () {
            if ($(".slick-w-nav-text").length) {
                $(".slick-w-nav-text")
                    .not(".slick-initialized")
                    .slick({
                        lazyLoad: "ondemand",
                        customPaging: function (slider, i) {
                            var title = $(slider.$slides[i])
                                .find(".carousel-slide")
                                .data("title");
                            return $('<button type="button" />').text(title);
                        },
                    });
            }
        };
        slick_w_nav_text();
        window.addEventListener("resize", slick_w_nav_text);

        if ($(".embedded-form").length) {
            var portal_id = $(".embedded-form").data("portal-id"),
                form_id = $(".embedded-form").data("form-id"),
                target = ".embedded-form";

            __g.load_hsforms(function () {
                hbspt.forms.create({
                    portalId: portal_id,
                    formId: form_id,
                    css: "",
                    target: target,
                });
            });
        }
    }

    return {
        prepare_modules: prepare_modules,
    };
});

define("resources", ["global", "jquery"], function (global, $) {
    function prepare_topics_form() {
        if ($('[name="select-topics"]').length) {
            $('[name="select-topics"]').on("change", resource_topic_on_change);
        }
    }

    function resource_topic_on_change(evt) {
        $("html").addClass("searching");

        var form = $('[name="form-resources-filter"]');
        $(form).attr("action", $(this).val());
        $(form).submit();
    }

    return {
        prepare_topics_form: prepare_topics_form,
    };
});

define("svg", ["jquery"], function ($) {
    /* SVG Shape measuring tools via http://stackoverflow.com/questions/30355241/get-the-length-of-a-svg-line-rect-polygon-and-circle-tags */
    /**
     * Used to get the length of a rect
     *
     * @param el is the rect element ex $('.rect')
     * @return the length of the rect in px
     */
    getRectLength = function (el) {
        var w = el.attr("width");
        var h = el.attr("height");

        return w * 2 + h * 2;
    };

    /**
     * Used to get the length of a Polygon
     *
     * @param el is the Polygon element ex $('.polygon')
     * @return the length of the Polygon in px
     */
    getPolygonLength = function (el) {
        var points = el.attr("points");
        points = points.split(" ");
        var x1 = null,
            x2,
            y1 = null,
            y2,
            lineLength = 0,
            x3,
            y3;
        for (var i = 0; i < points.length; i++) {
            var coords = points[i].split(",");
            if (x1 === null && y1 === null) {
                if (/(\r\n|\n|\r)/gm.test(coords[0])) {
                    coords[0] = coords[0].replace(/(\r\n|\n|\r)/gm, "");
                    coords[0] = coords[0].replace(/\s+/g, "");
                }

                if (/(\r\n|\n|\r)/gm.test(coords[1])) {
                    coords[0] = coords[1].replace(/(\r\n|\n|\r)/gm, "");
                    coords[0] = coords[1].replace(/\s+/g, "");
                }

                x1 = coords[0];
                y1 = coords[1];
                x3 = coords[0];
                y3 = coords[1];
            } else {
                // if(coords[0] !== "" && coords[1] !== ""){
                if (!isNaN(coords[0]) && !isNaN(coords[1])) {
                    if (/(\r\n|\n|\r)/gm.test(coords[0])) {
                        coords[0] = coords[0].replace(/(\r\n|\n|\r)/gm, "");
                        coords[0] = coords[0].replace(/\s+/g, "");
                    }

                    if (/(\r\n|\n|\r)/gm.test(coords[1])) {
                        coords[0] = coords[1].replace(/(\r\n|\n|\r)/gm, "");
                        coords[0] = coords[1].replace(/\s+/g, "");
                    }

                    x2 = coords[0];
                    y2 = coords[1];
                    // console.log('x: ' + x2);
                    // console.log('y: ' + y2);

                    lineLength += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

                    // console.log('line length: ' + lineLength);

                    x1 = x2;
                    y1 = y2;
                    if (i == points.length - 2) {
                        lineLength += Math.sqrt(
                            Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2)
                        );
                    }
                }
            }
        }
        return lineLength * 1.05;
    };

    /**
     * Used to get the length of a line
     *
     * @param el is the line element ex $('.line')
     * @return the length of the line in px
     */
    getLineLength = function (el) {
        var x1 = el.attr("x1");
        var x2 = el.attr("x2");
        var y1 = el.attr("y1");
        var y2 = el.attr("y2");
        var lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return lineLength;
    };

    /**
     * Used to get the length of a circle
     *
     * @param el is the circle element
     * @return the length of the circle in px
     */
    getCircleLength = function (el) {
        var r = el.attr("r");
        var circleLength = 2 * Math.PI * r;
        return circleLength;
    };

    /**
     * Used to get the length of the path
     *
     * @param el is the path element
     * @return the length of the path in px
     */
    getPathLength = function (el) {
        var pathCoords = el.get(0);
        var pathLength = pathCoords.getTotalLength();
        return pathLength;
    };

    preCalculate = function () {
        /* SVG Draw Pre-calculations */
        if ($(".svg-draw").length) {
            $(".svg-draw").each(function () {
                // get length of all svg elements, and assign the largest of each svg's paths to 'length' var... this will be our stroke offset

                var thisSVG = $(this);
                var thisLines;
                if ($(this).find("#outlines").length) {
                    thisLines = $(this).find("#outlines");
                } else {
                    thisLines = $(this);
                }
                var length = "";
                thisLines.find("path").each(function () {
                    thisLength = Math.ceil(this.getTotalLength());
                    if (thisLength > length) {
                        length = thisLength;
                    }
                });
                thisLines.find("rect").each(function () {
                    thisLength = Math.ceil(getRectLength($(this)));
                    if (thisLength > length) {
                        length = thisLength;
                    }
                });
                thisLines.find("polygon").each(function () {
                    // console.log('polygon' + $(this).attr('points'));
                    thisLength = Math.ceil(getPolygonLength($(this)));
                    if (thisLength > length) {
                        length = thisLength;
                    }
                    // console.log('rounded polygon' + thisLength);
                });
                thisLines.find("line").each(function () {
                    thisLength = Math.ceil(getLineLength($(this)));
                    if (thisLength > length) {
                        length = thisLength;
                    }
                });
                thisLines.find("circle").each(function () {
                    thisLength = Math.ceil(getCircleLength($(this)));
                    if (thisLength > length) {
                        length = thisLength;
                    }
                });

                // assign value to attribue (not currently beign used, could be useful)
                thisSVG.attr("stroke-length", length);

                // set initial values, which will be animated out
                thisSVG.css({
                    "stroke-dasharray": length,
                    "stroke-dashoffset": length,
                });
            });
            // console.log('svg scripts');
        }
    };

    return {
        pre_calculate: preCalculate,
    };
});