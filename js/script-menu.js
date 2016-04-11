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
  var seq = [];
  seq.push({ e: $container, p: { translateX: [0, "-100%"], zIndex:100}, o: { duration: 300}});
  if(typeof $widgets !== 'undefined' && $widgets !== 'null'){
    $widgets.each(function(){
      seq.push({ e: $(this), p: { marginLeft: [0, "-10px"], opacity: [1, 0] }, o: { duration: 300 } });
    });
  }
  if(typeof onOpen !== 'undefined' && onOpen !== 'null'){
    seq.push({ e: $("#close"), p: { translateY: [0, "-100%"], rotateZ: ["180deg", 0] }, o: { duration: 300}});
  }
  $.Velocity.RunSequence(seq);
}

function runSequenceOut( $container, $widgets ){
  var seq = [];
  if(typeof $widgets !== 'undefined' && $widgets !== 'null'){
    $widgets.each(function(){
      seq.push({ e: $(this), p: { marginLeft: [ "-10px", 0], opacity: [ 0, 1] }, o: { duration: 100 } });
    });
  }
  seq.push({ e: $container, p: { translateX: ['-100%',0], zIndex:0 }, o: { duration: 300 }});
  $.Velocity.RunSequence(seq);
}

function runSequenceCloseAll(){
  var seq = [];
  var $panels= $('.panel');
  $panels.each(function(){
    runSequenceOut( $(this), $(this).children('.widget') )
  });
  seq.push({ e: $("#close"), p: { translateY: ["-100%", 0], rotateZ: [ 0, "180deg"] }, o: { duration: 300}});
  $.Velocity.RunSequence(seq);
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
