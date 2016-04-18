/**
	CarrouselModule </br>
	Display content inside the page or in full page view </br>
	Version 1.0 </br>

	@module Carrousel
	@main Carrousel
**/

/**
	Carrousel Class <br/>

	@class Carrousel
	@constructor
**/
 function Carrousel (options) {

    var that = {},
        self = {};
    self.priv ={}
    self.options = {
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

        /**
         Limit flickr
         @property limitFlickr
         @type {Number}
         **/
        limitFlickr : 5
  	};

    for (var i in options) { self.options[i] = options[i]; }
    for (var i in  self.options) { self.priv[i] = self.options[i]; }

    $.extend(self.priv, {
        //utils
        currentIndex : 0,
        flickrArray : [],
        openedSlide:[]
    });

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


   var url = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=indoor&tagmode=all&format=json&amp;format=json&amp;jsoncallback=JSON_CALLBACK';

   $.ajax({
      data:{format: "json"},
      dataType: "jsonp",
      url: url
   });

   jsonFlickrFeed = function (data) {


           console.log("reached jsonFlickerFeed");

           // Start putting together the HTML string
           var htmlString = "";

           // Now start cycling through our array of Flickr photo details
           $.each(data.items, function(i,item){
             if(i < self.priv.limitFlickr ){

                htmlString += __loadFlickr(item);
             }
             else {
                self.priv.flickrArray.push(item);
             }

           });

           // Pop our HTML in the #images DIV
           $('#images').html(htmlString);


    initCarrousel();
  }
}

   /**
     Initializing Carrousel Class
     @private
     @method __init
     @param {String or DOM Object} el
     @param {Array} options
     @return {null}
   **/
    function initCarrousel() {

       var $container = $('.product-media__size');
       $.extend(self.priv, {
           $container : $container,
           $wrapper : $container.find('.product-media__gallery'),
           $wrapperSecond : $container.find('.teaser-content'),
           $nextButton : $container.find('.slider--next'),
           $prevButton : $container.find('.slider--prev'),
           $carrouselSlides : $container.find('.wrapper'),
           $carrouselSlidesImg : $container.find('.teaser__image-block'),
           $slideNav : [],
           //media queries
           mqd : window.matchMedia(self.priv.matchMediaDestop),
           mqt : window.matchMedia(self.priv.matchMediaTablet),
           //classnames
           slideNavCssClass: 'media-navigation__item',
           tipClassName : 'media-navigation__list',
       });

       self.priv.slidesLength = self.priv.$carrouselSlides.length;

       __handleMatchMediaDesktop(self.priv.mqd);
       __handleMatchMediaTablet(self.priv.mqt);

       //Controls
       if(!self.priv['showBasicControls']) {
          self.priv.$wrapper.addClass('hide-control')
       }
       self.priv.$slideNavTipWrap = $('<ul/>')
            .addClass(self.priv.tipClassName)
            .appendTo($container);

       for(var i =0; i < self.priv.slidesLength; i++){
         var li = $('<li/>')
            .addClass(self.priv.slideNavCssClass)
            .appendTo(self.priv.$slideNavTipWrap);
       }
       self.priv.$slideNav = $container.find('.'+self.priv.slideNavCssClass);


       //Init wrappers css
       self.priv.$wrapper.css('width', self.priv.slidesLength * 100 + '%');
       $(self.priv.$carrouselSlides).each(function(){
         $(this).css('left', ($(this).index() * ( 100 / self.priv.slidesLength )) + '%' );
         $(this).css('width', (100 / self.priv.slidesLength ) + '%' );
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
       if(self.priv.currentIndex == self.priv.$container.find('.wrapper').length - (self.priv.limitFlickr - 3 ) ){
       var htmlString = "";
         for (var i = 0;  i < self.priv.limitFlickr; i ++ ){

           // Now start cycling through our array of Flickr photo details
          // for(var i =0 ; self.priv.flickrArray.length; i++ ){
          //    if(i < self.priv.limitFlickr ){
               console.log(self.priv.flickrArray[i]);
                htmlString += __loadFlickr(self.priv.flickrArray[i]);
                self.priv.flickrArray.splice( i, 1 );
          //    }
          //  });


         }
         $('#images').html(htmlString);
           console.log(self.priv.flickrArray);
       }
     });

     self.priv.$slideNav.click(function(){
       self.priv.currentIndex = $(this).index();
       __goTo();

       if(self.priv['callBackSeekedFunction'] != null) {
           self.priv['callBackSeekedFunction'].call(this);
       }
     });
   }

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
        self.priv.$wrapperSecond.css('transform', 'scale(0.93)');
        setTimeout(function(){

          self.priv.$wrapper.css('transform', 'translate3d('+(-self.priv.currentIndex * 100 / self.priv.slidesLength) +'%, 0, 0px)');
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
       if(self.priv.$container.hasClass('full-screen')){
         self.priv.$container.removeClass('full-screen');
       } else {
         self.priv.$container.addClass('full-screen');
       }
    }

    /**
      Load
      @method  __load
      @param {Number} slides
      @return {null}
    **/
     function __load(slides) {
         var i = typeof slides !== 'undefined'? slides : self.priv.currentIndex;

         var img = self.priv.$carrouselSlidesImg.eq(i).data('src');
         if(self.priv.responsiveImages){
           img = img + '-'+ self.priv.imgSize;
         }

         self.priv.$carrouselSlidesImg.eq(i).css('background-image', 'url(' + img + ')');
         self.priv.openedSlide.push(i);


     }

     /**
       Load Flickr
       @method  __loadFlickr
       @param {Number} slides
       @return {null}
     **/
      function __loadFlickr(item) {
        var htmlString = '';
        // I only want the ickle square thumbnails
        var sourceSquare = (item.media.m).replace("_m.jpg", "_s.jpg");

        // Here's where we piece together the HTML
        htmlString += '<a class="wrapper" href="' + item.link + '" target="_blank">';
        htmlString += '<div class="teaser__image-block image--wide" data-src="' + sourceSquare;
        htmlString +=  '">&nbsp;</div></div>';
        htmlString += '</a>';
        return htmlString;

        //  self.priv.flickrArray;
      }

     /**
       getRespImageSuffix
       @method  __getRespImageSuffix
       @return {null}
     **/
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

     /**
       handleMatchMediaDesktop
       @method  __handleMatchMediaDesktop
       @param {Object} mql
       @return {null}
     **/
   function __handleMatchMediaDesktop(mql){
     if(mql.matches)
        self.priv.desktop = true;
    else
        self.priv.desktop = false;

    if(self.priv.responsiveImages){
        getRespImageSuffix();
    }
   }

   /**
     handleMatchMediaTablet
     @method  __handleMatchMediaTablet
     @param {Object} mql
     @return {null}
   **/
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
