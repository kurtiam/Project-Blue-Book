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
            if (town === "undefined") {
                local = city
            }
            else { local = town };

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