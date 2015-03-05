var wathID =null;

window.addEventListener('load', function () {
        document.addEventListener("deviceReady", deviceReady, false);
}, false);

function deviceReady() {
    try {
    }
    catch (ex) {
        alert("deviceReady error: "+ex.message);
    }
}

function getLocation(activo) {
try {

    //alert("getLocation3");

    var locOptions = {
        maximumAge: 0,
        timeout: 100,
        enableHighAccuracy: activo
    };
    //get the current location
    wathID = navigator.geolocation.watchPosition(onLocationSuccess, onLocationError, locOptions);
    //Clear the current location while we wait for a reading
    document.getElementById("locationInfo").innerHTML = "Reading location...";
}
    catch (ex){
        alert(ex.message);
    }
}

function onLocationSuccess(loc) {
    try{

    //alert("onLocationSuccess");
    //We received something from the API, so first get the
    // timestamp in a date object so we can work with it
    var d = new Date(loc.timestamp);
    //Then replace the page's content with the current
    // location retrieved from the API
        document.getElementById("locationInfoAnt").innerHTML = document.getElementById("locationInfo").innerHTML;

        document.getElementById("locationInfo").innerHTML='<b>Location</b><hr /><b>Latitude</b>: ' + loc.coords.latitude + '<br /><b>Longitude</b>: ' + loc.coords.longitude + '<br /><b>Altitude</b>: ' + loc.coords.altitude + '<br /><b>Accuracy</b>: ' + loc.coords.accuracy + '<br /><b>Altitude Accuracy</b>: ' + loc.coords.altitudeAccuracy + '<br /><b>Heading</b>: ' + loc.coords.heading + '<br /><b>Speed</b>: ' + loc.coords.speed + '<br /><b>Timestamp</b>: ' + d.toLocaleString();

    var posAlta = new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);
    var mapOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        accuracy: 5,
        enabledHighAccuracy: true,
        overviewMapControl: false,
        panControl: false,
        rotateControl: false,
        scaleControl: false,
        zoomControl: false,
        streetViewControl: false,
        center: posAlta,
        maximumAge: 0//,timeout:1000
    };
    mapAlta = new google.maps.Map(document.getElementById('divMapa'), mapOptions);

    var marcador = new google.maps.Marker({
        position: posAlta,
        map: mapAlta
    });

    }
    catch(ex){
        alert(ex.message);
    }
}

function onLocationError(e) {
 alert("onLocationError error: #" + e.code + "\n" + e.message);
}

function callSuccess(data) {
    var swicthSuccess;
    if (data.success == true) {
        alert("GPS is enabled");
    } else {
        alert("GPS is not enabled");
    }
};

function callFailure(data) {
    alert("fail to call plugin:"+data.message);
};


function test(){
    try{
       DiagnostiC = cordova.require('cordova/plugin/diagnostic');
    }
    catch (ex){
        alert("test error 1: "+ex.message);
    }
    try{
        DiagnostiC.prototype.isLocationEnabled(callSuccess,callFailure)
    }
    catch (ex){
        alert("test error 2: "+ex.message);
    }
    try{
        DiagnostiC.isLocationEnabled(callSuccess,callFailure)
    }
    catch (ex){
        alert("test error 3: "+ex.message);
    }
    try{
        cordova.exec(callSuccess,
            callFailure,
            'Diagnostic',
            'isLocationEnabled',
            []);    }
    catch (ex){
        alert("test error 4: "+ex.message);
    }
}
    function test1() {
    try {

        alert("test")
        // To know if the location is turned ON/OFF and if the app is allowed to use it.
        window.plugins.diagnostic.isLocationEnabled(locationEnabledSuccessCallback, locationEnabledErrorCallback);

        function locationEnabledSuccessCallback(result) {
            alert("locationEnabledSuccessCallback");
            if (result) {
                //alert("Location ON");
                document.getElementById('location').innerHTML = 'ON';

                //alert("Location Setting ON");
                document.getElementById('locationSetting').innerHTML = 'ON';

                //alert("Auth Location ON");
                document.getElementById('locationAuthorization').innerHTML = 'ON';

                function locationAuthorizedErrorCallback(error) {
                    alert("locationAuthorizedErrorCallback error: #" + error);
                }
            }
            else {
                //alert("Location OFF");
                document.getElementById('location').innerHTML = 'OFF';
                // To know if the location is turned ON/OFF.
                window.plugins.diagnostic.isLocationEnabledSetting(locationEnabledSettingSuccessCallback, locationEnabledSettingErrorCallback);

                function locationEnabledSettingSuccessCallback(result) {
                    if (result) {
                        //alert("Location Setting ON");
                        document.getElementById('locationSetting').innerHTML = 'ON';
                    }
                    else {
                        //alert("Location Setting OFF");
                        document.getElementById('locationSetting').innerHTML = 'OFF';
                    }
                }

                function locationEnabledSettingErrorCallback(error) {
                    alert("locationEnabledSettingErrorCallback error: #" + error);
                }

                // To know if the app is allowed to use it.
                window.plugins.diagnostic.isLocationAuthorized(locationAuthorizedSuccessCallback, locationAuthorizedErrorCallback);

                function locationAuthorizedSuccessCallback(result) {
                    if (result) {
                        //alert("Auth Location ON");
                        document.getElementById('locationAuthorization').innerHTML = 'ON';
                    }
                    else {
                        //alert("Auth Location OFF");
                        document.getElementById('locationAuthorization').innerHTML = 'OFF';
                    }
                }

                function locationAuthorizedErrorCallback(error) {
                    alert("locationAuthorizedErrorCallback error: #" + error);
                }
            }
        }

        function locationEnabledErrorCallback(error) {
            alert("locationEnabledErrorCallback error: #" + error);
        }


        // To know if the WiFi is turned ON/OFF.
        window.plugins.diagnostic.isWifiEnabled(wifiEnabledSuccessCallback, wifiEnabledErrorCallback);

        function wifiEnabledSuccessCallback(result) {
            if (result) {
                //alert("WiFi ON");
                document.getElementById('wifi').innerHTML = 'ON';
            }
            else {
                //alert("WiFi OFF");
                document.getElementById('wifi').innerHTML = 'OFF';
            }
        }

        function wifiEnabledErrorCallback(error) {
            alert("wifiEnabledErrorCallback error: #" + error);
        }

        // To know if the camera is enabled.
        window.plugins.diagnostic.isCameraEnabled(cameraEnabledSuccessCallback, cameraEnabledErrorCallback);

        function cameraEnabledSuccessCallback(result) {
            if (result) {
                //alert("Camera ON");
                document.getElementById('camera').innerHTML = 'ON';
            }
            else {
                //alert("Camera OFF");
                document.getElementById('camera').innerHTML = 'OFF';
            }
        }

        function cameraEnabledErrorCallback(error) {
            alert("cameraEnabledErrorCallback error: #" + error);
        }
    }
    catch(ex) {
        alert("test error: #" +ex.message);
    }

}

function ObtenerTelefono()
{
    try{
        var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
        telephoneNumber.get(ObtenerTelefonoOK,ObtenerTelefonoError );
    }
    catch(ex) {
        alert("ObtenerTelefono error: " +ex.message);
    }
}
function ObtenerTelefonoOK(result)
{
    try{
        alert("Teléfono: "+ result);
    }
    catch(ex) {
        alert("ObtenerTelefonoOK error: " +ex.message);
    }
}
function ObtenerTelefonoError(error)
{
    try{
        alert("Error: "+error);
    }
    catch(ex) {
        alert("ObtenerTelefonoError error: " +ex.message);
    }
}

function VerMapa(loc){
    try {

        var posAlta = new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);
        var mapOptions = {
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            accuracy: 5,
            enabledHighAccuracy: true,
            overviewMapControl: false,
            panControl: false,
            rotateControl: false,
            scaleControl: false,
            zoomControl: false,
            streetViewControl: false,
            center: posAlta,
            maximumAge: 0//,timeout:1000
        };
        mapAlta = new google.maps.Map(document.getElementById('divMapa'), mapOptions);

        var marcador = new google.maps.Marker({
            position: posAlta,
            map: mapAlta
        });

    }
    catch(ex){
        alert("VerMapa "+ex.message);
    }
}

function ObtenerPosicion(activo){
    var posOptions={
        maximumAge:100,
        timeout:20000,
        enableHighAccuracy:activo
    };

    navigator.geolocation.getCurrentPosition(posicion_ok, posicion_error, posOptions);
}

function posicion_error(error)
{
    switch(error.code)
    {
        case 1: alert(error.code+"-"+ error.message+" latitud: "+ position.coords.latitude);
            break;

        case 2: alert(error.code+"-"+ error.message+" No podemos encontrar localizaión verifica que la tienes activada en tu dispositivo");
            break;

        case 3: alert(error.code+"-"+ error.message+" Tiempo de espera agotado para encontrar tu localización vuelve a entrar en la app");
            break;

        default: alert(error.code+"-"+ error.message+" No podemos detectar tu localización, comprueba que tienes el GPS activado en tu dispositivo");
            break;
    }
}

function posicion_ok(position) {
    if (position.coords.latitude != null) {
        VerMapa(position);
    }
    else{
        alert("No ha devuelto posición");
    }

}