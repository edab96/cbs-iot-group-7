/*
Credentials otbained from Backend SigFox / Group / API Access
The API Access should have reading permissions for the profile "message"
It is important you specify your Device ID
*/

var credentials = {
    apiLogin: "5eb94efd25643251776126be",
    password: "89aba7cf56b4d821e2dce3b0c4fe4039",
    myDeviceId: "1D8CC3"
}

// Do not change the endpoint and path for the request
var endpoint = "https://api.sigfox.com/v2/devices/";
var path = "/messages";

var authorizationBasic = window.btoa(credentials.apiLogin + ':' + credentials.password);
var request = new XMLHttpRequest();
var response;

// SigFox messages 
var events = [];

// Datapoints for charts
var datapoints = {
    temperature: [],
    moisture: [],
    date: []
}

$(document).ready(function () {
    $(".load-data").click(function () {
        getPlantData();
    });

    getPlantData();

});

function getPlantData() {
    request.open('Get', endpoint + credentials.myDeviceId + path, true, credentials.apiLogin, credentials.password);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.setRequestHeader('Authorization', 'Basic ' + authorizationBasic);
    request.setRequestHeader('Accept', 'application/json');
    request.send(null);
}

function parsePayload(payload) { // Takes the SigFox event as an input and returns an object with temperature, moisture and date of the event
    var date = new Date(payload.time);

    // MAKES THE DATE ON THE GRAPH DATE/MONTH
        // var m = date.getUTCMonth();
        // m++;
        // var d = date.getUTCDate() + "/" + m;

    // MAKES DATE ON THE GRAPH HOUR:MINUTE
        var t = date.getUTCHours();
        t +=2;
        var d = t + ":"+ date.getUTCMinutes();
        console.log(d)
  


    // Parse the hexadecimal data for temperature and moisture
    var temperature = parseInt(payload.data.slice(0, 2), 16);
    var moisture = parseInt((payload.data.slice(4, 6) + payload.data.slice(2, 4)), 16);

    return {
        temperature: temperature,
        moisture: moisture,
        date: d
    }
}

request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
        response = JSON.parse(request.responseText)
        console.log(response)

        for (i = 0; (i < (response.data.length - 1) && i < 5); i++) {
            events.push(parsePayload(response.data[i]))
        }

        events.forEach(function (event) {
            datapoints.temperature.push(event.temperature);
            datapoints.moisture.push(event.moisture);
            datapoints.date.push(event.date);
        })

        new Chartist.Line('.temperature-graph', {
            labels: datapoints.date,
            series: [
                datapoints.temperature
            ]
        }, {
            low: 10,
            showArea: true
        });

        new Chartist.Line('.moisture-graph', {
            labels: datapoints.date,
            series: [
                datapoints.moisture
            ]
        }, {
            low: 0,
            showArea: true,
            
        });

        var latestData = parsePayload(response.data[0]);
        console.log(latestData);



        // Update the app content with the parsed values and the date
        $('#temperature-data').html(latestData.temperature + "°C");
        $('#moisture-data').html(latestData.moisture + "%");
        $('#latest-update-data').html(latestData.date);

    }
};
