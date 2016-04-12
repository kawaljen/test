/**
	CarrouselModule </br>
	Display content inside the page or in full page view </br>
	Version 1.0 </br>

	@module Carrousel
	@main Carrousel
**/

/* global Main*/

(function(win, doc) {
  var Main = Main || {};
	/**
		Carrousel Class <br/>
    Example Carrousel: <a target="_blank" href=""</a>

		@class Carrousel
		@constructor
	**/
 function Carrousel ( options) {

		this.name_class = "Carrousel";
    this.core_version = "1.0";
    //this.base = main;


    this.options = {

			/**
				List of Carrousel used in the module
				The array of videos could contain these parameters:
				id, name, poster, src, autoplay, controls, width, height, loop, preload, muted, zoom, rotate.

				@property Carrouseloption
				@type {Object}
			**/
			CarrouselOption: [{'id':   1,
						     'name': 'Carrousel',
						     'autoplay': true,
						     'controls': false,
						     'width': 100,
						     'height': 100,
						     'loop': false,
						     'zoom': 0, 	// It is not working on Android Native Browser
                 'tip': 'https://mangayio.assos.com/mediaresize/catalog/product/0/7/07_ss-rallytrek_evo7_lady_piton.jpg?width=1000'
						   }],
			/**
				It is the parent div where the video will be created. <br/>
				String or DOM Object are accepted.

				@property wrapper
				@type {String or DOM Object}
			**/
  		//	wrapper: this.base.expandedRootElement,
      wrapper: $('.product-media'),

			/**
				Name of the Carrousel Container
				@property carrouselContainerId
				@type {String}
			**/
			carrouselContainerId: 'carrousel-container',
			/**
				Name of the Carrousel Element
				@property carrouselElementId
				@type {String}
			**/
			carrouselElementId: 'carrousel-element',
			/**
				Name of the Carrousel Touch Area
				@property carrouselTouchAreaId
				@type {String}
			**/
			carrouselTouchAreaId: 'carrousel-touch-area',
      /**
        Name of the Carrousel Slide
        @property carrouselSlides
        @type {String}
      **/
      carrouselSlides : 'wrapper',
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
			autoPlay: false,
			/**
				Default value to indicate if the carrousel has to preload. The values are: auto, all.
				@property preload
				@type {Boolean}
			**/
			preload: 'auto',
			/**
				Default value to indicate if the carrousel has to repeat.
				@property loop
				@type {Boolean}
			**/
			loop: false,
			/**
				Default width of the videos.
				@property width
				@type {Number}
			**/
			width: 100,
			/**
				Default height of the videos.
				@property height
				@type {Number}
			**/
			height: 100,
			/**
				Call this function when the carrousel is playing
				@property callBackPlayFunction
				@type {Function}
			**/
			callBackPlayFunction: null,

			/**
				Call this function when the carrousel is on pause
				@property callBackPauseFunction
				@type {Function}
			**/
			callBackPauseFunction: null,
			/**
				Call this function after the carrousel has finished
				@property callBackExitFunction
				@type {Function}
			**/
			callBackExitFunction: null,
			/**
				Call back when loadstart event is fired
				@property callBackLoadStartFunction
				@type {Function}
			**/
			callBackLoadStartFunction: null,
			/**
				Call back when error event is fired
				@property callBackErrorFunction
				@type {Function}
			**/
			callBackErrorFunction: null,

			/**
				Call back when emptied event is fired
				@property callBackEmptiedFunction
				@type {Function}
			**/
			callBackEmptiedFunction: null,
			/**
				Call back when loadeddata event is fired
				@property callBackLoadedDataFunction
				@type {Function}
			**/
			callBackLoadedDataFunction: null,
			/**
				Call back when waiting event is fired
				@property callBackWaitingFunction
				@type {Function}
			**/
			callBackWaitingFunction: null,
			/**
				Call back when seeked event is fired
				@property callBackSeekedFunction
				@type {Function}
			**/
			callBackSeekedFunction: null,
			/**
				Call back when the user click on touch area is fired
				@property callBackTouchAreaFunction
				@type {Function}
			**/
			callBackTouchAreaFunction: null,

			/**
				Show Console Messages
				@property showConsoleMessages
				@type {Boolean}
			**/
			showConsoleMessages: false,

      /**
       Toggle pause on carrousel tap
       @property pauseOnTap
       @type {Boolean}
       **/
      pauseOnTap: true,

      /**
       carrousel poster image ID
       @property videoPosterImageId
       @type {String}
       **/
      videoPosterImageId: 'carrousel-image',

      /**
       carrousel current ndex
       @property currentIndex
       @type {Number}
       **/
      currentIndex : 0,

      /**
       carrousel slide already opened
       @property currentIndex
       @type {Array}
       **/
      openedSlide:[],

      /**
       carrousel images max size
       @property imgSize
       @type {Number}
       **/
      imgSize : 0

		};

		for (var i in options) { this.options[i] = options[i]; }

    // this.init();

	// };
  //
  //
  // Carrousel.prototype = function () {

 /**
   Initializing Carrousel Class

   @private
   @method __init
   @param {String or DOM Object} el
   @param {Array} options
   @return {null}
 **/
 this.init = function() {

     this.wrapper = typeof this.options['wrapper'] === 'object' ? this.options['wrapper'] : doc.getElementById(this.options['wrapper']);

     this.currentIndex = 0;
     this.openedSlide = [];

     this.slidesLength = $('.'+this.options['carrouselSlides']).length;

     $('.'+this.options['carrouselSlides']).each(function(){
       $(this).css('left', ($(this).index() * ( 100 / this.slidesLength )) + '%' );
     });
     //
    //  if (this.options['preload'] === 'all') {
    //   // getImage($('.'+this.options['carrouselSlides']).index());
    //  }
    //  else {
      //  __load().call(this);
    //  }
    //loadthat().call(this);
    //this.setStyles();


    //  if(this.options['showBasicControls']) {
    //        this.videoElement.setAttribute('controls', 'true');
    //  }

    //  if(this.options['loop']) {
    //      this.videoElement.setAttribute('loop', 'true');
    //  }

     __addingListeners.call(this);
   };


   /** PUBLIC METHODS **/


   /**
     Exit Carrousel

     @method exit
     @return {null}
   **/
   this.exit = function () {

     if(this.options['callBackExitFunction'] != null) {
       this.base[this.options['callBackExitFunction']].bind(this)();
     }

     this.currentIndex = this.options['currentIndex'];
     this.openedSlide = [];
   };


   /** PRIVATE METHODS **/


   /**
     Adding the listeners

     @private
     @method __addingListeners
     @return {Null}
   **/
   function __addingListeners () {

  //   this.wrapper.click(this.openCarrousel);
      var that = this;

     $('.slider--prev').click(function(){
       this.currentIndex--;
       goTo().call(this);
     });

     $('.slider--next').click(function(){
       this.currentIndex++;
       goTo.call(this);
     });
     $('.media-navigation__item').click(function(){
       this.currentIndex = $(this).index();
       goTo.call(this);
     });
     //load.call(this);
     setStyles.call(that);
   };


   /**
      updatePositionMarker

     @method  __updatePositionMarker
     @param {array} slides
     @param {String} imgSize
     @return {null}
   **/
    function updatePositionMarker () {
      $('.media-navigation__item').removeClass('is__active');
      $('.media-navigation__item').eq(this.currentIndex).addClass('is__active');
    };

    function setStyles () {
      load.call(this);
      resetButtons.call(this);
      updatePositionMarker.call(this);
    };


    /**
      resetButtons

      @method  __resetButtons
      @param {array} slides
      @param {String} imgSize
      @return {null}
    **/
   function resetButtons() {
      $('.slider--next').addClass('show-button');
      $('.slider--prev').addClass('show-button');

      if( this.currentIndex < 1 ){
        $('.slider--prev').removeClass('show-button');
      }
      else if(this.currentIndex >= $('.teaser__image-block').length-1){
        $('.slider--next').removeClass('show-button');
      }
    };

    /**
      Go to

      @private
      @method __goTo
      @return {null}
    **/
    function goTo () {
      load.call(this);
      $('.product-media__gallery').css('transform', 'scale(0.93)');
      setTimeout(function(){
        $('.teaser__image-wide__container').css('transform', 'translate3d('+(-this.currentIndex * 25) +'%, 0, 0px)');
        $('.product-media__gallery').css('transform', 'scale(1)');
        setStyles.call(this);
      }.bind(this), 200);
    };

    /**
     open or close carrousel

     @private
     @method __onAbort
     @return {null}
    **/
    function openCarrousel () {
       if($('.product-media__size').hasClass('full-screen')){
         $('.product-media__size').removeClass('full-screen');
       } else {
         $('.product-media__size').addClass('full-screen');
       }
    };

    /**
      Load

      @method  __load
      @param {array} slides
      @param {String} imgSize
      @return {null}
    **/
     function load() {
       var i = typeof slides !== 'undefined'? slides : this.options.currentIndex;

       var img = $('.teaser__image-block').eq(i).data('src');
       $('.teaser__image-block').eq(i).css('background-image', 'url(' +img+ ')');
       this.openedSlide.push(i);

   };

  //  return {    init:init
  //            };
};


$(document).ready(function() {
  var main = new Carrousel();
  main.init();
});
})(window, document);
