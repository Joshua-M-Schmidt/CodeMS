$(document).ready(function () {

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            function getCookie(name) {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });


    $('.datepicker').datepicker({ "format": "yyyy-m-d" });

    function get_angebot_inputs() {
        return {
            'name': $('#name').val(),
            'firma': $('#firma').val(),
            'email': $('#email').val(),
            'phone': $('#phone').val(),
            'postleitzahl': $('#postleitzahl').val(),
            'schulungen': $('#schulungen').val(),
            'teilnehmer': $('#teilnehmer').val(),
            'komentar': $('#komentar').val(),
            'slug': window.location.href.split('/')[3],
        };
    }

    function check_angebot_inputs() {
       
        if($('#name').val()){
            $('#name').removeClass("invalid")
            $('#name').addClass("valid")
        }else{
            $('#name').removeClass("valid")
            $('#name').addClass("invalid")
        }

        if($('#firma').val()){
            $('#firma').removeClass("invalid")
            $('#firma').addClass("valid")
        }else{
            $('#firma').removeClass("valid")
            $('#firma').addClass("invalid")
        }

        if($('#email').hasClass( "valid" )){
            $('#email').removeClass("invalid")
            $('#email').addClass("valid")
        }else{
            $('#email').removeClass("valid")
            $('#email').addClass("invalid")
        }

        if($('#postleitzahl').val()){
            $('#postleitzahl').removeClass("invalid")
            $('#postleitzahl').addClass("valid")
        }else{
            $('#postleitzahl').removeClass("valid")
            $('#postleitzahl').addClass("invalid")
        }

        if($('#phone').val()){
            $('#phone').removeClass("invalid")
            $('#phone').addClass("valid")
        }else{
            $('#phone').removeClass("valid")
            $('#phone').addClass("invalid")
        }

        if($('#schulungen').val().length){
            console.log("val"+$('#schulungen').val().length);
            $('.select-wrapper input.dropdown-trigger').removeClass("invalid")
            $('.select-wrapper input.dropdown-trigger').addClass("valid")
        }else{
            console.log("noval"+$('#schulungen').val().lenght);
            $('.select-wrapper input.dropdown-trigger').removeClass("valid")
            $('.select-wrapper input.dropdown-trigger').addClass("invalid")
        }

        if($('#teilnehmer').val()){
            $('#teilnehmer').removeClass("invalid")
            $('#teilnehmer').addClass("valid")
        }else{
            $('#teilnehmer').removeClass("valid")
            $('#teilnehmer').addClass("invalid")
        }

        if($('#name').val() &&
        $('#firma').val() &&
        $('#email').hasClass("valid") &&
        $('#postleitzahl').val() && 
        $('#schulungen').val().length && 
        $('#phone').val() && 
        $('#teilnehmer').val()){
            return true;
        }
    }

    $('#request').click(function () {
        if (check_angebot_inputs()) {
            console.log(get_angebot_inputs());
            user_data = get_angebot_inputs();
            $.ajax({
                type: "POST",
                url: "/request",
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(user_data),
                success: function (result) {
                    window.location.href = '/danke';
              
                }
            });
        }
    });
});