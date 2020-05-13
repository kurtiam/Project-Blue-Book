var page = 0;

//popluate venues within 25 miles of DFW area. Each page can only show 200 results. Will need to do a 2nd api call and append  
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/venues.json?&latlong=32.79067196,-96.81081803&dmaId=261&apikey=IbUXFudvQmR2gZo5kLDiuVkaZTavZiEV&sort=name,asc&radius=25&unit=miles&size=200&page=0",
        async: false,
        dataType: "json",
        success: function (data) {
            autoList = {};
            autoList2 = [];
            p0 = '<option value="-1">Select Venue</option>';
            for (var i = 0; i < data._embedded.venues.length; i++) {
                p0 += '<option value="' + data._embedded.venues[i].name + '">' + data._embedded.venues[i].name + '</option>';
                // autoList += JSON.stringify(data._embedded.venues[i].name)
                $("#myList").html(p0)
                // $('#venue-view').html(autoList)
                autoList = data._embedded.venues[i].name
                autoList2 += autoList.name
                // console.log(autoList)
                $("input#search-textbox").autocomplete({
                    source: [autoList]
                });

            }
        }

        // 2nd api call for venues over 200 then append to #mylist selection in index.
    });

    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/venues.json?&latlong=32.79067196,-96.81081803&dmaId=261&apikey=IbUXFudvQmR2gZo5kLDiuVkaZTavZiEV&sort=name,asc&radius=25&unit=miles&size=200&page=1",
        async: false,
        timeout: 30000,
        dataType: "json",
        success: function (data) {
            autoLista = [];
            var p1 = '<option value="-1"></option>';
            for (var i = 0; i < data._embedded.venues.length; i++) {
                p1 += '<option value="' + data._embedded.venues[i].name + '">' + data._embedded.venues[i].name + '</option>';
                autoList += JSON.stringify(data._embedded.venues[i].name)
                $("#myList").html(p0)
                $(p1).appendTo("#myList");
            }

        }
    });

});

// will find the above selected venues location (lat and long) and store in variables: loc.latitude and loc.longitude
$("#myList").on("change", function (event) {

    event.preventDefault();
    place = $("#myList option:selected").text()
    var unLocURL = "https://app.ticketmaster.com/discovery/v2/suggest?apikey=IbUXFudvQmR2gZo5kLDiuVkaZTavZiEV&keyword=" + place + "&locale=*";
    var enLocURL = encodeURI(unLocURL);
    console.log(enLocURL);

    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: enLocURL,
            data: "{}",
            success: function (data) {
                loc = data._embedded.venues[0].location
                // console.log("Venue: " + place);
                // console.log("Latitude: " + loc.latitude);
                // console.log("Longitude: " + loc.longitude);
                // $("#location").html("<p>" + place + "<br>" + loc.latitude + "<br>" + loc.longitude + "</p>")
            }
        });

    });

});


$("#find-venue").on("click", function (event) {
    $('#location').empty();

    event.preventDefault();


    ZOMATO_URL = "https://developers.zomato.com/api/v2.1/search?lat=" + loc.latitude + "&lon=" + loc.longitude + "&radius=20000&sort=real_distance&order=asc&apikey=328747b9fe3568204c420f6a98d2be68";

    $.ajax({
        url: ZOMATO_URL,
        method: "GET",
        async: false,
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            autoList = [];
            p3 = '<option value="-1"></option>';

            for (var i = 0; i < data.restaurants.length; i++) {
                p3 += '<option value="' + data.restaurants[i].restaurant.name + '">' + data.restaurants[i].restaurant.name + '</option>';
                autoList += data.restaurants[i].restaurant.name + "<br>"


                var anchor = $("<a>");
                var mainDiv = $("<div>");
                var p = $("<p>");
                var priceRange = data.restaurants[i].restaurant.price_range;
                var span = $("<span>");
                var subDiv1 = $("<div>");
                var subDiv2 = $("<img>");

                anchor.append(data.restaurants[i].restaurant.name);
                anchor.attr("href", data.restaurants[i].restaurant.url);
                anchor.attr("target", "_blank");
                anchor.addClass("resName");
                subDiv1.append(data.restaurants[i].restaurant.location.address + "<br>");
                subDiv1.append("Cuisines: " + data.restaurants[i].restaurant.cuisines + "<br>");
                for (var cost = 0; cost < priceRange; cost++) {
                    span.append("$");
                }
                subDiv1.append("Cost: ", span);
                subDiv2.attr("src", data.restaurants[i].restaurant.featured_image);
                mainDiv.html(subDiv2);
                subDiv2.addClass("imgDisplay");
                p.append("<hr>");
                p.append(anchor);
                subDiv1.append(p);
                mainDiv.append(anchor);
                mainDiv.append(subDiv1);
                $("#location").append(mainDiv);

            }
        }
    });

});



