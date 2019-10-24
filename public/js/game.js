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