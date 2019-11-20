

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

checkGameChat();
chatGamePoller = setInterval(checkGameChat, 1000);
gameStatePoller = setInterval(getGameState, 5000);
function createPiece() {

    var piece = document.createElementNS(svgns, "circle");
    piece.setAttributeNS(null, "r", "25");
    piece.setAttributeNS(null, "cx", "40");
    piece.setAttributeNS(null, "cy", "40");
    piece.setAttributeNS(null, "fill", "red");
    piece.setAttributeNS(null, "r", "25");
    piece.setAttributeNS(null, "id", "1");
    piece.setAttributeNS(null, "onmousedown", "setDrag(this.id)");
    document.getElementsByTagName('svg')[0].appendChild(piece);

}

function createOpponentPiece(cx, cy) {

    var piece = document.createElementNS(svgns, "circle");
    piece.setAttributeNS(null, "r", "25");
    piece.setAttributeNS(null, "cx", "40");
    piece.setAttributeNS(null, "cy", "40");
    piece.setAttributeNS(null, "fill", "black");
    piece.setAttributeNS(null, "r", "25");
    piece.setAttributeNS(null, "id", "1");
    piece.setAttributeNS(null, "cx", cx);
    piece.setAttributeNS(null, "cy", cy);
    piece.setAttributeNS(null,"class","playedPiece");
    document.getElementsByTagName('svg')[0].appendChild(piece);

}
function createPlayedPiece(cx, cy) {

    var piece = document.createElementNS(svgns, "circle");
    piece.setAttributeNS(null, "r", "25");
    piece.setAttributeNS(null, "cx", "40");
    piece.setAttributeNS(null, "cy", "40");
    piece.setAttributeNS(null, "fill", "red");
    piece.setAttributeNS(null, "r", "25");
    piece.setAttributeNS(null, "id", "1");
    piece.setAttributeNS(null, "cx", cx);
    piece.setAttributeNS(null, "cy", cy);
    piece.setAttributeNS(null,"class","playedPiece");
    document.getElementsByTagName('svg')[0].appendChild(piece);

}
function updateBoard(boardArr) {
    [].forEach.call(document.querySelectorAll('.playedPiece'),function(e){
        e.parentNode.removeChild(e);
      });
    boardArr = new Array();
    for (var i = 0; i < 6; i++) {
        subArray = new Array();
        for (var j = 0; j < 7; j++) {
            var random = Math.random();
            if (random < .5) {
                random = 1;
            }
            else {
                random = 2;
            }
            subArray[j] = random;
        }
        boardArr[i] = subArray;
    }
    for (var i = 0; i < boardArr.length; i++) {
        for (var j = 0; j < boardArr[i].length; j++) {
            var cx = (j * 80) + 40;
            var cy = (i * 80) + 120;
            if(boardArr[i][j] == 1) {
                createPlayedPiece(cx,cy);
            }
            else if(boardArr[i][j] == 2){
                createOpponentPiece(cx,cy);
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
        console.log(evt.clientX - board.left);
        me.setAttribute('cx', (evt.clientX - board.left));
        me.setAttribute('cy', (evt.clientY - board.top + $(window).scrollTop()));
    }
    else {

    }
}

function releaseDrag(evt) {
    if (mover != '') {
        //when i fire am i on a good space? (a cell)
        console.log(evt);
        var curX = parseInt(document.getElementById(mover).getAttributeNS(null, 'cx'));
        var curY = parseInt(document.getElementById(mover).getAttributeNS(null, 'cy'));
        document.getElementById(mover).setAttributeNS(null, 'cy', '40');
        var currentX = (curX / 80) + 40
        document.getElementById(mover).setAttributeNS(null, 'cx', currentX);

        mover = '';
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

function forfeit() {
    console.log("forfeit");
    console.log(game);

    $.ajax({
        type: "POST",
        async: true,
        cache: false,
        url: baseurl + "quitGame",
        dataType: "json",
        data: game,
        success: function (data) {
            console.log("forfeit");
            console.log(data);
        },
        failure: function (err) {
            console.log(err);

        },

    });

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
