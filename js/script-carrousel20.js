/**
	CarrouselModule </br>
	Display content inside the page or in full page view </br>
	Version 1.0 </br>

	@module Carrousel
	@main Carrousel
**/

/* global Main*/

(function(win, doc) {
/**
	Carrousel Class <br/>
  Example Carrousel: <a target="_blank" href=""</a>

	@class Carrousel
	@constructor
**/
 function Carrousel (options) {

    var that = {},
        self = {};
    self.options = {
  			/**
  				It is the parent div where the video will be created. <br/>
  				String or DOM Object are accepted.

  				@property wrapper
  				@type {String or DOM Object}
  			**/
        wrapper: 'product-media__gallery',

        /**
          Name of the Carrousel Slide
          @property carrouselSlides
          @type {String}
        **/
        carrouselSlides : 'wrapper',

        /**
          Name of the Carrousel Slide img
          @property carrouselSlidesImg
          @type {String}
        **/
        carrouselSlidesImg : 'teaser__image-block',
        /**
         next button css class
         @property nextButtonCssClass
         @type {String}
         **/
        nextButtonCssClass: 'slider--next',

        /**
         prev button css class
         @property prevButtonCssClass
         @type {String}
         **/
        prevButtonCssClass: 'slider--prev',

        /**
         slide Nav css class
         @property slideNavCssClass
         @type {String}
         **/
        slideNavCssClass : 'media-navigation__item',

        /**
         slide Nav css class
         @property slideNavCssClass
         @type {String}
         **/
        slideNavTipWrap : 'media-navigation__list',

      	/**
  				Default value to show basic control in the carrousel
  				@property showBasicControls
  				@type {Boolean}
  			**/
  			showBasicControls: true,
  			/**
  				Default value to indicate if the carrousel is autoplay
  				@property autoPlay
  				@type {Boolean}
  			**/
  			//autoPlay: false,
  			/**
  				Default value to indicate if the carrousel has to preload. The values are: auto, all.
  				@property preload
  				@type {Boolean}
  			**/
  			preload: 'auto',
        /**
  				Call this function when the carrousel is initiated
  				@property callBackInitFunction
  				@type {Function}
  			**/
  			callBackInitFunction: null,
  			/**
  				Call this function when the carrousel is playing
  				@property callBackPlayFunction
  				@type {Function}
  			**/
  			callBackSlideFunction: null,
  			/**
  				Call back when seeked event is fired
  				@property callBackSeekedFunction
  				@type {Function}
  			**/
  			callBackSeekedFunction: null,
        /**
         carrousel images max size
         @property imgSize
         @type {String}
         **/
        imgSize : '',
        /**
         Get optimised Images
         @property responsiveImages
         @type {Boolean}
         **/
        responsiveImages : false,

        /**
         Match media destop
         @property matchMediaDestop
         @type {string}
         **/
        matchMediaDestop : '(min-width: 1200px)',

        /**
         Match media tablet
         @property matchMediaTablet
         @type {string}
         **/
        matchMediaTablet : '(min-width: 768px)',

  	};
    self.priv= {};
    for (var i in options) { self.options[i] = options[i]; }
    for (var i in  self.options) { self.priv[i] = self.options[i]; }


  /** PUBLIC METHODS **/

 /**
   Initializing Carrousel Class

   @private
   @method __init
   @param {String or DOM Object} el
   @param {Array} options
   @return {null}
 **/
 that.init = function() {
     self.priv ={
         $carrouselSlides : $('.'+self.priv['carrouselSlides']),
         currentIndex : 0,
         openedSlide:[],
         $nextButton : $('.'+self.priv['nextButtonCssClass']),
         $prevButton : $('.'+self.priv['prevButtonCssClass']),
         $carrouselSlidesImg : $('.'+self.priv['carrouselSlidesImg']),
         $wrapper : $('.'+ self.priv['wrapper']),
         $wrapperSecond : $('.teaser-content'),
         $slideNavTipWrap : $('.'+self.priv.slideNavTipWrap),
         mqd : window.matchMedia(self.priv.matchMediaDestop),
         mqt : window.matchMedia(self.priv.matchMediaTablet)
     };

     self.priv.currentIndex = 0;
     self.priv.openedSlide = [];
     self.priv.$slideNav = [];
     self.priv.slidesLength = self.priv.$carrouselSlides.length;

     __handleMatchMediaDesktop(self.priv.mqd);
     __handleMatchMediaTablet(self.priv.mqt);

     //Controls
     if(!self.priv['showBasicControls']) {
        self.priv.$wrapper.addClass('hide-control')
     }

     for(var i =0; i < self.priv.slidesLength; i++){
       var li = $('<li/>')
          .addClass(self.options.slideNavCssClass)
          .appendTo(self.priv.$slideNavTipWrap);
     }
     self.priv.$slideNav = $('.'+self.options.slideNavCssClass);


     //Init wrappers css
     self.priv.$wrapper.css('width', self.priv.slidesLength * 100 + '%');
     $(self.priv.$carrouselSlides).each(function(){
       $(this).css('left', ($(this).index() * ( 100 / self.priv.slidesLength )) + '%' );
     });

      //Controle loading of images
     if (self.priv['preload'] === 'all') {
       for( var i =0; i < self.priv.slidesLength ; i++){  __setStyles(self.priv.$carrouselSlides.eq(i).index());}
     }
     else {
       __setStyles();
       __load(self.priv.currentIndex + 1);
     }

    //  if(this.options['autoPlay']) {
    //
    //  }

    if(self.priv['callBackInitFunction'] != null) {
        self.priv['callBackInitFunction'].call(this);
    }
     __addingListeners();

   };

   /**
     Exit Carrousel

     @method exit
     @return {null}
   **/
   that.exit = function () {
     self.priv.currentIndex = self.priv['currentIndex'];
     self.priv.openedSlide = [];
   };


   /** PRIVATE METHODS **/

   /**
     Adding the listeners

     @private
     @method __addingListeners
     @return {Null}
   **/
   function __addingListeners () {

     self.priv.$wrapper.click(__openCarrousel);

     self.priv.$prevButton.click(function(){
       self.priv.currentIndex--;
       __goTo();
     });

     self.priv.$nextButton.click(function(){
       self.priv.currentIndex++;
       __goTo();
     });
     self.priv.$slideNav.click(function(){
       self.priv.currentIndex = $(this).index();
       __goTo();

       if(self.priv['callBackSeekedFunction'] != null) {
           self.priv['callBackSeekedFunction'].call(this);
       }
     });
   };


   /**
      updatePositionMarker

     @method  __updatePositionMarker
     @param {array} slides
     @param {String} imgSize
     @return {null}
   **/
    function __updatePositionMarker () {
      self.priv.$slideNav.removeClass('is__active');
      self.priv.$slideNav.eq(self.priv.currentIndex).addClass('is__active');
    };

    function __setStyles () {
      __load();
      __resetButtons();
      __updatePositionMarker();
    };


    /**
      resetButtons

      @method  __resetButtons
      @param {array} slides
      @param {String} imgSize
      @return {null}
    **/
   function __resetButtons() {
      self.priv.$nextButton.addClass('show-button');
      self.priv.$prevButton.addClass('show-button');

      if( self.priv.currentIndex < 1 ){
        self.priv.$prevButton.removeClass('show-button');
      }
      else if(self.priv.currentIndex >= self.priv.$carrouselSlides.length-1){
        self.priv.$nextButton.removeClass('show-button');
      }
    }

    /**
      Go to

      @private
      @method __goTo
      @return {null}
    **/
    function __goTo () {
        __load(self.priv.currentIndex + 1);
        self.priv.$slideNav.css('transform', 'scale(0.93)');
        setTimeout(function(){

          self.priv.$wrapper.css('transform', 'translate3d('+(-self.priv.currentIndex * 25) +'%, 0, 0px)');
          self.priv.$wrapperSecond.css('transform', 'scale(1)');
          __setStyles();

          if(self.priv['callBackSlideFunction'] != null) {
              self.priv['callBackSlideFunction'].call(this);
          }
        }.bind(this), 200);
    }

    /**
     open or close carrousel

     @private
     @method __onAbort
     @return {null}
    **/
    function __openCarrousel () {
       if(self.priv.$slideNav.hasClass('full-screen')){
         self.priv.$slideNav.removeClass('full-screen');
       } else {
         self.priv.$slideNav.addClass('full-screen');
       }
    }

    /**
      Load
      @method  __load
      @param {array} slides
      @param {String} imgSize
      @return {null}
    **/
     function __load(slides) {
         var i = typeof slides !== 'undefined'? slides : self.priv.currentIndex;

         var img = self.priv.$carrouselSlidesImg.eq(i).data('src');
         if(self.priv.responsiveImages){
           img = img + '-'+ self.priv.imgSize;
         }

         self.priv.$carrouselSlidesImg.eq(i).css('background-image', 'url(' +img+ ')');
         self.priv.openedSlide.push(i);
     }

     function __getRespImageSuffix(){
        if(self.priv.desktop)
          self.priv.imgSize = "full";
        else if(self.priv.tablet)
          self.priv.imgSize = "medium";
        else{
          if(window.devicePixelRatio > 1)
            self.priv.imgSize = "medium";
          else
            self.priv.imgSize = "small";
        }
     }

   function __handleMatchMediaDesktop(mql){
     if(mql.matches)
        self.priv.desktop = true;
    else
        self.priv.desktop = false;

    if(self.priv.responsiveImages){
        getRespImageSuffix();
    }
   }

   function __handleMatchMediaTablet(mql){
     if(mql.matches)
            self.priv.tablet = true;
     else
            self.priv.tablet = false;

      if(self.priv.responsiveImages){
          __getRespImageSuffix();
      }
   }

   return that;
};


$(document).ready(function() {
  main =  new Carrousel({ callBackInitFunction : function(){console.log('tested');}});
  main.init();
});
})(window, document);
