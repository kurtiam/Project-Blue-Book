var page = 0;

//popluate venues within 25 miles of DFW area. Each page can only show 200 results. Will need to do a 2nd api call and append  


$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/venues.json?&latlong=32.79067196,-96.81081803&dmaId=261&apikey=IbUXFudvQmR2gZo5kLDiuVkaZTavZiEV&sort=name,asc&radius=25&unit=miles&size=200&page=0",
        async: false,
        dataType: "json",
        success: function (data) {
            v1List = [];
            p0 = '<option value="-1">Select Venue</option>';
            for (var i = 0; i < data._embedded.venues.length; i++) {
                p0 += '<option value="' + data._embedded.venues[i].name + '">' + data._embedded.venues[i].name + '</option>';
                v1List += data._embedded.venues[i].name + "<br>"
                $("#myList").html(p0)

                // console.log(p0);
            }
        }

    });
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/venues.json?&latlong=32.79067196,-96.81081803&dmaId=261&apikey=IbUXFudvQmR2gZo5kLDiuVkaZTavZiEV&sort=name,asc&radius=25&unit=miles&size=200&page=1",
        async: false,
        timeout: 30000,
        dataType: "json",
        success: function (data) {
            var vList = [];
            var p1 = '<option value="-1"></option>';
            for (var i = 0; i < data._embedded.venues.length; i++) {
                p1 += '<option value="' + data._embedded.venues[i].name + '">' + data._embedded.venues[i].name + '</option>';
                vList += data._embedded.venues[i].name + "<br>"
                $(p1).appendTo("#myList");

            }

            // console.log(data._embedded.venues.length);
            // console.log(vList);
            // $('#venue-view').html(p1)

        }



    });

});

// 2nd api call for venues over 200 teh append to #mylist selection in idndex.

// $(document).ready(function () {
//     $.ajax({
//         type: "GET",
//         url: "https://app.ticketmaster.com/discovery/v2/venues.json?&latlong=32.79067196,-96.81081803&dmaId=261&apikey=IbUXFudvQmR2gZo5kLDiuVkaZTavZiEV&sort=name,asc&radius=25&unit=miles&size=200&page=1",
//         asunc: true,
//         dataType: "json",
//         success: function (data) {
//             var vList = [];
//             var p1 = '<option value="0"></option>';
//             for (var i = 0; i < data._embedded.venues.length; i++) {
//                 p1 += '<option value="' + data._embedded.venues[i].name + '">' + data._embedded.venues[i].name + '</option>';
//                 vList += data._embedded.venues[i].name + "<br>"
//                 $(p1).appendTo("#myList");

//             }

//             // console.log(data._embedded.venues.length);
//             // console.log(vList);
//             // $('#venue-view').html(p1)

//         }



//     }, 100000);

// });
// will find the above selected venues location (lat and long) and store in variables: loc.latitude and loc.longitude
$("#find-venue").on("click", function (event) {

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
                var loc = data._embedded.venues[0].location

                // console.log(data._embedded.venues.length);
                // console.log(loc);
                console.log("Venue: " + place);
                console.log("Latitude: " + loc.latitude);
                console.log("Longitude: " + loc.longitude);


                $("#location").html("<p>" + place + "<br>" + loc.latitude + "<br>" + loc.longitude + "</p>")
            }
        });

    });

});

