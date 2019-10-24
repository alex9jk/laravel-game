

var messages = {
    // message: message,
    // user_id:user_id,
    _token: $('meta[name="csrf-token"]').attr('content')
};
var baseurl = "/laravelProject/public/";

//console.log(message);
checkChat();
chatPoller = setInterval(checkChat, 1000);

$(document).ready(function () {
    $(".chatSend").on("submit", function (e) {
        e.preventDefault();
        console.log();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            url: baseurl + "sendChatData",
            dataType: "json",
            data: $(this).serialize(),
            success: function (data) {
                
                $('#messageInput').val('');
                console.log("test");
                checkChat();
            },
            failure: function (err) {
                console.log(err);

            },

        });
        return false;
    });
});
function checkChat() {
    //   if(typeof game != 'undefined'){

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "getLobbyChat",
        dataType: "json",
        data: messages,
        success: function (data) {
            console.log(data);
            console.log(data.data.length);
            var messageText;
            for (var i = 0; i < data.data.length; i++) {
                messageText += "<div>" + data.data[i].messageText + "</div>";
            }
            $('.box').html(messageText);
        },
        failure: function (err) {
            console.log(err);

        },

    });
    //   }

}
