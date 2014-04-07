var apikey = "19670727DCA7275886D885BFDD3C2B98";
var baseUrl = "http://api.ustream.tv/json";

var userSearchUrl = baseUrl + '/user/';
var channelSearchUrl = baseUrl + '/channel/';
var searchString = "";
var query = "";
var url = "";
var channelSearched = false;
var userSearched = false;
var userData = null;
var channelData = null;

$(document).ready(function() {
    $("form").submit(function(event) {
        event.preventDefault(); //prevent form from submitting
        clearAll();
        searchString = $("input:first").val();
        console.log(searchString);
        userSearch();
        channelSearch();
    });

    $(document.body).on("click", '.btn-channel', function(e) {
        var target = $(e.currentTarget);
        var channel = target[0].id.match(/ch-([a-zA-Z0-9\-]*)/);

        if (channel && channel[1]) {
            openChannel(channel[1]);
        }

        e.preventDefault();
    });

});

function userSearch(event) {

    query = "all/search/username:like:" + searchString + "?key=" + apikey;
    url = userSearchUrl + query;
    console.log(url);
    // send off the query
    $.ajax({
        url: url,
        dataType: "jsonp",
        context: {
            searchType: 'user'
        },
        success: searchCallback
    });
}

function clearAll() {
    $('#title').empty();
    $('#user-results').empty();
    $('#channel-results').empty();
    $('#info').empty();
    $('#info-panel').hide();
    $('#info-heading').empty();
    $('#info-body').empty();
    $('#channels').empty();
    $('#videos').empty();
    $('#comments').empty();
    channelSearched = false;
    userSearched = false;
    userData = null;
    channelData = null;
}

function channelSearch() {
    query = "all/search/title:like:" + searchString + "?key=" + apikey;
    url = channelSearchUrl + query;
    console.log(url);
    // send off the query
    $.ajax({
        url: url,
        dataType: "jsonp",
        context: {
            searchType: 'channel'
        },
        success: searchCallback
    });
}

function searchCallback(data) {

    if (this.searchType === 'user') {
        userSearched = true;
        userData = data;
    } else {
        channelSearched = true;
        channelData = data;
    }

    if (userSearched && channelSearched) {

        if (userData === null && channelData === null) {

            $('#title').append("Sorry, no results found for: " + searchString);

        } else if ((userData != null && userData.length === 1 && channelData === null)
            || (userData === null && channelData.length === 1)) {

            if (userData != null) {
                console.log(userData[0]);
                query = "/getInfo?key=" + apikey;
                url = userSearchUrl + searchString + query;
                $.ajax({
                    url: url,
                    dataType: "jsonp",
                    success: userInfoCallback
                });
            } else {
                console.log(channelData[0]);
                query = "/getInfo?key=" + apikey;
                url = channelSearchUrl + searchString + query;
                $.ajax({
                    url: url,
                    dataType: "jsonp",
                    success: channelInfoCallback
                });
            }

        } else {

            $('#title').append(
                $('<h3>').append('Search results for: ' + searchString)
            );
            var userLen = (userData == null) ? 0 : userData.length;
            var channelLen = (channelData == null) ? 0 : channelData.length;

            $('#title').append(
                $('<ul>').append(
                    $('<li>').append(
                        "users found: " + userLen
                    )
                ).append(
                    $('<li>').append(
                        "channels found: " + channelLen
                    )
                )
            );

            if (userData != null) {
                $('#user-results').append(
                    $('<h3>').append('User Results')
                );
                var list = $('<ul>').appendTo('#user-results');
                var results = userData;
                $.each(results, function(index, user) {
                    var anchor = $('<a>')
                        .attr("href", "#")
                        .append(user.name)
                        .click(function() {
                            openUser(user.name);
                        });

                    var listItem = $('<li>').append(anchor);
                    listItem.append($('<span>')
                        .append(" (" + user.id + ") ")
                    ).addClass('list-group-item');
                    list.append(listItem)
                        .addClass('list-group');
                });
            }

            if (channelData != null) {
                $('#channel-results').append(
                    $('<h3>').append('Channel Results')
                );
                var list = $('<ul>').appendTo('#channel-results');
                var results = channelData;
                $.each(results, function(index, channel) {
                    var anchor = $('<a>')
                        .attr("href", "#")
                        .append(channel.title)
                        .click(function() {
                            openChannel(channel.id);
                        });
                    var listItem = $('<li>').append(anchor);
                    listItem.append($('<span>')
                        .append(" (" + channel.id + ") ")
                    ).addClass('list-group-item');
                    list.append(listItem)
                        .addClass('list-group');
                });
            }

        }
    }


    $('#title').fadeIn();
    $('#info').fadeIn();
    $('#search-results').fadeIn();
    $('#channel-results').fadeIn();
}

function openUser(userName) { // TODO: back key handling
    query = "/getInfo?key=" + apikey;
    url = userSearchUrl + userName + query;
    // send off the query
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: userInfoCallback
    });
}

function openChannel(chId) { // TODO: back key handling
    query = "/getInfo?key=" + apikey;
    url = channelSearchUrl + chId + query;
    // send off the query
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: channelInfoCallback
    });
}

function channelInfoCallback(data) {
    clearAll();
    var results = data; // results array already. Why?
    $('#title').append(
        $('<h1>').append(data.title)
    );
    $('#title').fadeIn();
    $('#info').append(
        $('<h3>').append('getInfo')
    );
    var ul = $('<ul>').appendTo('#info');

    $.each(results, function(index, item) {
        ul.append(
            $('<li>').append(item)
        );
    });
    $('#info').fadeIn();

    query = "/getComments?key=" + apikey;
    url = channelSearchUrl + searchString + query;
    // send off the query
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: channelCommentsCallback // TODO
    });
}

function userInfoCallback(data) {
    clearAll();
    var results = data; // results array already. Why?
    if (results === null) {
        $('#title').append("No user found.");
    } else {
        console.log(data[0]);

        query = "/listAllChannels?key=" + apikey;
        url = userSearchUrl + searchString + query; // TODO: Don't use searchString
        // send off the query
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: channelsCallback
        });

        query = "/listAllVideos?key=" + apikey;
        url = userSearchUrl + searchString + query;
        // send off the query
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: videosCallback
        });

        query = "/getComments?key=" + apikey;
        url = userSearchUrl + searchString + query;
        // send off the query
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: commentsCallback
        });


        $('#title').append(
            $('<h1>').append(data.userName)
        );
        $('#title').fadeIn();
        $('#info-heading').append(
            $('<h3>').append('getInfo')
        );

        $('#info-body').append($('<p>').append($('<strong>').append("ID: ")
            ).append($('<span>').append(results.id))

        ).append($('<p>').append($('<strong>').append("Registered At: ")
            ).append($('<span>').append(results.registeredAt))

        ).append($('<p>').append($('<strong>').append("About: ")
            ).append($('<span>').append(results.about))

        ).append($('<p>').append($('<strong>').append("Website: ")
            ).append($('<span>').append(results.website))

        ).append($('<p>').append($('<strong>').append("URL: ")
            ).append($('<span>').append(
                $('<a>').attr( {'href': results.url, 'target': '_blank' }
                    ).append(results.url)
                )
            )
        );

        $('#info-panel').fadeIn();
    }

}

function channelsCallback(data) {
    $('#channels').append(
        $('<h3>').append('listAllChannels')
    );
    if (data === null) {
        $('#channels').append("No channels found");
    } else {
        console.log(data[0]);
        var ul = $('<ul>').appendTo('#channels');

        var results = data; // results array already. Why?
        $.each(results, function(index, channel) {
            ul.append(
                $('<li>').append(channel.title)
            ).append($('<button>')
                .attr( { type:"button", class:"btn btn-default btn-sm btn-channel", id:"ch-" + channel.id } )
                .append('View channel info <span class="glyphicon glyphicon-chevron-right"></span>'))
            ;
            var ul2 = $('<ul>').appendTo(ul);
            $.each(channel, function(index, item) {
                ul2.append(
                    $('<li>').append(item)
                );
            });
        });
    }

    $('#channels').fadeIn();

    //hide everything
    $('.outline li > ul').hide();
    //activate class "expanded"
    $('.outline li > .expanded + ul').show('normal');
    $('.outline li > a').click(function() {
        //hide everything
        $(this).find('ul').hide();
        //toggle next ul
        $(this).toggleClass('expanded').toggleClass('collapsed').next('ul').toggle('normal');
    });
}

function videosCallback(data) {
    $('#videos').append(
        $('<h3>').append('listAllVideos')
    );
    if (data === null) {
        $('#videos').append("No videos found");
    } else {
        console.log(data);
        var ul = $('<ul>').appendTo('#videos');
        var results = data;
        $.each(results, function(index, video) {
            ul.append(
                $('<li>').append(video.title)
            );
            var ul2 = $('<ul>').appendTo(ul);
            $.each(video, function(index, item) {
                ul2.append(
                    $('<li>').append(item)
                );
            });
        });
    }

    $('#videos').fadeIn();
}

function commentsCallback(data) {
    $('#comments').append(
        $('<h3>').append('getComments')
    );
    if (data === null || $.isEmptyObject(data)) {
        $('#comments').append("No comments found");
    } else {
        console.log(data[0]);
        var ul = $('<ul>').appendTo('#comments');
        var results = data;
        $.each(results, function(index, comment) {
            ul.append(
                $('<li>').append(comment.createdAt)
            );
            var ul2 = $('<ul>').appendTo(ul);
            $.each(comment, function(index, item) {
                ul2.append(
                    $('<li>').append(item)
                );
            });
        });
    }

    $('#comments').fadeIn();
}