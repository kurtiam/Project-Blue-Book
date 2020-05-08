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
                // autoList = data._embedded.venues[i].name
                // autoList2 += autoList.name
                // console.log(autoList)
                $("input#search-textbox").autocomplete({
                    // source: [autoList]
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
$("#sel_user").on("change", function (event) {

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






$("#myList").on("change", function (event) {

    event.preventDefault();


    var ZOMATO_APIKEY = "85e3651bab1da1f9c3235bf3ef189884";
    var ZOMATO_URL = "https://developers.zomato.com/api/v2.1/search?count=20&lat=32.7767&lon=-96.803398&radius=5&sort=real_distance&order=asc&apikey=" + ZOMATO_APIKEY;

    $.ajax({
        url: ZOMATO_URL,
        method: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            var autoList = [];
            var p3 = '<option value="-1">Select Food Type</option>';

            for (var i = 0; i < data.restaurants.length; i++) {
                p3 += '<option value="' + data.restaurants[i].restaurant.cuisines + '">' + data.restaurants[i].restaurant.cuisines + '</option>';
                autoList += data.restaurants[i].restaurant.cuisines + "<br>"
                $("#sel_user").html(p3)


            }
        }
    });
});


$("#find-venue").on("click", function (event) {

    event.preventDefault();
    var foodType = "";
    place = $("#myList option:selected").text();
    var foodType = $('#sel_user option:selected').text()

    $("#location").html("<p>" + place + "<br>" + loc.latitude + "<br>" + loc.longitude + "<br>" + foodType + "</p>");
    console.log("Venue: " + place);
    console.log("Latitude: " + loc.latitude);
    console.log("Longitude: " + loc.longitude);
    console.log(foodType);

});