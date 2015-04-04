/*!
 * simpleSlide - jQuery Plugin
 * version: 0.8.1
 * @requires jQuery v1.6 or later
 *
 *
 * Copyright 2012 Alexander Eder
 *
 */

/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

;
(function ($, window, document, undefined) {

   var pluginName = 'simpleSlide',
      defaults = {
         playing: true,
         shuffle: true,
         speed: 9000,
      };

   // The actual plugin constructor
   function Plugin(element, options) {
      this.element = element;

      this.options = $.extend({}, defaults, options);

      this._defaults = defaults;
      this._name = pluginName;

      this.init();
   }

   Plugin.prototype.init = function () {
      this.playing = this.options.playing;
      this.shuffle = this.options.shuffle;
      this.speed = this.options.speed;
      this.slides = this.options.slides;
      this.currentPicture = 0;
      var $this = this;
      if (typeof (this.slides) == 'undefined') {
         var json = this.options.json;
         if (typeof (json) != 'undefined') {
            $.ajax({
               type: 'GET',
               url: json,
               dataType: 'json',
               success: function (data) {
                  $this.slides = data;
               },
               data: {},
               async: false
            });
         } else {
            console.error("define slides or json for simpleSlide");
         }

      }
      if (this.shuffle) {
         this.slides = this.arrayShuffle(this.slides);
      }
      this.buildSlideshow();

      $(this.element).find(".simplePause").click(function () {
         $this.togglePlay();
      });
      $(this.element).find(".simpleNext").click(function () {
         $this.nextPicture();
      });
      $(this.element).find(".simplePrev").click(function () {
         $this.prevPicture();
      });
      $(this.element).mouseenter(function () {
         $(this).children(".simpleTitle").slideDown();
         $(this).children(".simpleControlls").fadeIn();
      }).mouseleave(function () {
         $(this).children(".simpleTitle").slideUp();
         $(this).children(".simpleControlls").fadeOut();
      });

      this.slideLoop = window.setTimeout(function () {
         $this.nextPicture();
      }, this.speed);
   };

   Plugin.prototype.togglePlay = function () {
      if (this.playing) {
         $(this.element).find(".simplePause span span").text(">");
         this.playing = false;
         window.clearTimeout(this.slideLoop);
      } else {
         $(this.element).find(".simplePause span span").text("||");
         this.playing = true;
         var $this = this;
         this.slideLoop = window.setTimeout(function () {
            $this.nextPicture();
         }, this.speed);
      }
   };

   Plugin.prototype.prevPicture = function () {
      var prevPicture = this.currentPicture - 1;
      if (prevPicture < 0) {
         prevPicture = this.slides.length - 1;
      }
      $(this.element).children('img').eq(this.currentPicture).fadeOut(2000);
      $(this.element).children('img').eq(prevPicture).fadeIn(2000);
      $(this.element).children('.simpleTitle span span').text(this.slides[prevPicture].title);
      this.currentPicture = prevPicture;
   };

   Plugin.prototype.nextPicture = function () {
      var nextPicture = this.currentPicture + 1;
      if (nextPicture > this.slides.length - 1) {
         nextPicture = 0;
      }
      $(this.element).children('img').eq(this.currentPicture).fadeOut(2000);
      var $this = this;
      $(this.element).children('img').eq(nextPicture).fadeIn(2000, function () {
         $this.slideLoop = setTimeout(function () {
            $this.nextPicture();
         }, $this.speed);
      });
      $(this.element).children('.simpleTitle span span').text(this.slides[nextPicture].title);
      this.currentPicture = nextPicture;
   };


   Plugin.prototype.buildSlideshow = function () {

      $(this.element).empty();
      $(this.element).addClass("simpleSlide");
      $(this.element).append("<div class=\"simpleTitle\"><span><span>" + this.slides[0].title + "</span></span> </div>");
      for (var i = 0; i < this.slides.length; i++) {
         var image = $('<img />', this.slides[i])
            .hide();
         $(this.element).append(image);
      }
      $(this.element).children("img").first().show();
      $(this.element).append("<div class=\"simpleControlls\"><div  class=\"button simplePrev\" ><span><span><<</span></span></div><div  class=\"button simplePause\" ><span><span>" + ((this.playing) ? "||" : ">") + "</span></span></div><div  class=\"button simpleNext\" ><span><span>>></span></span></div></div>");
   };

   Plugin.prototype.arrayShuffle = function (array) {
      var tmp,
         rand;
      for (var i = 0; i < array.length; i++) {
         rand = Math.floor(Math.random() * array.length);
         tmp = array[i];
         array[i] = array[rand];
         array[rand] = tmp;
      }
      return array;
   };

   $.fn[pluginName] = function (options) {
      return this.each(function () {
         if (!$.data(this, 'plugin_' + pluginName)) {
            $.data(this, 'plugin_' + pluginName,
               new Plugin(this, options));
         }
      });
   };

})(jQuery, window, document);