
$(document).ready(function() {
  $('.sticky').Stickyfill({
      callbackStick : function(el){
       $('.sticky').eq(el.index).addClass('sticked');
     },
     callbackDeStick : function(el){
       $('.sticky').eq(el.index).removeClass('sticked');
       console.log('got desticked tested');
     },
  });
});
