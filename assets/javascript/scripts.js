// Do not change the endpoint and path for the request
var endpoint = "https://api.sigfox.com/v2/devices/";
var path = "/messages";

var authorizationBasic = window.btoa(credentials.apiLogin + ':' + credentials.password);
var request = new XMLHttpRequest();
var response;

// SigFox messages 
var events = [];

var tempChart;
// Datapoints for charts
var datapoints = {};

$(document).ready(function () {		
$("#device-id-label").html(credentials.myDeviceId);
	getPlantData();
	
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

function parsePayload(payload) { // Takes the SigFox event as an input and returns an object with temperature, moisture and date of the event
    var date = new Date(payload.time);

    // Parse the hexadecimal data for temperature and moisture
    var temperature = parseInt(payload.data.slice(0, 2), 16);
    var moisture = parseInt((payload.data.slice(4, 6) + payload.data.slice(2, 4)), 16);
	console.log(temperature);
    return {
        temperature: temperature,
        moisture: moisture,
        date: date.getHours() + ':' + date.getMinutes()
    }
}

request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
        response = JSON.parse(request.responseText)
        console.log(response)
		
		var events = [];
        for (i = 0; (i < (response.data.length - 1) && i < 5); i++) {
            events.unshift(parsePayload(response.data[i]))
        }
		
		var datapoints = {
			temperature: [],
			moisture: [],
			date: []
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
            low: 0,
            showArea: true,
			plugins: [
				Chartist.plugins.tooltip()
			  ]
        });
       

        new Chartist.Line('.moisture-graph', {
            labels: datapoints.date,
            series: [
                datapoints.moisture
            ]
        }, {
            low: 0,
            showArea: true,
			plugins: [
				Chartist.plugins.tooltip()
			  ]
        });

		
        var latestData = parsePayload(response.data[0]);
        console.log(latestData);



        // Update the app content with the parsed values and the date
        $('#temperature-data').html(latestData.temperature + "°C");
        $('#moisture-data').html(latestData.moisture + "%");
        $('#latest-update-data').html(latestData.date);
		
		if (latestData.temperature > 15){
			$('.high-temp-message').show();
		}
		else {
			$('.low-temp-message').show();
		}
		
		if (latestData.moisture > 50){
			$('.high-moisture-message').show();
		}
		else {
			$('.low-moisture-message').show();
		}

    }
};
