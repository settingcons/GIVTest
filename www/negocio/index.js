// funciones COMUNES -----------------------------------------------------------------------
var pictureSource;
var destinationType;

var posicionGPS = null;
var wathID=null;
var GPSActivado=false;
var GPSErrorNum = 0;

var bAbroPagina = true;
var aGlobalCarrers = null;
var aCarrers = null;
var aConfig = null;


var sId = '';
var sDescItem = '';
var dicImagenes = {};
var dicAyuda = {};
var dicItem = {};
var nImgTotal = 0;
//hgs abans 5 Si disminueixo surten les fletxes
var nImgPorPanel = 10;
var nPrimeraImgVisible = 1;
var nNumCalle = 0;
var bPrimera;

var TipoInciSel = "";
// -------- Al INICIAR -----------------------------------------------------------------------
//window.addEventListener('load', function () {
//    alert('1');
//    if (phoneGapRun()) {
//        document.addEventListener("deviceReady", deviceReady, false);
//    } else {
//        deviceReady();
//    }
//}, false);


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        deviceReady();
    }
};


function deviceReady() {
    var v_error='';
    try {
        document.addEventListener("backbutton", handleBackButton, false);

        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;

        if (phoneGapRun()) {
            pictureSource = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;
        }
        else
        {
            v_error='phonegap no soportat'
        }

        //Hay localstorage ?
        if (!$.jStorage.storageAvailable()) {
            v_error="exception obrint l'app: localstorage no soportat";
        }
        else {
            try {
                cargaConfigEnArray();
            }
            catch (e) { v_error='exception carregant llista de carrers : ' + e.message; }
        }
    }
    catch (ex) {
        v_error="exception obrint l'app: "+ex.message;
    }
    if(v_error != ''){
        mensaje(v_error,"error");
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        }
    }

    getLocation();
    GPSEstaActivado();

    try {
        enviamentDePendents(true);
    }
    catch (ex){}
    if (SinDatosCiudadano())
    {
        abrirPagina("pageIdentificacion", false);
    }
    else
    {
        abrirPagina("pageTipoIncidencia", false);
    }
}
function handleBackButton() {
    try {
        //alert($.mobile.activePage.attr('id'));
        if ($.mobile.activePage.attr('id') == 'pageIndex') {
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        }
        else if ($.mobile.activePage.attr('id') == 'pageTipoIncidencia') {
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        }
        else if ($.mobile.activePage.attr('id') == 'pageIdentificacion' && SinDatosCiudadano()) {
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        }
        else{
            if (navigator.app) {
                navigator.app.backHistory();
            } else if (navigator.device) {
                navigator.device.backHistory();
            }
            else {
                window.history.back();
            }
        }
    }
    catch (ex) {
        //alert(ex.message);
    }
}

// -------- COMUNES -----------------------------------------------------------------------

function abrirPagina(sPag, bComprueba) {

    if (bComprueba && SinDatosCiudadano()) {
            mensaje("El telefon es obligatori per utilitzar aquesta app","error")
   }
    else
    {
        $.mobile.changePage('#' + sPag, {
            transition: "none"
        });

        switch (sPag) {
            case 'pageTipoIncidencia':
                $.doTimeout(1500, inicioPaginaTipoIncidencia());
                break;
            case 'pageIdentificacion':
                $.doTimeout(1500, inicioPaginaIdentificacion());
                break;
            case 'pageDatosIncidencia':
                $.doTimeout(1500, inicioPaginaDatosIncidencia());
                break;
            case 'pageInfoEnvio':
                $.doTimeout(1500, inicioPaginaInfoEnvio());
                break;
            case 'pageConsultaIncidencias':
                $.doTimeout(1000, inicioPaginaConsultaIncidencias());
                break;
            case 'pageConsultaIncidenciasFicha':
                break;
            case 'pageConsultaIncidenciasMapa':
                $.doTimeout(1000, mostrarEnPlano());
                break;
            case 'pageZoomFoto' :
                var imagen = document.getElementById('imgZoomFoto');
                imagen.style.display = 'block';
                imagen.src = "data:image/jpeg;base64," + sFoto;
                break;
        }
    }
}

function limpiaVariables(sPag){
    switch(sPag)
    {
        case 'pageNuevaIncidencia' :
            sFoto = '';
            sDireccionAlta = '';
            posAlta = '';
            mapAlta = null;
            $('#IdItem').text('');
            $('#labelItem').text('');
            $('#textareaComentari').val('');
            $('#inputNUM').val('');
            $('#labelDireccion').text('');
            $('#selectCARRER').text('');
            break;

        case 'pageConsultaIncidencias' :
            sDireccionConsulta = '';
            posConsulta = '';
            mapConsulta = null;
            break;

    }
}

function reposicionaMapa(){
    actualizarComboCalle();
    iniciaMapaFoto(true);
}

function inicioPaginaTipoIncidencia() {

    //cargo los iconos
    leeXMLIconos();

    //totalImg();  			//la primera vez informa esta var con el total de imagenes ...
    mostrarImagenes("");

}



function leeXMLIconos() {
    // alert('leo xml');
    $.ajax({
        type: "GET",
        url: "tablas/iconosTemas.xml",
        dataType: "xml",
        success: function (xml) {
            $(xml).find('icoTema').each(function () {
                dicImagenes[$(this).find('id').text()] = "images/tipoInci/" + $(this).find('img').text();
                dicAyuda[$(this).find('id').text()] = $(this).find('desc').text();
                //guardem l'item del seleccionat
                dicItem[$(this).find('id').text()] = $(this).find('img').text().substr(0, $(this).find('img').text().indexOf("_"));
            });
        },
        error: function () {
            alert("Error processant arxiu XML");
        }, async: false
    });
}

function mostrarImagenes() {
    var sTagImg = "";
    var nInd = 0;
    var nIndVis = 0;
    for (sImagen in dicImagenes) {
        sTagImg += "<a href='' onclick='" + "selectTipo(" + sImagen + ")' data-mini='false' data-inline='false' data-role='button' data-theme='c' data-corners='true' data-shadow='true' data-iconshadow='true' data-wrapperels='span' class='ui-btn ui-shadow ui-btn-corner-all ui-fullsize ui-btn-block ui-first-child ui-btn-up-c'>"
        sTagImg += "<img alt='' src='" + dicImagenes[sImagen] + "' style='width:45px' />"
        sTagImg += "<div>" + dicAyuda[sImagen] + "</div>"
        sTagImg += "</a>"
    }
    $('#divTipoInci').html(sTagImg);

};

function selectTipo(p_tipo) {
    try{
        TipoInciSel = p_tipo;
        abrirPagina('pageDatosIncidencia', false);
        //navigator.camera.getPicture(hacerfotoOK, hacerFotoERROR, { quality: 20, destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true,sourceType:  Camera.PictureSourceType.CAMERA,  saveToPhotoAlbum: false });
    }
    catch (ex){
        //abrirPagina('pageDatosIncidencia', false);
    }
}


function getLocation() {
    try {

        var locOptions = {
            maximumAge: 0,
            timeout: 1000,
            enableHighAccuracy: true
        };
        //get the current location
        wathID = navigator.geolocation.watchPosition(onLocationSuccess, onLocationError, locOptions);
    }
    catch (ex){
        //mensaje(ex.message,"error");
        GPSActivado=false;
        posicionGPS='';
    }
}

function onLocationSuccess(loc) {
    GPSActivado = true;
    posicionGPS = loc;
}

function onLocationError(e) {
    GPSActivado=false;
    posicionGPS='';
}

function GPSEstaActivado() {
    try {
        Diagnostic.prototype.isLocationEnabled(GPSEstaActivadoOK, GPSEstaActivadoError);
    }
    catch (ex) {
    }
}
function GPSEstaActivadoError(error) {
}

function GPSEstaActivadoOK(result) {
    if (!result) {
        //GPS Desactivado
        var v_mensaje = "Mostrar els ajustos d'ubicació?";
        var v_titulo = "El GPS està desactivado";
        var v_botones = "SI,NO";

        if(navigator.notification && navigator.notification.confirm){
            navigator.notification.confirm(v_mensaje,MostrarAjustesUbicacion,v_titulo,v_botones);
        }
        else
        {
            var v_retorno = confirm(v_mensaje);
            if (v_retorno){
                MostrarAjustesUbicacion(1);
            }
            else {
                MostrarAjustesUbicacion(2);
            }
        }
    }
}

function MostrarAjustesUbicacion(respuesta){
    try {
        if (respuesta == 1) {
            Diagnostic.prototype.switchToLocationSettings();
        }
    }
    catch (ex){}
}

