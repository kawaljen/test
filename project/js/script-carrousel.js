  $(document).ready(function() {
    var currentIndex = 0, openedSlide=[];

    getImage(currentIndex);
    setStyles(currentIndex);

    $('.wrapper').each(function(){
      $(this).css('left', ($(this).index() * 25) + '%' );
    });

    $('.image--wide').click(function(){
      if($('.product-media__size').hasClass('full-screen')){
        $('.product-media__size').removeClass('full-screen');
      } else {
        $('.product-media__size').addClass('full-screen');
      }
    });

    $('.slider--prev').click(function(){
      currentIndex--;
      goTo();
    });

    $('.slider--next').click(function(){
      currentIndex++;
      goTo();
    });
    $('.media-navigation__item').click(function(){
      currentIndex = $(this).index();
      goTo();
    });
    function goTo(){
      getImage(currentIndex);
      $('.product-media__gallery').css('transform', 'scale(0.93)');
      setTimeout(function(){
        $('.teaser__image-wide__container').css('transform', 'translate3d('+(-currentIndex * 25) +'%, 0, 0px)');
        $('.product-media__gallery').css('transform', 'scale(1)');
        setStyles(currentIndex);
      }, 200);
    }
    
    function getImage(i){
      if(openedSlide.indexOf(i) < 0){
        var img = $('.teaser__image-block').eq(i).data('src');
        $('.teaser__image-block').eq(i).css('background-image', 'url(' +img+ ')');
      }
      openedSlide.push(currentIndex);
    }

    function resetButtons(currentIndex){
      if( currentIndex < 1 ){
        $('.slider--prev').removeClass('show-button');
      }
      else if(currentIndex >= $('.teaser__image-block').length-1){
        $('.slider--next').removeClass('show-button');
      }
      else{
        $('.slider--next').addClass('show-button');
        $('.slider--prev').addClass('show-button');
      }
    }

    function updatePositionMarker(currentIndex){
      $('.media-navigation__item').removeClass('is__active');
      $('.media-navigation__item').eq(currentIndex).addClass('is__active');
    }

    function setStyles(currentIndex){
      getImage(currentIndex + 1);
      resetButtons(currentIndex);
      updatePositionMarker(currentIndex);
    }
  });
