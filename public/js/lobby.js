

var messages = {
    // message: message,
    // user_id:user_id,
    _token: $('meta[name="csrf-token"]').attr('content')
};
var baseurl = "/laravelProject/public/";

//console.log(message);
checkChat();
checkLobbyUsers();
chatPoller = setInterval(checkChat, 1000);
userPoller = setInterval(checkLobbyUsers, 500);
// challengePoller = setInterval(checkChallengeAccept, 5000);
challengePoller = setInterval(checkChallenge,1000);

$(document).ready(function () {
    $(".chatSend").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            url: baseurl + "sendChatData",
            dataType: "json",
            data: $(this).serialize(),
            success: function (data) {

                $('#messageInput').val('');
                //  console.log("test");
                checkChat();
            },
            failure: function (err) {
                console.log(err);

            },

        });
        return false;
    });
    $(document).on("click", ".availableUsers", function () {

 
        var challengeUser = {
            // message: message,
            // user_id:user_id,
            challenge: $(this).attr("data-user"),
            _token: $('meta[name="csrf-token"]').attr('content')
        };
        
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            url: baseurl + "challengeUser",
            dataType: "json",
            data: challengeUser,
            success: function (data) {
                console.log(data);


            },
            failure: function (err) {
                console.log(err);

            },

        });

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
            // console.log(data);
            // console.log(data.data.length);
            var messageText;
            for (var i = 0; i < data.data.length; i++) {
                messageText += "<div>" + data.data[i].name[0].name + ": " + data.data[i].messageText + "</div>";
            }
            $('.box').html(messageText);
            document.querySelector(".box").scrollTo(0, document.querySelector(".box").scrollHeight);
        },
        failure: function (err) {
            console.log(err);

        },

    });
    //   }

}
function checkLobbyUsers() {
    //   if(typeof game != 'undefined'){

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "lobbyUsers",
        dataType: "json",
        data: messages,
        success: function (data) {
            //console.log(data);

            var userName = "";
            if (data.data.length > 0) {
                for (var i = 0; i < data.data.length; i++) {
                    userName += "<div class='availableUsers' data-user='" + data.data[i].id + "'>" + data.data[i].name + "</div>";
                }
            }

            $('#waiting-users').html(userName);

        },
        failure: function (err) {
            console.log(err);

        },

    });
    //   }

}

function checkChallengeAccept() {
    //   if(typeof game != 'undefined'){

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "checkChallengeAccepted",
        dataType: "json",
        data: messages,
        success: function (data) {
            if (data.success) {
                // window.location.href = "playgame";
            }
            // var userName = "";
            // for (var i = 0; i < data.data.length; i++) {
            //     userName += "<div data-user='"+ data.data[i].id+"'>" + data.data[i].name+ "</div>";
            // }
            // $('#waiting-users').html(userName);

        },
        failure: function (err) {
            console.log(err);

        },

    });
    //   }

}
function checkChallenge() {
    //   if(typeof game != 'undefined'){

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "getChallenges",
        dataType: "json",
        data: messages,
        success: function (data) {
            if (data.success) {
                // window.location.href = "playgame";
                console.log(data);
            }
            // var userName = "";
            // for (var i = 0; i < data.data.length; i++) {
            //     userName += "<div data-user='"+ data.data[i].id+"'>" + data.data[i].name+ "</div>";
            // }
            // $('#waiting-users').html(userName);

        },
        failure: function (err) {
            console.log(err);

        },

    });
    //   }

}
