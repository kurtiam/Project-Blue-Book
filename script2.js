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

        event.preventDefault();

        // $("#location").html("<p>" + place + "<br>" + loc.latitude + "<br>" + loc.longitude + "</p>");
        // console.log(foodType);


        // ZOMATO_URL = "https://developers.zomato.com/api/v2.1/search?lat=" + loc.latitude + "&lon=" + loc.longitude + "&radius=20000&sort=real_distance&order=asc&apikey=328747b9fe3568204c420f6a98d2be68";

        // $.ajax({
        //     url: ZOMATO_URL,
        //     method: "GET",
        //     async: false,
        //     dataType: "json",
        //     timeout: 5000,
        //     success: function (data) {
        //         autoList = [];
        //         p3 = '<option value="-1"></option>';

        //         for (var i = 0; i < data.restaurants.length; i++) {
        //             p3 += '<option value="' + data.restaurants[i].restaurant.name + '">' + data.restaurants[i].restaurant.name + '</option>';
        //             autoList += data.restaurants[i].restaurant.name + "<br>"
        //             // $("#location").html(p3)


        //         }
        //     }
        // });


        ZOMATO_URL2 = "https://developers.zomato.com/api/v2.1/search?count=20&lat=" + loc.latitude + "&lon=" + loc.longitude + "&radius=5&sort=real_distance&order=asc&apikey=&apikey=328747b9fe3568204c420f6a98d2be68";
        $.ajax({
            url: ZOMATO_URL2,
            method: "GET",
            async: false,
            dataType: "json",
            timeout: 5000,
            success: function (data1) {
                autoList1 = [];
                p4 = '<option value="-1">Select Food Type</option>';


                for (var i = 0; i < data1.restaurants.length; i++) {
                    p4 += '<option value="' + data1.restaurants[i].restaurant.cuisines + '">' + data1.restaurants[i].restaurant.cuisines + '</option>';
                    autoList1 += data1.restaurants[i].restaurant.cuisines + "<br>"
                    $("#sel_user").html(p4)

                }
                [].slice.call(sel_user.options)
                    .map(function (a) {
                        if (this[a.innerText]) {
                            sel_user.removeChild(a);
                        } else {
                            this[a.innerText] = 1;
                        }
                    }, {});

            }

        });

        ZOMATO_URL3 = "https://developers.zomato.com/api/v2.1/cuisines?city_id=276&lat=" + loc.lat + "&lon=" + loc.longitude + "&apikey=328747b9fe3568204c420f6a98d2be68";
        $.ajax({
            url: ZOMATO_URL3,
            method: "GET",
            async: false,
            dataType: "json",
            timeout: 5000,
            success: function (data3) {
                for (var i = 0; i < data3.cuisines.length; i++) {

                    var option = $("<option>");
                    option.val(data3.cuisines[i].cuisine.cuisine_name);
                    option.text(data3.cuisines[i].cuisine.cuisine_name);
                    option.attr("data-cuisineID", data3.cuisines[i].cuisine.cuisine_id);
                    $("#sel_user").append(option);

                }

            }

        });

    });


    $("#sel_user").on("change", function (event) {
        event.preventDefault();

        cuisine = $("sel_user option:selected").val();
        cuisineID = $("sel_user option:selected").attr("data-cuisineID");

        ZOMATO_URL4 = "https://developers.zomato.com/api/v2.1/search?count=20&lat=" + loc.latitude + "&lon=" + loc.longitude + "&radius=5&sort=real_distance" + "&cuisines=" + cuisineID + "&order=asc&apikey=328747b9fe3568204c420f6a98d2be68";

        $.ajax({
            url: ZOMATO_URL4,
            method: 'GET',
            dataType: "json",
            data: {
                cuisines: cuisineID
            },
            processData: true,
            success: function (data2) {

                for (var i = 0; i < data2.restaurants.length; i++) {
                    var anchor = $("<a>");
                    var mainDiv = $("<div>");
                    var p = $("<p>");
                    var priceRange = data2.restaurants[i].restaurant.price_range;
                    var span = $("<span>");
                    var subDiv1 = $("<div>");
                    var subDiv2 = $("<div>");
                    var subDiv3 = $("<div>");

                    subDiv1.append(data2.restaurants[i].restaurant.name);
                    subDiv1.addClass("venueName");
                    subDiv2.append(data2.restaurants[i].restaurant.location.city);
                    subDiv2.addClass("venueCity");
                    subDiv3.append(data2.restaurants[i].restaurant.location.address + "<hr>");
                    p.append("Cuisines: " + data2.restaurants[i].restaurant.cuisines + "<br>");
                    for (var cost = 0; cost < priceRange; cost++) {
                        span.append("$");
                    }
                    p.append("Cost: ", span);
                    anchor.attr("href", data2.restaurants[i].restaurant.url);
                    anchor.attr("target", "_blank");
                    anchor.text("Visit Zomato Restaurant Page");
                    p.append("<br>");
                    p.append(anchor);
                    subDiv3.append(p);
                    mainDiv.append(subDiv1);
                    mainDiv.append(subDiv2);
                    mainDiv.append(subDiv3);
                    mainDiv.addClass("venues");

                    $("#location").append(mainDiv);


                }
            }

        })


    })

});