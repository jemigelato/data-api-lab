var apikey = "19670727DCA7275886D885BFDD3C2B98";
var baseUrl = "http://api.ustream.tv/json";

var userSearchUrl = baseUrl + '/user/';
var user = "";
var query = "";
var url = "";
var hitCount = 0;

$(document).ready(function() {
    $("form").submit(function(event) {
        clearAll();
        event.preventDefault(); //prevent form from submitting
        user = $("input:first").val();
        console.log(user);

        query = "all/search/username:like:" + user + "?key=" + apikey;
        url = userSearchUrl + query;
        console.log(url);
        // send off the query
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: searchCallback
        });

    });

});

function clearAll() {
    $('#title').empty();
    $('#message').empty();
    $('#info').empty();
    $('#channels').empty();
    $('#videos').empty();
    $('#comments').empty();
}

function searchCallback(data) {

    if (data === null) {
        $('#title').append("Sorry, no results found for \"" + user + "\"");
    } else if (data.length === 1) {
        console.log(data[0]);

        query = "/getInfo?key=" + apikey;
        url = userSearchUrl + user + query;
        // send off the query
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: infoCallback
        });
    } else {
        $('#title').append('Search results for \"' + user + '\"');
        $('#message').append(data.length + " users found.");
        var ul = $('<ul>').appendTo('#info');
        var results = data;
        $.each(results, function(index, user) {

            var anchor = $('<a></a>')
                .attr("href", "#")
                .append(user.name)
                .click(function() {
                    openUser(user.name);
                })
                ;
            ul.append($('<li>')
                .append(anchor)
            );
        });
    }

    $('#title').fadeIn();
    $('#message').fadeIn();
    $('#info').fadeIn();
}

function openUser(userName) { // TODO: back key handling
    query = "/getInfo?key=" + apikey;
    url = userSearchUrl + userName + query;
    // send off the query
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: infoCallback
    });
}

function infoCallback(data) {
    clearAll();
    var results = data; // results array already. Why?
    if (results === null) {
        $('#message').append("No user found.");
    } else {
        console.log(data[0]);
        hitCount = 1;

        query = "/listAllChannels?key=" + apikey;
        url = userSearchUrl + user + query;
        // send off the query
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: channelsCallback
        });

        query = "/listAllVideos?key=" + apikey;
        url = userSearchUrl + user + query;
        // send off the query
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: videosCallback
        });

        query = "/getComments?key=" + apikey;
        url = userSearchUrl + user + query;
        // send off the query
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: commentsCallback
        });


        $('#message').append(data.userName);
        $('#message').fadeIn();
        $('#info').append("<h1>getInfo</h1>");
        var ul = $('<ul>').appendTo('#info');

        $.each(results, function(index, user) {
            ul.append(
                $(document.createElement('li')).text(user)
            );
        });
        //var version = data.version;
        //$('body').append(version);
        $('#info').fadeIn();
    }

}

function channelsCallback(data) {
    $('#channels').append("<h1>listAllChannels</h1>");
    if (data === null) {
        $('#channels').append("No channels found");
    } else {
        console.log(data[0]);
        var ul = $('<ul>').appendTo('#channels');
        var results = data; // results array already. Why?
        $.each(results, function(index, channel) {
            ul.append(
                $(document.createElement('li')).text(channel.title)
            );
            var ul2 = $('<ul>').appendTo(ul);
            $.each(channel, function(index, item) {
                ul2.append(
                    $(document.createElement('li')).text(item)
                );
            });
        });
    }

    $('#channels').fadeIn();
}

function videosCallback(data) {
    $('#videos').append("<h1>listAllVideos</h1>");
    if (data === null) {
        $('#videos').append("No videos found");
    } else {
        console.log(data);
        var ul = $('<ul>').appendTo('#videos');
        var results = data;
        $.each(results, function(index, video) {
            ul.append(
                $(document.createElement('li')).text(video.title)
            );
            var ul2 = $('<ul>').appendTo(ul);
            $.each(video, function(index, item) {
                ul2.append(
                    $(document.createElement('li')).text(item)
                );
            });
        });
    }

    $('#videos').fadeIn();
}

function commentsCallback(data) {
    $('#comments').append("<h1>getComments</h1>");
    if (data === null || $.isEmptyObject(data)) {
        $('#comments').append("No comments found");
    } else {
        console.log(data[0]);
        var ul = $('<ul>').appendTo('#comments');
        var results = data;
        $.each(results, function(index, comment) {
            ul.append(
                $(document.createElement('li')).text(comment.createdAt)
            );
            var ul2 = $('<ul>').appendTo(ul);
            $.each(comment, function(index, item) {
                ul2.append(
                    $(document.createElement('li')).text(item)
                );
            });
        });
    }

    $('#comments').fadeIn();
}