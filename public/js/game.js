

var messages = {
    // message: message,
    // user_id:user_id,
    gameid: gameid,
    _token: $('meta[name="csrf-token"]').attr('content')
};
var game = {
    id: gameid,
    _token: $('meta[name="csrf-token"]').attr('content')
};
var baseurl = "/laravelProject/public/";
var svgns = "http://www.w3.org/2000/svg";
//console.log(message);
var pieceCounter = 0;
checkGameChat();
chatGamePoller = setInterval(checkGameChat, 1000);
gameStatePoller = setInterval(getGameState, 2000);
checkTurnPoller = setInterval(checkTurn, 5000);
function createPiece(playerID) {

    if (document.getElementsByClassName('unplayedPiece').length < 1) {
        var piece = document.createElementNS(svgns, "circle");
        piece.setAttributeNS(null, "r", "25");
        piece.setAttributeNS(null, "cx", "40");
        piece.setAttributeNS(null, "cy", "40");
        if (playerID == 1) {
            piece.setAttributeNS(null, "fill", "red");
        }
        else {
            piece.setAttributeNS(null, "fill", "black");
        }

        piece.setAttributeNS(null, "r", "25");
        piece.setAttributeNS(null, "class", "unplayedPiece");
        piece.setAttributeNS(null, "id", "piece_" + pieceCounter);
        pieceCounter++;
        piece.setAttributeNS(null, "onmousedown", "setDrag(this.id)");
        document.getElementsByTagName('svg')[0].appendChild(piece);

    }

}

function createOpponentPiece(cx, cy, playerID) {

    var piece = document.createElementNS(svgns, "circle");
    if (playerID == 1) {
        piece.setAttributeNS(null, "fill", "red");
    }
    else {
        piece.setAttributeNS(null, "fill", "black");
    }

    piece.setAttributeNS(null, "r", "25");
    // piece.setAttributeNS(null, "id", "1");
    piece.setAttributeNS(null, "cx", cx);
    piece.setAttributeNS(null, "cy", cy);
    console.log("cx " + cx);
    console.log("cy " + cy);
    piece.setAttributeNS(null, "class", "playedPiece");
    // piece.setAttributeNS(null, "id", "opponentPiece");
    document.getElementsByTagName('svg')[0].appendChild(piece);

}
function createPlayedPiece(cx, cy, playerID) {


    var piece = document.createElementNS(svgns, "circle");
    piece.setAttributeNS(null, "r", "25");
    if (playerID == 1) {
        piece.setAttributeNS(null, "fill", "red");
    }
    else {
        piece.setAttributeNS(null, "fill", "black");
    }
    piece.setAttributeNS(null, "r", "25");
    piece.setAttributeNS(null, "cx", cx);
    piece.setAttributeNS(null, "cy", cy);
    piece.setAttributeNS(null, "class", "playedPiece");
    // piece.setAttributeNS(null, "id", "myPiece");
    document.getElementsByTagName('svg')[0].appendChild(piece);

}
function updateBoard(boardArr) {
    [].forEach.call(document.querySelectorAll('.playedPiece'), function (e) {
        e.parentNode.removeChild(e);
    });
    // boardArr = new Array();
    // for (var i = 0; i < 6; i++) {
    //     subArray = new Array();
    //     for (var j = 0; j < 7; j++) {
    //         var random = Math.random();
    //         if (random < .5) {
    //             random = 1;
    //         }
    //         else {
    //             random = 2;
    //         }
    //         subArray[j] = random;
    //     }
    //     boardArr[i] = subArray;
    // }
    if (typeof boardArr != 'undefined') {
        console.log(JSON.parse(boardArr));
        var parseBoard = JSON.parse(boardArr);
        for (var i = 0; i < parseBoard.length; i++) {
            for (var j = 0; j < parseBoard[i].length; j++) {
                var cx = (j * 80) + 40;
                var cy = (i * 80) + 40;
                if (parseInt(parseBoard[i][j]) == 1) {
                    createPlayedPiece(cx, cy, 1);
                    console.log("createPlayedPiece(cx, cy);");
                }
                else if (parseInt(parseBoard[i][j]) == 2) {
                    createOpponentPiece(cx, cy, 2);
                    console.log("createOpponentPiece(cx, cy);");
                }

            }
        }
    }



}
document.getElementsByTagName('svg')[0].addEventListener('mousemove', drag, false);
document.getElementsByTagName('svg')[0].addEventListener('mouseup', releaseDrag, false);
var mover = '';
var myX, myY;
function setDrag(id) {
    mover = id;
    console.log(mover);
    myX = document.getElementById(mover).getAttributeNS(null, 'cx');
    myY = document.getElementById(mover).getAttributeNS(null, 'cy');
    console.log(myX);
    console.log(myY);
}
function move(evt) {
    //console.log(evt);
    if (mover != '') {
        //I should be dragging something! (id)
        var me = document.getElementById(mover);
        //evt.clientX and Y are NOT what we want - they are from the top left of the page (not container)
        if (document.all) { //offsetX and Y FAIL in FireFox
            me.setAttributeNS(null, 'cx', evt.offsetX);
            me.setAttributeNS(null, 'cy', evt.offsetY);
        } else {	//layerX and layerY FAIL in IE
            me.setAttributeNS(null, 'cx', evt.layerX);
            me.setAttributeNS(null, 'cy', evt.layerY);
        }

    }
}
function drag(evt) {
    if (mover != '') {
        var me = document.getElementById(mover);
        var board = $('.boardContainer svg').position();
        // console.log(evt.clientX - board.left);
        me.setAttribute('cx', (evt.clientX - board.left));
        me.setAttribute('cy', (evt.clientY - board.top + $(window).scrollTop()));
    }
    else {

    }
}
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
            console.log("playPiece");
            console.log(data);
            [].forEach.call(document.querySelectorAll('.unplayedPiece'), function (e) {
                e.parentNode.removeChild(e);
            });

        },
        failure: function (err) {
            console.log(err);


        },

    });
}
function releaseDrag(evt) {
    if (mover != '') {
        //when i fire am i on a good space? (a cell)

        var curX = evt.target.getAttribute('cx');
        document.getElementById(mover).setAttributeNS(null, 'cy', '40');

        var currentX = (parseInt(curX / 80) * 80) + 40;
        document.getElementById(mover).setAttributeNS(null, 'cx', currentX);

        mover = '';
        //   document.getElementsByClassName('unplayedPiece')[0].remove();
        //check to see if this point is insde of a cell
        // var hit = checkHit(curX,curY);
        // if(hit) {
        // //im on a square
        // mover = '';
        // }
        // else {
        //     //i am not bounce back
        //     document.getElementById(mover).setAttribute(null,'cx',cX);
        //     document.getElementById(mover).setAttribute(null,'cy',cY);
        //     mover = '';
        // }
        //get my original coords				
    }

}

function getGameState() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "gameState",
        dataType: "json",
        data: game,
        success: function (data) {
            console.log(data);
            if (data.data[0].gameState == "forfeit") {
                clearInterval(gameStatePoller);
                var r = confirm("Opponent has forfeited");
                window.location = "/laravelProject/public/home";
            }
            updateBoard(data.data[0].boardArray);

        },
        failure: function (err) {
            console.log(err);

        },

    });
}

function checkTurn() {
    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "checkTurn",
        dataType: "json",
        data: game,
        success: function (data) {
            console.log("checkTurn");
            console.log(data);
            if (data.success == false) {
                [].forEach.call(document.querySelectorAll('.unplayedPiece'), function (e) {
                    e.parentNode.removeChild(e);
                });
                $('#whosTurn').text('opponents turn');


            }
            else {
                $('#whosTurn').text('your turn');
                if (document.getElementById("piece_0") == null) {
                    console.log("append piece here");
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

function forfeit() {
    console.log("forfeit");
    console.log(game);

    // $.ajax({
    //     type: "POST",
    //     async: true,
    //     cache: false,
    //     url: baseurl + "quitGame",
    //     dataType: "json",
    //     data: game,
    //     success: function (data) {
    //         console.log("forfeit");
    //         console.log(data);
    //     },
    //     failure: function (err) {
    //         console.log(err);

    //     },

    // });

}
$(window).on('beforeunload', function (evt) {

    // var r = confirm("Are you sure you want to quit?");
    // if (r == true) {
    forfeit();
    // }

});
$(window).on('unload', function (evt) {
    forfeit();

});
$(document).on("dblclick", ".unplayedPiece", function (e) {

    var dialog = confirm("are you sure you want to move here?");
    if (dialog) {
        // var square = parseInt(document.getElementById(mover).getAttribute('cx') / 80);
        // playPiece(square);
        var square = parseInt(document.getElementsByClassName('unplayedPiece')[0].getAttribute('cx') / 80);
        playPiece(square);
        $('.unplayedPiece').remove();
    }
    else {
        return false;
    }
});

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

                $('#messageInput').val('');
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
            if (data.success) {
                if (data.data.length > 0) {
                    var messageText = "";
                    for (var i = 0; i < data.data.length; i++) {
                        messageText += "<div><strong>" + data.data[i].name + ": </strong> " + data.data[i].messageText + "</div>";
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
    //   }

}



//gamePoller = setInterval(checkGame, 1000);
