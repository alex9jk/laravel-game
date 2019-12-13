
//polling functions and game data
var messages = {
    gameid: gameid,
    _token: $('meta[name="csrf-token"]').attr('content')
};
var game = {
    id: gameid,
    _token: $('meta[name="csrf-token"]').attr('content')
};
var baseurl = "/laravelProject/public/";
var svgns = "http://www.w3.org/2000/svg";

var pieceCounter = 0;
checkGameChat();
chatGamePoller = setInterval(checkGameChat, 1000);
gameStatePoller = setInterval(getGameState, 2000);
checkTurnPoller = setInterval(checkTurn, 5000);

//creates playable piece when players turn
function createPiece(playerID) {

    if (document.getElementsByClassName('unplayedPiece').length < 1) {
        var piece = document.createElementNS(svgns, "circle");
        piece.setAttributeNS(null, "r", "26");
        piece.setAttributeNS(null, "cx", "40");
        piece.setAttributeNS(null, "cy", "40");
        if (playerID == 1) {
            piece.setAttributeNS(null, "fill", "red");
        }
        else {
            piece.setAttributeNS(null, "fill", "black");
        }
        piece.setAttributeNS(null, "class", "unplayedPiece");
        piece.setAttributeNS(null, "id", "piece_" + pieceCounter);
        pieceCounter++;
        piece.setAttributeNS(null, "onmousedown", "setDrag(this.id)");
        document.getElementsByTagName('svg')[0].appendChild(piece);
    }
}


//creates opponent piece
function createOpponentPiece(cx, cy, playerID) {

    var piece = document.createElementNS(svgns, "circle");
    if (playerID == 1) {
        piece.setAttributeNS(null, "fill", "red");
    }
    else {
        piece.setAttributeNS(null, "fill", "black");
    }
    piece.setAttributeNS(null, "r", "26");
    piece.setAttributeNS(null, "cx", cx);
    piece.setAttributeNS(null, "cy", cy);
    piece.setAttributeNS(null, "class", "playedPiece");
    document.getElementsByTagName('svg')[0].appendChild(piece);
}
//creates played piece
function createPlayedPiece(cx, cy, playerID) {
    var piece = document.createElementNS(svgns, "circle");
    piece.setAttributeNS(null, "r", "26");
    if (playerID == 1) {
        piece.setAttributeNS(null, "fill", "red");
    }
    else {
        piece.setAttributeNS(null, "fill", "black");
    }
    piece.setAttributeNS(null, "cx", cx);
    piece.setAttributeNS(null, "cy", cy);
    piece.setAttributeNS(null, "class", "playedPiece");
    document.getElementsByTagName('svg')[0].appendChild(piece);
}
//iterates through board array and makes updates on page
function updateBoard(boardArr) {
    [].forEach.call(document.querySelectorAll('.playedPiece'), function (e) {
        e.parentNode.removeChild(e);
    });
    if (typeof boardArr != 'undefined') {
        var parseBoard = JSON.parse(boardArr);
        for (var i = 0; i < parseBoard.length; i++) {
            for (var j = 0; j < parseBoard[i].length; j++) {
                var cx = (j * 80) + 40;
                var cy = (i * 80) + 120;
                if (parseInt(parseBoard[i][j]) == 1) {
                    createPlayedPiece(cx, cy, 1);
                }
                else if (parseInt(parseBoard[i][j]) == 2) {
                    createOpponentPiece(cx, cy, 2);
                }
            }
        }
    }
}
document.getElementsByTagName('svg')[0].addEventListener('mousemove', drag, false);
document.getElementsByTagName('svg')[0].addEventListener('mouseup', releaseDrag, false);
var mover = '';
var myX, myY;
//sets variables for cx and cy for piece
function setDrag(id) {
    mover = id;
    myX = document.getElementById(mover).getAttributeNS(null, 'cx');
    myY = document.getElementById(mover).getAttributeNS(null, 'cy');
}

//releases piece and snaps to a legal space
function releaseDrag(evt) {
    if (mover != '') {
        var curX = evt.target.getAttribute('cx');
        document.getElementById(mover).setAttributeNS(null, 'cy', '40');
        var currentX = (parseInt(curX / 80) * 80) + 40;
        document.getElementById(mover).setAttributeNS(null, 'cx', currentX);
        mover = '';
    }
}
//function that is called on mouse down and updates the piece in relationship to the mouse
function drag(evt) {
    if (mover != '') {
        var me = document.getElementById(mover);
        var board = $('.boardContainer svg').position();
        me.setAttribute('cx', (evt.clientX - board.left));
        me.setAttribute('cy', (evt.clientY - board.top + $(window).scrollTop()));
    }
    else {

    }
}
//attempts to make a play by sending move to server
function playPiece(ele) {
    var pieceData = {
        game_id: gameid,
        xcoord: ele,
        _token: $('meta[name="csrf-token"]').attr('content')
    };
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "playPiece",
        dataType: "json",
        data: pieceData,
        success: function (data) {
            [].forEach.call(document.querySelectorAll('.unplayedPiece'), function (e) {
                e.parentNode.removeChild(e);
            });
        },
        failure: function (err) {
            console.log(err);
        },
    });
}

//gets all info for current game being played
function getGameState() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "gameState",
        dataType: "json",
        data: game,
        success: function (data) {
            if (data.data[0].gameState == "forfeit") {
                checkForfeit();
            }
            else if (data.data[0].gameState == "ended") {
                checkWinner();
            }
            updateBoard(data.data[0].boardArray);
        },
        failure: function (err) {
            console.log(err);
        },
    });
}
//checks whether the game has a winner set
function checkWinner() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "checkWinner",
        dataType: "json",
        data: game,
        success: function (data) {
            if (data.success == true) {
                clearInterval(chatGamePoller);
                clearInterval(gameStatePoller);
                clearInterval(checkTurnPoller);
                if (data.winner == true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Connect Four!',
                        text: 'You Won!'
                    });
                    setTimeout(function () { window.location = "/laravelProject/public/home"; }, 10000);
                }
                else if (data.winner == false) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oh no!',
                        text: 'You Lost!'
                    });
                    setTimeout(function () { window.location = "/laravelProject/public/home"; }, 10000);
                }
            }
        },
        failure: function (err) {
            console.log(err);
        },
    });
}

//checks whether a player has forfeited
function checkForfeit() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "checkWinner",
        dataType: "json",
        data: game,
        success: function (data) {
            if (data.success == false) {
                clearInterval(chatGamePoller);
                clearInterval(gameStatePoller);
                clearInterval(checkTurnPoller);
                if (data.winner == true) {
                    Swal.fire("Opponent has forfeited");
                    setTimeout(function () { window.location = "/laravelProject/public/home"; }, 10000);
                }
                else if (data.winner == false) {
                    Swal.fire("You have forfeited the game");
                    setTimeout(function () { window.location = "/laravelProject/public/home"; }, 10000);
                }
            }
        },
        failure: function (err) {
            console.log(err);
        },
    });
}

//checks the game to see whos turn it is and updates on screen
function checkTurn() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "checkTurn",
        dataType: "json",
        data: game,
        success: function (data) {
            if (data.success == false) {
                [].forEach.call(document.querySelectorAll('.unplayedPiece'), function (e) {
                    e.parentNode.removeChild(e);
                });
                $('#whosTurn').text('opponents turn');
            }
            else {
                $('#whosTurn').text('your turn');
                if (document.getElementById("piece_0") == null) {
                    if (data.data.playerTurn == data.data.player1ID) {
                        createPiece(1);
                    }
                    else if (data.data.playerTurn == data.data.player2ID) {
                        createPiece(2);
                    }
                }
            }
        },
        failure: function (err) {
            console.log(err);
        },
    });
}

//ajax call that checks if player has forfeited game
function forfeit() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "quitGame",
        dataType: "json",
        data: game,
        success: function (data) {
        },
        failure: function (err) {
            console.log(err);
        },
    });
}
//calls forfeit function if player reloads page or goes to different url
$(window).on('beforeunload', function (evt) {
    forfeit();
});
$(window).on('unload', function (evt) {
    forfeit();
});
//event listener for playing a piece
$(document).on("dblclick", ".unplayedPiece", function (e) {
    var dialog = confirm("are you sure you want to move here?");
    if (dialog) {
        var square = parseInt(document.getElementsByClassName('unplayedPiece')[0].getAttribute('cx') / 80);
        playPiece(square);
        $('.unplayedPiece').remove();
    }
    else {
        return false;
    }
});
//ajax call on form to prevent it from submitting and sending chat messages to database
$(document).ready(function () {
    $(".chatSend").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            async: true,
            cache: false,
            url: baseurl + "sendGameData",
            dataType: "json",
            data: $(this).serialize(),
            success: function (data) {
                $('#messageBox').val('');
                checkGameChat();
            },
            failure: function (err) {
                console.log(err);
            },
        });
        return false;
    });
});
//polls database to see if there are new chat messages
function checkGameChat() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "getGameChat",
        dataType: "json",
        data: messages,
        success: function (data) {
            if (data.success) {
                if (data.data.length > 0) {
                    var messageText = "";
                    for (var i = 0; i < data.data.length; i++) {
                        messageText += "<div id = 'messText'><strong>" + data.data[i].name + ": </strong> " + data.data[i].messageText + "</div>";
                    }
                    $('.box').html(messageText);
                }
            }
            document.querySelector(".box").scrollTo(0, document.querySelector(".box").scrollHeight);
        },
        failure: function (err) {
            console.log(err);
        },
    });
}
