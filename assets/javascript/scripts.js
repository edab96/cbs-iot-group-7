/*
Credentials otbained from Backend SigFox / Group / API Access
The API Access should have reading permissions for the profile "message"
It is important you specify your Device ID
*/

var credentials = {
    apiLogin: "5e9d7401e833d96cf4710c02",
    password: "fab8b7cf61522b1a60ada26c06a32a22",
    myDeviceId: "1D806D"
}

// Do not change the endpoint and path for the request
var endpoint = "https://api.sigfox.com/v2/devices/";
var path = "/messages";

var authorizationBasic = window.btoa(credentials.apiLogin + ':' + credentials.password);
var request = new XMLHttpRequest();
var response;


$(document).ready(function () {
    $(".load-data").click(function () {
        getPlantData();
    });

});

function getPlantData() {
    request.open('Get', endpoint + credentials.myDeviceId + path, true, credentials.apiLogin, credentials.password);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.setRequestHeader('Authorization', 'Basic ' + authorizationBasic);
    request.setRequestHeader('Accept', 'application/json');
    request.send(null);
}

request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
        response = JSON.parse(request.responseText)
        console.log(response)

        var latestEvent = response.data[0];
        console.log(latestEvent);

        messageDate = new Date(latestEvent.time);

        // Parse the hexadecimal data for temperature and moisture
        var payload = latestEvent.data;
        var temperature = parseInt(payload.slice(0, 2), 16);
        var moisture = parseInt((payload.slice(4, 6) + payload.slice(2, 4)), 16);

        // Update the app content with the parsed values and the date
        $('#temperature-data').html(temperature + "°C");
        $('#moisture-data').html(moisture);
        $('#latest-update-data').html(messageDate);

    }
};
