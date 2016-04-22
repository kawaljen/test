function FlickFeed(options){

  var self= {};
      priv = {
        api_url : 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&format=json&jsoncallback=?',
        request :{
          user_id: (typeof options.user_id == 'undefined' || options.user_id == 'null' )? '64071849%40N07' : options.user_id,
          photoset_id: (typeof options.photoset_id == 'undefined' || options.photoset_id == 'null' )? '72157664940912432' : options.photoset_id,
          api_key: (typeof options.api_key == 'undefined' || options.api_key == 'null' )? '8015ba17dd4790c26b4f37eb5c9a71e8' : options.api_key,
        },
        page: 0,
        limit : (typeof options.limit == 'undefined' || options.limit == 'null' )? 20 : options.limit,
        options : options
      };



  self.initJson = function(){

        priv.reponse = options.data;

        if ( priv.reponse.stat === 'ok') {
          var position = 0;
          var reqLength = options.limit;
          var htmlString = "";

          for (var i = 0; i < priv.limit + 1; i ++){
            htmlString += __loadFlickr(priv.reponse.photoset.photo[i]);
          }

          priv.options.that.html(htmlString);

          if(typeof priv.options.callback == 'function' && priv.options.callback != null ) {
              priv.options.callback.call(this);
          }
        }
    }
    self.init = function(){

          var request = priv.api_url;
          $.each(priv.request, function(key, value) {
              request += "&" + key + "=" + value;
          });

          $.ajax({
             data:{format: "json"},
             dataType: "jsonp",
             url: request,
             jsonp: "CALLBACK",
             success: function( data ) {
                  var htmlString = "";
                  priv.reponse = data;

                  $.each(data.photoset.photo, function(i,item){
                    if(i < priv.limit + 1 ) {
                       htmlString += __loadFlickr(item);
                     }
                  });

                  priv.owl.html(htmlString);

                  if(typeof priv.options.callback == 'function' && priv.options.callback != null ) {
                      priv.options.callback.call(this);
                  }
              }
          });
      }

    function __loadFlickr(item) {
      var htmlString = '';
      var sourceSquare = 'https://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'.jpg';
      var link = 'https://www.flickr.com/photos/'+priv.request.user_id+'/'+item.id;

      htmlString += '<a class="wrapper" href="' + link + '" target="_blank">';
      htmlString += '<img class="owl-lazy" data-src="' + sourceSquare +'"/>';
      htmlString += '<p class="carr-title">' + item.title +'</p>';
      htmlString += '</a>';
      return htmlString;

    }

    self.getNextFlickr = function () {
      if ( priv.reponse.stat === 'ok') {

         priv.page++;
         var position = priv.page * priv.limit + 1 ;
         var reqLength = ( position + priv.limit < priv.reponse.photoset.photo.length  ) ? position + priv.limit : priv.reponse.photoset.photo.length;

         for (var i = position; i < reqLength; i ++){
           position ++;
           content =  '<div class="owl-item">'+__loadFlickr(priv.reponse.photoset.photo[i]) + '</div>';
           priv.owl.trigger('add.owl.carousel', [$(content),position ]);
         }
         priv.owl.trigger('refresh.owl.carousel');

       }
    }

    return self;
}

// $( document ).ready(function() {
//   console.log(dataFlickr);
//     var owl = $("#{{instance.gallery_id}}");
//     var f = 1;
//     var flickrFeed= new FlickFeed({
//           that : owl,
//           limit : 10,
//           data : dataFlickr,
//           elt_id : '{{instance.gallery_id}}',
//           callback :function(){ owl.owlCarousel(
//                         {  items:1, lazyLoad : true , nav:true});},
//       });
//     flickrFeed.initJson();
//     owl.on('changed.owl.carousel', function(event) {
//         if(event.item.index === event.item.count - (5 * f) ){
//             var flickrNext = flickrFeed.getNextFlickr();
//             f++;
//         }
//     });
// });
