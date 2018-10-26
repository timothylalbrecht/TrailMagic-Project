
// Globals

var mapsAPIKey = "AIzaSyAyh_AifnsTFzQTcbGEcOWZSNLDlcrG5jg";
var lat = 0;
var long = 0;
var userZip = 0;
var trailName = [];
var trailLatLong = [];
var trailArray = [];
var mapArray = [];
var map;

$("#whatMagic").on("click", function() {
	$('.bg-modal').attr( "style", "display: flex" );
});
// document.getElementById('whatMagic').addEventListener("click", function() {
// 	document.querySelector('.bg-modal').style.display = "flex";
// });

$("#close").on("click", function() {
	$('.bg-modal').attr( "style", "display: none" );
});
// document.querySelector('.close').addEventListener("click", function() {
// 	document.querySelector('.bg-modal').style.display = "none";
// });

//populate USA coordinates in map on page load
function onload(){
    function initMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: { lat: 39.8283, lng: -98.5795 }
        });
    }
    initMap();
}
// Simple clear button to reset global variables and clear out weather and hiking data from tables
$("#clear").on("click", function () {      
    event.preventDefault();
    lat = 0;
    long = 0;
    userZip = 0;
    trailName = [];
    trailLatLong = [];
    trailArray = [];

    $("#table-data").empty();
    $("#weather-data").empty();

    function initMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: { lat: 39.8283, lng: -98.5795 }
        });
    }
    initMap();
});

// Simple 1 click entry to begin all ajax requests. All three rely on data from the previous to populate.
$("#submit").on("click", function () {
    var userZip = $("#add-zip").val().trim();
    console.log("Zipcode: " + userZip);
    event.preventDefault();
    var weatherAPIKey = "1ea7d1356516bbfed9e0beb0310c514f";
    var weatherQueryURL = "http://api.openweathermap.org/data/2.5/forecast?units=imperial&cnt=1&zip=" + userZip + ",us&APPID=" + weatherAPIKey;

    $.ajax({
        url: weatherQueryURL,
        method: "GET"
    }).then(function (response) {
        var latitude = response.city.coord.lat;
        var longitude = response.city.coord.lon;
        lat = latitude;
        long = longitude;
        console.log("---- Weather Data ----")
        console.log("Closest City: " + response.city.name);
        console.log("Lat/Long: " + response.city.coord.lat + ", " + response.city.coord.lon);
        console.log("Temp: " + Math.round(response.list[0].main.temp) + ' degrees');
        console.log("Current Description: " + response.list[0].weather[0].main + " with a " + response.list[0].weather[0].description);
        console.log("");

        $("#weather-data").append(
            "<tr><td>" + response.city.name + "</td>" +
            "<td>" + Math.round(response.list[0].main.temp) + "</td>" +
            "<td>" + response.list[0].weather[0].description + "</td>" +
            "<td>" + response.list[0].main.humidity + "</td></tr>"
        );

        getTrails();
    });
});

function getTrails() {
    // console.log("lat: " + lat + " long: " + long);
    var hikingAPIKey = "200375137-39b4bee97d2d4fcabc2616e4b20cdc38";
    var hikingQueryURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&maxDistance=50&key=" + hikingAPIKey;

    $.ajax({
        url: hikingQueryURL,
        method: "GET"
    }).then(function (response) {

        for (var i = 0; i < response.trails.length; i++) {

            // console.log("---- Hiking Data ----");
            // console.log("Trail Name: " + response.trails[i].name);
            // console.log("Trail Length: " + response.trails[i].length + " miles");
            // console.log("Difficulty: " + response.trails[i].difficulty.replace(/greenBlue/,"Easy").replace(/green/,"Moderate").replace(/blueBlack/,"Intermediate").replace(/blue/,"Difficult").replace(/black/,"Expert"));
            // console.log("Average Rating: " + response.trails[i].stars + " stars per " + response.trails[i].starVotes + " hikers");
            // console.log("Trail Conditions: " + response.trails[i].conditionStatus);
            // console.log("Condition Description: " + response.trails[i].conditionDetails);
            // console.log(response.trails[i].latitude);
            // console.log("");

            trailName.push(response.trails[i].name);
            trailLatLong.push({
                lat: response.trails[i].latitude,
                lng: response.trails[i].longitude
            });

            trailArray.push({
                name: response.trails[i].name,
                length: response.trails[i].length,
                difficulty: response.trails[i].difficulty.replace(/greenBlue/,"Easy").replace(/green/,"Moderate").replace(/blueBlack/,"Challenging").replace(/blue/,"Intermediate").replace(/black/,"Difficult"),
                rating: response.trails[i].stars,
                votes: response.trails[i].starVotes,
                description: response.trails[i].summary,
                latitude: response.trails[i].latitude,
                longitude: response.trails[i].longitude
            });

            $("#table-data").append(
                "<tr><td>" + trailArray[i].name + "</td>" +
                "<td>" + trailArray[i].length + "</td>" +
                "<td>" + trailArray[i].difficulty + "</td>" +
                "<td>" + trailArray[i].rating + "</td>" +
                "<td>" + trailArray[i].votes + "</td></tr>"
            );

            // trailName.push(response.trails[i].name);
            // trailLength.push(response.trails[i].length);
            // trailDiff.push(response.trails[i].difficulty);
            // trailRating.push(response.trails[i].rating);
            // trailDescription.push(response.trails[i].summary);
        }
    console.log(trailArray);
    //console.log(trailLatLong);
    initMap();
    getMarkers();

    });
    

}

function initMap() {
    // var myLatLng = {lat: 35.537185118320544, lng: -82.68171304755492};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: lat, lng: long }
    });
}


function getMarkers() {
    //console.log(trailLatLong);
    //console.log(trailLatLong.length)
    for (i = 0; i < trailLatLong.length; i++) {
        var mapLatLong = (trailLatLong[i]);
        //console.log(trailLatLong[i])
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(mapLatLong),
            map: map,
            title: trailName[i]
        });
    }
}

