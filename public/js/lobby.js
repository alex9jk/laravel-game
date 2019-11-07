

var csrf = {
    _token: $('meta[name="csrf-token"]').attr('content')
};
var baseurl = "/laravelProject/public/";

//init functions and polling functions
checkChat();
checkLobbyUsers();
chatPoller = setInterval(checkChat, 1000);
userPoller = setInterval(checkLobbyUsers, 500);
challengeAcceptedPoller = setInterval(checkChallengeAccept, 5000);
challengePoller = setInterval(checkChallenge, 5000);

$(document).ready(function () {
    //ajax call on form to prevent it from submitting and sending chat messages to database
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
                checkChat();
            },
            failure: function (err) {
                console.log(err);

            },

        });
        return false;
    });
    //onclick on available users to challenge a game
    $(document).on("click", ".availableUsers", function () {
        var challengeUser = {
            challenge: $(this).attr("data-user"),
            _token: $('meta[name="csrf-token"]').attr('content')
        };

        var r = confirm("Do you want to start a game?");
        if (r == true) {
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

//polls database to see if there are new chat messages
function checkChat() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "getLobbyChat",
        dataType: "json",
        data: csrf,
        success: function (data) {

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
}

//polls database for users that are logged in and appends to dom
function checkLobbyUsers() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "lobbyUsers",
        dataType: "json",
        data: csrf,
        success: function (data) {
            //console.log(data);
            if (data.success) {
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
}

//if game is accepted then user will be redirected to game page
function checkChallengeAccept() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "checkChallengeAccepted",
        dataType: "json",
        data: csrf,
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
}
//polls database to let a user know if they have been challenged by other user
function checkChallenge() {

    console.log('checkChallenge');
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "getChallenges",
        dataType: "json",
        data: csrf,
        success: function (data) {

            if (data.success) {
                var r = confirm("Do you want to play " + data.data.challenger + "?");
                if (r == true) {
                    joinGame(data.data.id);
                } else {

                }
            }
        },
        failure: function (err) {
            console.log(err);

        },

    });
}
//accept a challenge from different user and redirects to game page
function joinGame(id) {
    var game = {
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
