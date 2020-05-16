var lat = "";
var lon = "";
var cityNow = null;

$(document).ready(function () {
    // Get value on button click and show alert
    $("#city").click(function () {
        cityNow = $("#city-search").val();
        console.log(cityNow);
        citySearch()

    });
});

getLocation();

function getLocation() {
    // alert("Location");

    x = document.getElementById("current");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }


    function showPosition(position) {
        x.innerHTML = "Latitude: " + position.coords.latitude +
            "<br>Longitude: " + position.coords.longitude;
        lat = position.coords.latitude
        lon = position.coords.longitude

        position.coords.latitude + "+" + position.coords.longitude
        console.log("Current Latitude: " + lat);
        console.log("Current Longitude: " + lon);
        currentCity()

    }
};

function currentCity() {

    loc = lat + "+" + lon
    latlong = lat + "," + lon
    latlon = lat + '&lon=' + lon

    // console.log(loc); WORKS!
    locApiKey = "&key=a5817602162f42e8a517aec3a58d5108"
    locUrl = "https://api.opencagedata.com/geocode/v1/json?q="

    return $.ajax({
        type: "GET",
        url: locUrl + loc + locApiKey,
        findCity: "{}",
        async: true,
        success: function (findCity) {


            town = findCity.results[0].components.town
            city = findCity.results[0].components.city
            state = findCity.results[0].components.state_code
            console.log(city);

            if (city == null) {
                local = town
            }
            else { local = city };

            $('#city-search').attr("placeholder", "Current City is " + local + "," + state);

            searchIt()

        }

    });
}


function citySearch() {

    locApiKey = "&key=a5817602162f42e8a517aec3a58d5108"
    locUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + cityNow + locApiKey
    return $.ajax({
        type: "GET",
        url: locUrl,
        findCity: "{}",
        async: true,

        success: function (findCity) {

            // console.log(findCity.results[0].geometry.lat); WORKS!
            lat = findCity.results[0].geometry.lat
            lon = findCity.results[0].geometry.lng
            city = findCity.results[0].components.city //may need to add logic for .town
            state = findCity.results[0].components.state_code
            latlong = lat + ',' + lon
            searchIt()
        }

    });

}




$("#city-search").change(function () {
    $('#location').empty();

    ZOMATO_URL1 = "https://developers.zomato.com/api/v2.1/collections?lat=" + lat + "&lon=" + lon + "&count=15&apikey=328747b9fe3568204c420f6a98d2be68";
    $.ajax({
        url: ZOMATO_URL1,
        method: "GET",
        async: false,
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            for (var i = 0; i < data.collections.length; i++) {

                var subDivF = $("<div>");
                var anchorE = $("<a>");
                var img = $("<img>");
                var newDiv = $("<div>");

                anchorE.append(data.collections[i].collection.title + "<br>");
                subDivF.append(data.collections[i].collection.description);
                subDivF.addClass("trendingDescription");
                anchorE.addClass("trendingTitle");
                anchorE.attr("href", data.collections[i].collection.url);
                img.attr("src", data.collections[i].collection.image_url);
                img.addClass("trendingImage");
                newDiv.addClass("img");

                newDiv.append(anchorE);
                newDiv.append(subDivF);
                newDiv.append(img);


                $("#location").append(newDiv);

            }


        }

    });

});



function zPage2() {

    ZOMATO_URL2 = "https://developers.zomato.com/api/v2.1/search?&start=20&count=20&lat=" + loc.latitude + "&lon=" + loc.longitude + "&radius=5&sort=real_distance&order=asc&apikey=&apikey=328747b9fe3568204c420f6a98d2be68";
    $.ajax({
        url: ZOMATO_URL2,
        method: "GET",
        async: true,
        dataType: "json",
        // timeout: 5000,
        success: function (data) {
            p3 = '<option value="-1"></option>';
            autoList = [];


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
                // console.log(data.restaurants[i].featured_image);

                subDiv2.attr("onError", "this.style.display='none'");

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

}



function zPage3() {

    ZOMATO_URL3 = "https://developers.zomato.com/api/v2.1/search?&start=40&count=20&lat=" + loc.latitude + "&lon=" + loc.longitude + "&radius=5&sort=real_distance&order=asc&apikey=&apikey=328747b9fe3568204c420f6a98d2be68";
    $.ajax({
        url: ZOMATO_URL3,
        method: "GET",
        async: true,
        dataType: "json",
        // timeout: 5000,
        success: function (data) {
            p3 = '<option value="-1"></option>';
            autoList = [];


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
                // console.log(data.restaurants[i].featured_image);

                subDiv2.attr("onError", "this.style.display='none'");

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

}


function zPage4() {

    ZOMATO_URL4 = "https://developers.zomato.com/api/v2.1/search?&start=60&count=20&lat=" + loc.latitude + "&lon=" + loc.longitude + "&radius=5&sort=real_distance&order=asc&apikey=&apikey=328747b9fe3568204c420f6a98d2be68";
    $.ajax({
        url: ZOMATO_URL4,
        method: "GET",
        async: true,
        dataType: "json",
        // timeout: 5000,
        success: function (data) {
            p3 = '<option value="-1"></option>';
            autoList = [];


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
                // console.log(data.restaurants[i].featured_image);

                subDiv2.attr("onError", "this.style.display='none'");

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

}




