

var messages = {
    // message: message,
    // user_id:user_id,
    gameid: gameid,
    _token: $('meta[name="csrf-token"]').attr('content')
};
var baseurl = "/laravelProject/public/";

//console.log(message);
checkGameChat();
chatGamePoller = setInterval(checkGameChat, 1000);

$(document).ready(function () {
    $(".chatSend").on("submit", function (e) {
        e.preventDefault();
        console.log();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            url: baseurl + "sendGameData",
            dataType: "json",
            data: $(this).serialize(),
            success: function (data) {

                $('#messageInput').val('');
                console.log("test");
                checkGameChat();
            },
            failure: function (err) {
                console.log(err);

            },

        });
        return false;
    });



});
function checkGameChat() {
    //   if(typeof game != 'undefined'){

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "getGameChat",
        dataType: "json",
        data: messages,
        success: function (data) {
            console.log(data);
            if(data.success){
                if (data.data.length > 0) {
                    var messageText="";
                    for (var i = 0; i < data.data.length; i++) {
                        messageText += "<div><strong>" + data.data[i].name[i].name + ": </strong> " + data.data[i].messageText + "</div>";
                    }
                    $('.box').html(messageText);
                    $('#messageBox').val("");
                }

            }


            document.querySelector(".box").scrollTo(0, document.querySelector(".box").scrollHeight);
        },
        failure: function (err) {
            console.log(err);

        },

    });
    //   }

}


var game = {
    id: gameid,
    _token: $('meta[name="csrf-token"]').attr('content')
};
var baseurl = "/laravelProject/public/";
//gamePoller = setInterval(checkGame, 1000);
console.log(game);
checkGame();

function checkGame() {
    //   if(typeof game != 'undefined'){
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "checkStatus",
        data: game,
        dataType: "json",
        success: function (data) {
            console.log(data);
        },
        failure: function () {

        },
    });
    //   }
}