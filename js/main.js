var apikey = "19670727DCA7275886D885BFDD3C2B98";
var baseUrl = "http://api.ustream.tv/json";

var userSearchUrl = baseUrl + '/user/';
var channelSearchUrl = baseUrl + '/channel/';
var videoSearchUrl = baseUrl + '/video/';
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

    $(document.body).on("click", '.btn-user', function(e) {
        var target = $(e.currentTarget);
        var user = target[0].id.match(/us-([a-zA-Z0-9\-]*)/);

        if (user && user[1]) {
            openUser(user[1]);
        }

        e.preventDefault();
    });

    $(document.body).on("click", '.btn-video', function(e) {
        var target = $(e.currentTarget);
        var video = target[0].id.match(/vid-([a-zA-Z0-9\-]*)/);

        if (video && video[1]) {
            openVideo(video[1]);
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
    $('#chan-panel').hide();
    $('#chan-heading').empty();
    $('#chan-body').empty();
    $('#channels').empty();
    $('#videos').empty();
    $('#video-panel').hide();
    $('#video-heading').empty();
    $('#video-body').empty();
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
    console.log(url);
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
    console.log(url);
    // send off the query
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: channelInfoCallback
    });
}

function openVideo(vidId) { // TODO: back key handling
    query = "/getInfo?key=" + apikey;
    url = videoSearchUrl + vidId + query;
    console.log(url);
    // send off the query
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: videoInfoCallback
    });
}

function videoInfoCallback(data) {
    clearAll();
    var results = data; // results array already. Why?

    var anchor = '',
        text = ''
        image = ''
        thumb = '';

    $('<h1>', {text: results.title}).appendTo('#title');
    $('#title').fadeIn();

    $('<h2>', {text: "getInfo"}).appendTo('#info-heading');

    setRow("ID: ", results.id, '#info-body');
    setRow("User ID: ", results.user.id, '#info-body');
    anchor = $('<a>', {
        href: results.user.userName,
        text: results.user.userName,
        target: ""
    });
    setRow("User Username: ", anchor, '#info-body', undefined, 'btn-user', "us-" + results.user.id);
    anchor = $('<a>', {
        href: results.user.url,
        text: results.user.url,
        target: "_blank"
    });
    setRow("User URL: ", anchor, '#info-body');
    setRow("Description: ", results.description, '#info-body', true);
    setRow("Created At: ", results.createdAt, '#info-body');
    anchor = $('<a>', {href: results.url, text: results.url, target: "_blank"});
    setRow("URL: ", anchor, '#info-body');
    setRow("Length: ", results.lengthInSecond + " seconds", '#info-body');
    setRow("File Size: ", results.fileSize + " seconds", '#info-body');

    anchor = $('<a>', {
        href: results.imageUrl.small,
        target: "_blank"
    });
    thumb = $('<img>', {
        src: results.imageUrl.small,
        alt: "small thumbnail"
    });
    anchor.append(thumb);
    setRow("Image (Small): ", anchor, '#info-body', true);

    anchor = $('<a>', {
        href: results.imageUrl.medium,
        target: "_blank"
    });
    thumb = $('<img>', {
        src: results.imageUrl.medium,
        alt: "medium thumbnail"
    });
    anchor.append(thumb);
    setRow("Image (Medium): ", anchor, '#info-body', true);

    setRow("Rating: ", results.rating, '#info-body');
    text = $('<input>', {
        type: 'text',
        value: results.embedTag,
        disabled: true
    });
    setRow("Embed Tag: ", text, '#info-body');
    setRow("", results.embedTag, '#info-body');
    anchor = $('<a>', {
        href: results.embedTagSourceUrl,
        text: results.embedTagSourceUrl,
        target: "_blank"
    });
    setRow("Embed Tag Source URL: ", anchor, '#info-body');
    setRow("Has Tags: ", results.hasTags, '#info-body');
    setRow("Number of Comments: ", results.numberOf.comments, '#info-body');
    setRow("Number of Ratings: ", results.numberOf.ratings, '#info-body');
    setRow("Number of Favorites: ", results.numberOf.favorites, '#info-body');
    setRow("Number of Views: ", results.numberOf.views, '#info-body');
    setRow("Number of Tags: ", results.numberOf.tags, '#info-body');
    setRow("Tags: ", results.tags, '#info-body');

    anchor = $('<a>', {
        href: results.liveHttpUrl,
        text: results.liveHttpUrl,
        target: "_blank"
    });
    setRow("Download link: ", anchor, '#info-body');

    setRow("Source Channel ID: ", results.sourceChannel.id, '#info-body');

    $('#info-panel').fadeIn();
}

function channelInfoCallback(data) {
    clearAll();
    var results = data; // results array already. Why?

    var anchor = '',
        text = ''
        image = ''
        thumb = '';

    $('<h1>', {text: results.title}).appendTo('#title');
    $('#title').fadeIn();

    $('<h2>', {text: "getInfo"}).appendTo('#info-heading');

    setRow("ID: ", results.id, '#info-body');
    setRow("User ID: ", results.user.id, '#info-body');
    anchor = $('<a>', {
        href: results.user.userName,
        text: results.user.userName,
        target: ""
    });
    setRow("User Username: ", anchor, '#info-body', undefined, 'btn-user', "us-" + results.user.id);
    anchor = $('<a>', {
        href: results.user.url,
        text: results.user.url,
        target: "_blank"
    });
    setRow("User URL: ", anchor, '#info-body');
    setRow("Description: ", results.description, '#info-body', true);
    anchor = $('<a>', {href: results.url, text: results.url, target: "_blank"});
    setRow("URL: ", anchor, '#info-body');
    setRow("Status: ", results.status, '#info-body');
    setRow("Created At: ", results.createdAt, '#info-body');
    setRow("Last Streamed At: ", results.lastStreamedAt, '#info-body');
    var imgUrl;
    if (results.imageUrl) {
        imgUrl = results.imageUrl.small;
        anchor = $('<a>', {
            href: imgUrl,
            target: "_blank"
        });
        thumb = $('<img>', {
            src: imgUrl,
            alt: "small thumbnail"
        });
        anchor.append(thumb);
        setRow("Image (Small): ", anchor, '#info-body', true);
    } else {
        setRow("Image (Small): ", undefined, '#info-body');
    }

    if (results.imageUrl) {
        imgUrl = results.imageUrl.medium;
        anchor = $('<a>', {
            href: imgUrl,
            target: "_blank"
        });
        thumb = $('<img>', {
            src: imgUrl,
            alt: "small thumbnail"
        });
        anchor.append(thumb);
        setRow("Image (Medium): ", anchor, '#info-body', true);
    } else {
        setRow("Image (Medium): ", undefined, '#info-body');
    }

    setRow("Rating: ", results.rating, '#info-body');
    text = $('<input>', {
        type: 'text',
        value: results.embedTag,
        disabled: true
    });
    setRow("Embed Tag: ", text, '#info-body');
    setRow("", results.embedTag, '#info-body');
    anchor = $('<a>', {
        href: results.embedTagSourceUrl,
        text: results.embedTagSourceUrl,
        target: "_blank"
    });
    setRow("Embed Tag Source URL: ", anchor, '#info-body');
    setRow("Has Tags: ", results.hasTags, '#info-body');
    setRow("Number of Comments: ", results.numberOf.comments, '#info-body');
    setRow("Number of Ratings: ", results.numberOf.ratings, '#info-body');
    setRow("Number of Favorites: ", results.numberOf.favorites, '#info-body');
    setRow("Number of Views: ", results.numberOf.views, '#info-body');
    setRow("Number of Tags: ", results.numberOf.tags, '#info-body');
    setRow("Tags: ", results.tags, '#info-body');
    setRow("Social Stream Hashtag: ", results.socialStream.hashtag, '#info-body');
    text = $('<input>', {
        type: 'text',
        value: results.chat.embedTag,
        disabled: true
    });
    setRow("Chat Embed Tag: ", text, '#info-body');

    $('#info-panel').fadeIn();

    query = "/getComments?key=" + apikey;
    url = channelSearchUrl + searchString + query;
    // send off the query
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: channelCommentsCallback // TODO
    });
}

function setRow(label, value, selector, twoRows, eclass, eid) {
    var lab = $('<strong>').append(label);

    var vtext = (value) ? value : "<i>none</i>";

    if (twoRows && value) {
        val = $('<div>', {style : "width:640px", class: "panel panel-default"});
        var pbody = $('<div>', {class: "panel-body"});
        val.append(pbody);
        pbody.append(vtext);
    } else {
        val = $('<span>');
        val.append(vtext);
    }

    var cla = (typeof eclass != 'undefined') ? eclass : "";
    val.addClass(cla);

    var valId = (typeof eid != 'undefined') ? eid : "";
    val.attr( "id", valId );

    var row = $('<div>').appendTo(selector);
    row.append(lab).append(val);
}

function userInfoCallback(data) {
    clearAll();
    var results = data; // results array already. Why?
    if (results === null) {
        $('#title').append("No user found.");
    } else {
        console.log(data[0]);

        query = "/listAllChannels?key=" + apikey;
        url = userSearchUrl + data.id + query;
        // send off the query
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: channelsCallback
        });

        query = "/listAllVideos?key=" + apikey;
        url = userSearchUrl + data.id + query;
        // send off the query
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: videosCallback
        });

        query = "/getComments?key=" + apikey;
        url = userSearchUrl + data.id + query;
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
            $('<h2>').append('getInfo')
        );

        setRow("ID: ", results.id, '#info-body');
        setRow("Registered At: ", results.registeredAt, '#info-body');
        setRow("About: ", results.about, '#info-body');
        setRow("Website: ", results.website, '#info-body');
        var anchor = $('<a>', {
            href: results.url,
            text: results.url,
            target: "_blank"
        });
        setRow("URL: ", anchor, '#info-body');

        $('#info-panel').fadeIn();
    }

}

function setHeading(index, eid, actualId, title, imageUrl, anchorClass, selector, status) {
    $('<hr>').appendTo(selector);

    var anchor = $('<a>', {
        class: 'pull-left btn-channel',
        id: eid,
        href: ""
    });
    var thumb = $('<img>', {
        src: imageUrl,
        alt: title
    });
    anchor.append(thumb);

    var tDiv = $('<div>', {
        class: 'media'
    });

    var bDiv = $('<div>', {
        class: 'media-body',
        id: 'media-body-' + actualId
    });

    var chTitle = $('<h4>', {
        class: 'media-heading'
    });

    var tAnch = $('<a>', {
        class: anchorClass,
        id: eid,
        text: title,
        style: "cursor: pointer;"
    });

    if (status) {
        chTitle.append(tAnch).append(" / " + actualId + " / " + status);
    } else {
        chTitle.append(tAnch).append(" / " + actualId);
    }

    bDiv.append(chTitle);

    tDiv.append(anchor).append(bDiv);
    tDiv.appendTo(selector);
}

function channelsCallback(data) {
    $('<h2>').append('listAllChannels').appendTo('#chan-heading');
    if (data === null) {
        $('#chan-body').append("No channels found");
    } else {
        console.log(data[0]);

        var table = $('<table>', {class: "table"});

        var results = data; // results array already. Why?
        $.each(results, function(index, channel) {

            setHeading(index, "ch-" + channel.id, channel.id, channel.title,
                channel.imageUrl.small, 'btn-channel', '#chan-body', channel.status);

            setRow("Description: ", channel.description, '#media-body-' + channel.id, true);
            setRow("Created At: ", channel.createdAt, '#media-body-' + channel.id);
            setRow("Last Streamed At: ", channel.lastStreamedAt, '#media-body-' + channel.id);
            setRow("Total Views: ", channel.totalViews, '#media-body-' + channel.id);
            setRow("Rating: ", channel.rating, '#media-body-' + channel.id);
            setRow("Viewers Now: ", channel.viewersNow, '#media-body-' + channel.id);
        });
    }

    $('#chan-panel').fadeIn();

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
    $('<h2>').append('listAllVideos').appendTo('#video-heading');

    if (data === null) {
        $('#video-body').append("No videos found");
    } else {
        console.log(data);
        // var ul = $('<ul>').appendTo('#videos');
        var results = data;
        $.each(results, function(index, video) {
            setHeading(index, "vid-" + video.id, video.id, video.title,
                video.imageUrl.small, 'btn-video', '#video-body', video.status);

            setRow("Description: ", video.description, '#media-body-' + video.id, true);
            setRow("Created At: ", video.createdAt, '#media-body-' + video.id);
            setRow("Length: ", video.lengthInSecond + " seconds", '#media-body-' + video.id);
            setRow("Total Views: ", video.totalViews, '#media-body-' + video.id);
            setRow("Rating: ", video.rating, '#media-body-' + video.id);
            setRow("Source Channel ID: ", video.sourceChannel.id, '#media-body-' + video.id);
        });
    }

    //$('#videos').fadeIn();
    $('#video-panel').fadeIn();
}

function commentsCallback(data) {
    $('#comments').append(
        $('<h2>').append('getComments')
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

function channelCommentsCallback(data) {

}