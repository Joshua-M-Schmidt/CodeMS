(function($){
  $(function(){

    $('#slider1').slider({
      full_width: false,
      indicators: false,
      interval:5000,
      transition:800,
      height:400
    });

    $('#slider2').slider({
      full_width: false,
      indicators: false,
      interval:5000,
      transition:800,
      height:250
    });

    $('.modal').modal();

    $('.collapsible').collapsible();

    $('.sidenav').sidenav();

  
    /*if ($("#google-reviews").length == 0) {
      return
    }
    // Find a placeID via https://developers.google.com/places/place-id
    $("#google-reviews").googlePlaces({
      placeId: 'ChIJj2A0XmP5m0cRhoqJnVyPkXQ',
      // the following params are optional (default values)
      header: "", // html/text over Reviews
      footer: '', // html/text under Reviews block
      maxRows: 5, // max 5 rows of reviews to be displayed
      minRating: 4, // minimum rating of reviews to be displayed
      months: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
      textBreakLength: "90", // length before a review box is set to max width
      shortenNames: true, // example: "Max Mustermann" -> "Max M."",
      moreReviewsButtonUrl: '', // url to Google Place reviews popup
      moreReviewsButtonLabel: 'Show More Reviews',
      writeReviewButtonUrl: '', // url to Google Place write review popup
      writeReviewButtonLabel: 'Write New Review'
    });*/

  }); // end of document ready
})(jQuery); // end of jQuery name space
