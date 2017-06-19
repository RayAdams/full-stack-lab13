var chirpObj = {};

$(document).ready(function(){
    getTrendingChirps();    
    //toggle button on and off using BS disabled class
    //$('.btn').removeClass("disabled");
})

function drawChirps(chirps)  {
    for (var i = 0, len = chirps.length; i < len; i++) {
        var $div = $("<div>");
        var user = `<p> ${chirps[i].user} </p>`;            
        var message = `<p> ${chirps[i].message} </p>`;
        var timestamp = `<p> ${chirps[i].timestamp} </p>`;
        $div.append(user, message, timestamp);
        //TODO: add style for each div
        $(".tweet-area").append($div);
    }
}

var newChirp = ()=>{
    chirpObj.message = $('#textBox').val();
    chirpObj.user = 'Rach';
    chirpObj.timestamp = new Date().toISOString();
    return chirpObj;
}

var getChirps = ()=>{
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/api/chirps",
        contentType: 'text/html',
        dataType: "text"
    }).then(function(success){
        document.body(JSON.parse(success));
    }, function(err){
        console.log(err);
    });
}

var getTrendingChirps = () => {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/api/chirps",
        contentType: 'text/html',
        dataType: "text"
    }).then(function(data){
        drawChirps(JSON.parse(data));
    }, function(err){
        console.log(err);
    });
}

//fix posts
var postChirp = newChirp();
$('#btn').click(function() {
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/api/chirps",
        contentType: "application/json",
        dataType: "html",
        data: JSON.stringify(postChirp)
    }).then(function(success) {
        getTrendingChirps();
        //reset chirp input value?

    }, function(err) {
        console.log(err);
    });
});

//work on button to api/chirps