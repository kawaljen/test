(function($) {
  $.fn.isVisibleCheck = function(threshold, callback) {
    var $w = $(window),
        th = threshold || 1000,
        images = this,
        visible,
        delay =0;

    this.one("unveil", function() {
        if (typeof callback === "function") {
            callback.call(this);
        }
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
  var delay = 0;
  $(".cp-module").isVisibleCheck(200, function() {
    setTimeout(function(){
      $(this).addClass('lazyloaded');
      delay = 0;
    }.bind($(this), delay), delay);
    delay = 500;
  });

  $('.cp-image').hover(function(){ $(this).closest('.cp-module').toggleClass('hover');})
});
