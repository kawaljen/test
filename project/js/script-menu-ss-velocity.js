/**
  add method to jquery to allow to reverse the each loop

  @public
  @method jQuery.fn.reverse
  @return {null}
**/
jQuery.fn.reverse = [].reverse;


/**
  Run the sequence to open the menu

  @public
  @param container -> menu container
         widgets  -> item in menu panel
  @return {null}
**/
function runSequenceIn( $container, $widgets, onOpen ){
  $container.animate({
    left: "0",
    zIndex: "100"
  }, 300, function(){
    if(typeof $widgets !== 'undefined' && $widgets !== 'null'){
      animateWidget($widgets.eq(0), $widgets, onOpen);
    }
    else{
      animatecloseButton(onOpen);
    }
  });
}

function animatecloseButton(onOpen){
  if(typeof onOpen !== 'undefined' && onOpen !== 'null'){
    $("#close").addClass('opened');
  }
}

function animateWidget(that, $widgets, onOpen ){
  that.addClass('opened');
  that.animate({
      marginLeft : "0"
    }, 300, function(){
      if(that.index()  < $widgets.length){
        animateWidget(that.next(), $widgets, onOpen);
      }
      else{
        animatecloseButton(onOpen);
      }
    });
}

function runSequenceOut( $container, $widgets , onOpen){
  if(typeof $widgets !== 'undefined' && $widgets !== 'null'){
    animateOutWidget($widgets.eq($widgets.length -1), $widgets, onOpen, $container);
  }
}

function animateOutWidget(that, $widgets, onOpen, $container){
  that.removeClass('opened');
  if(typeof that !== 'undefined' && that.length > 0){
    that.animate({
        marginLeft : "-10px"
      }, 300, function(){
        if(that.index()  > 1 ){
        animateOutWidget(that.prev(), $widgets, onOpen, $container);
        }
        else{
          animatecloseButton(onOpen);
          $container.animate({
            left: "-100%",
            zIndex: "0"
          }, 300);
        }
      });
    } else{
      animatecloseButton(onOpen);
      $container.animate({
        left: "-100%",
        zIndex: "0"
      }, 300);
    }
}

function runSequenceCloseAll($container, $widget){
  animatecloseButton();
  $container.animate({
    left: "-100%",
    zIndex: "0"
  }, 300, function(){
    $('.panel').css({"left" : "-100%", "z-index": 0});
    $(".widget").removeClass('opened').css("margin-left", "-10px");
  });
}

// run the sequence on click
$("#open").on('click', function(event) {
  event.preventDefault();
  event.stopPropagation();
  runSequenceIn( $("#mobile-menu"), $("#mobile-menu").children(".widget"), true);
});
$("#close").on('click', function(event) {
  event.preventDefault();
  event.stopPropagation();
  runSequenceCloseAll( $("#mobile-menu"), $("#mobile-menu").children(".widget"));
});


// run the sequence on click
$(".open-submenu").on('click', function(event) {
  event.preventDefault();
  event.stopPropagation();
  var $container = $(this).find('.submenu').first();
  runSequenceIn( $container , $container.children(".widget") );
});
$(".go-back").on('click', function(event) {
  event.preventDefault();
  event.stopPropagation();
  var $container = $(this).closest('.submenu');
  runSequenceOut( $container , $container.children(".widget") );
});
