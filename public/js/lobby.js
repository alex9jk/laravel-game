

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
challengeAcceptedPoller = setInterval(checkChallengeAccept, 5000);
challengePoller = setInterval(checkChallenge, 5000);

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

        var txt;
        var r = confirm("Do you want to start a game?");
        if (r == true) {
            txt = "You pressed OK!";
            $.ajax({
                type: "POST",
                async: true,
                cache: false,
                url: baseurl + "challengeUser",
                dataType: "json",
                data: challengeUser,
                success: function (data) {
                  //  console.log(data);


                },
                failure: function (err) {
                    console.log(err);

                },

            });
        } else {
            return false;
        }
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
            var messageText = "";
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
        if(data.success){
            var userName = "";
            if (data.data.length > 0) {
                for (var i = 0; i < data.data.length; i++) {
                    userName += "<div class='availableUsers' data-user='" + data.data[i].id + "'>" + data.data[i].name + "</div>";
                }
            }

            $('#waiting-users').html(userName);

        }


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
            console.log(data);
            if (data.success) {
                 window.location.href = "playgame";
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
    console.log('checkChallenge');
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "getChallenges",
        dataType: "json",
        data: messages,
        success: function (data) {
          //  console.log(data);
            if (data.success) {
                // window.location.href = "playgame";
               
                var r = confirm("Do you want to play a game?");
                if (r == true) {
                    joinGame(data.data.id);
                } else {
                  
                }
        
                
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
function joinGame(id) {
    var game = {
        // message: message,
        // user_id:user_id,
        gameid: id,
        _token: $('meta[name="csrf-token"]').attr('content')
    };

    console.log('joinGame');
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "joinGame",
        dataType: "json",
        data: game,
        success: function (data) {
            console.log(data);
            if (data.success) {
                window.location.href = "playgame";
     
            }
        },
        failure: function (err) {
            console.log(err);

        },

    });
    //   }

}
