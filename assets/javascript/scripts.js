var apiLogin = "5e99586c2564325c7bf94be0";
var password = "c67f888a300313e72df4c79836869ef8";
var myDeviceId = "1D88C8";
var getMessagesURL1 = "https://api.sigfox.com/v2/devices/";
var getMessagesURL2 = "/messages";

var authorizationBasic = window.btoa(apiLogin + ':' + password);

var request = new XMLHttpRequest();
var response;


$( document ).ready(function() {
    $(".load-data").click(function () {
        getPlantData();
    });
    
});

function getPlantData() { 
    request.open('Get', getMessagesURL1 + myDeviceId + getMessagesURL2 , true, apiLogin, password);
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
       $('#temperature-data').html("16" + "°C");
       $('#moisture-data').html("45");
       console.log(latestEvent);
       messageDate = new Date(latestEvent.time);
       $('#latest-update-data').html(messageDate);

       

    }
};
