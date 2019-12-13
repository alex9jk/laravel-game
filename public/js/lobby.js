

var csrf = {
    _token: $('meta[name="csrf-token"]').attr('content')
};
var baseurl = "/public/";

//init functions and polling functions
checkChat();
checkLobbyUsers();
chatPoller = setInterval(checkChat, 1000);
userPoller = setInterval(checkLobbyUsers, 5000);
challengeAcceptedPoller = setInterval(checkChallengeAccept, 5000);
var challengePoller = setInterval(checkChallenge, 5000);

$(document).ready(function () {
    //when user logs out removes from available users to play
    $(window).on('beforeunload', function (evt) {
        userInactive();
    });
    $(window).on('unload', function (evt) {
        userInactive();
    });
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

//ajax call to check to see if user is inactive -logged out or changed urls
function userInactive() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "userInactive",
        dataType: "json",
        data: csrf,
        success: function (data) {
        },
        failure: function (err) {
            console.log(err);

        },

    });

}

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
            if (data.success) {
                var messageText = "";
                for (var i = 0; i < data.data.length; i++) {
                    messageText += "<div class='messages'><strong>" + data.data[i].name[0].name + ": </strong>" + data.data[i].messageText + "</div>";
                }
                $('.box').html(messageText);
                document.querySelector(".box").scrollTo(0, document.querySelector(".box").scrollHeight);
            }
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
            if (data.success) {
                var userName = "";
                if (data.data.length > 0) {
                    for (var i = 0; i < data.data.length; i++) {
                        userName += "<div class='availableUsers' data-user='" + data.data[i].id + "'>" + data.data[i].name + "</div>";
                    }
                }
                $('#waiting-users').html(userName);
            }
            else {
                $('#waiting-users').html("");
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
            if (data.success) {
                window.location.href = "playgame/" + data.data[0].id;
            }

        },
        failure: function (err) {
            console.log(err);

        },

    });
}
//polls database to let a user know if they have been challenged by other user
function checkChallenge() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "getChallenges",
        dataType: "json",
        data: csrf,
        success: function (data) {
            if (data.success) {
                clearInterval(challengePoller);
                var r = confirm("Do you want to play " + data.data.challenger + "?");
                if (r == true) {
                    joinGame(data.data.id);
                } else {
                    denyGame(data.data.id);

                    challengePoller = setInterval(checkChallenge, 5000);

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

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "joinGame",
        dataType: "json",
        data: game,
        success: function (data) {
            if (data.success) {
                window.location.href = "playgame/" + id;
            }
        },
        failure: function (err) {
            console.log(err);
        },

    });

}

//ajax call if player declines the challenge to game
function denyGame(id) {
    var game = {
        gameid: id,
        _token: $('meta[name="csrf-token"]').attr('content')
    };
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "denyGame",
        dataType: "json",
        data: game,
        success: function (data) {
            console.log(data);
        },
        failure: function (err) {
            console.log(err);
        },
    });
}
