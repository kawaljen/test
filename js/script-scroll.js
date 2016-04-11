(function($) {

  $.fn.unveil2 = function(threshold, callback) {

    var $w = $(window),
        th = threshold || 1000,
        images = this,
        visible,
        delay =0;

    this.one("unveil", function() {
        //setTimeout(function(){
          if (typeof callback === "function") {
              callback.call(this);
              delay = delay + 500;
          }
        //}.bind(callback),delay);
    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;
          var wt = $w.scrollTop(),
              wb = wt + $w.height(),
              et = $e.offset().top,
              eb = et + $e.height();

          return et >= wt + th && et <= wb - th;
      });

      visible = inview.trigger("unveil");
      images = images.not(visible);
    }

    $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);

$(document).ready(function() {
  $(".cp-module").unveil2(200, function() {
      $(this).addClass('lazyloaded');
  });

  $('.cp-image').hover(function(){ $(this).closest('.cp-module').toggleClass('hover');})
});
