var mapAlta = null;
var posAlta = '';
var sDireccionAlta = '';
var sFoto = '';
var sCoords ='';
var sCoord_X = '';
var sCoord_Y = '';
var sComentario = '';
//HGS afegits
var sId='';
var sDescItem='';
var dicImagenes = {};
var dicAyuda = {};
var dicItem={};
var nImgTotal = 0;
//hgs abans 5 Si disminueixo surten les fletxes
var nImgPorPanel = 10;
var nPrimeraImgVisible = 1;
var nNumCalle =0;
var bPrimera;



// -------- INICIALIZAR PÁGINA -----------------------------------------------------------
function inicioPaginaNuevaIncidencia(){

    //cargar los datos del usuario (tabla CIUTADA si tiene datos)
    var ciu = cargaDatosCiudadano();
    //Si los datos del ciudadano están guardados, se arranca la página como comunicació NO anónima y el acordeón 'qui soc' cerrado
    //y si no existen datos del ciudadano, se arranca la página como comunicació anónima y el acordeón 'qui soc' abierto
    if(ciu=='')
    {
        $('#collapsibleQuiSoc').trigger('expand');
        $('#check_ComAnonima').attr("checked",true).checkboxradio("refresh");
        $('#labelQUISOC').text("[ANÒNIM]");
    }
    else
    {
        $('#check_ComAnonima').attr("checked",false).checkboxradio("refresh");
        $('#collapsibleQuiSoc').trigger('collapse');
    }

    //cargo los iconos
    leeXMLIconos();

    //totalImg();  			//la primera vez informa esta var con el total de imagenes ...
    sincroImagenes("");

    var nLetra = 65;
    var combo = $('#selectLletraIniCARRER');
    cargaLetrasAbcdario(combo, 'lletra inicial' , nLetra );
    iniciaMapaAlta(true);

    //hgs080514, por si habia algunafoto
    eliminarFoto();
//        preseleccionar la inicial, cargar CARRERS de esa inicial en el combo de iniciales y preseleccionar la calle
//        var sC = cogerCalleNumDeDireccion(sDireccionAlta);
//        nLetra = sC.substr(0,1).toUpperCase().charCodeAt(0);
//        !!!!!!!!!!!!!! no consigo obtener el nombre de la calle desde google maps, ya que devuelve 'carrer de tal ... '

    var combo = $('#selectLletraIniCARRER');
    cargaLetrasAbcdario(combo, 'lletra inicial' , nLetra );
    bAbroPagina = false;
    $.doTimeout(1000,cierraMapaAbreComentario());
}

function cargaDatosCiudadano(){
    var objUsu = getDatosUsuario();
    if(objUsu != null)
    {
        $('#inputNOM').val(objUsu.NOM) ;
        $('#inputCOGNOM1').val(objUsu.COGNOM1);
        $('#inputCOGNOM2').val(objUsu.COGNOM2);
        $('#inputDNI').val(objUsu.DNI);
        $('#inputEMAIL').val(objUsu.EMAIL);
        $('#inputTELEFON').val(objUsu.TELEFON);

        $('#labelQUISOC').text(objUsu.NOM + ' ' + objUsu.COGNOM1 + ' ' + objUsu.COGNOM2 );
        if((objUsu.NOM + ' ' + objUsu.COGNOM1 + ' ' + objUsu.COGNOM2).trim() == '')
            return '';
        else
            return (objUsu.NOM + ' ' + objUsu.COGNOM1 + ' ' + objUsu.COGNOM2).trim();
    }
    else
        return '';
}

function cargaCalles(){
    if(aCarrers == null)
        mensaje("No s'han trobat carrers","informació");
    else
    {
        $('#selectCARRER').children().remove('li');
        $('#selectCARRER').empty();
        $('#selectCARRER').children().remove();

        var calles = [];
        calles.push("<option value='-1' data-placeholder='true'>Seleccioni el carrer</option>");
        for (var x = 0; x < aCarrers.length; x++)
        {
            calles.push("<option value='" + aCarrers[x][0][1] + "'>" + aCarrers[x][2][1] + " (" +  aCarrers[x][1][1] + ")</option>"); // [" + aCarrers[x][3][1] + "]</option>");
        }
        $('#selectCARRER').append(calles.join('')).selectmenu('refresh');
    }
}

function autoRellenoCalleNum()/**/{
    if(sDireccionAlta == '' || aGlobalCarrers == null || aGlobalCarrers.length < 1) return;

    try{
        var sTipusDetectat = sDireccionAlta.split(" ")[0];
        var sCarrerDetectat = sDireccionAlta.split(",")[0].substr(sTipusDetectat.length);
        var sIdCarrer = '';

        for(var x=0 ; x<aGlobalCarrers.length; x++)
        {
            if(aGlobalCarrers[x].CARRER.trim().toUpperCase() == sCarrerDetectat.trim().toUpperCase())
            {
                if(aGlobalCarrers[x].TIPUS.trim().toUpperCase() == sTipusDetectat.trim().toUpperCase())
                {
                    sIdCarrer = aGlobalCarrers[x].ID;
                    break;
                }
            }
        }

        if(sIdCarrer != '') {
            $('#inputNUM').val(sDireccionAlta.split(",")[1].trim());
            $('#selectCARRER').val(sIdCarrer);
            $('#selectCARRER').selectmenu('refresh');
            //hgs 1702 alert('autoRellenoCalle');
            $('#labelDireccion').text(sDireccionAlta);
        }
    }
    catch(e){}
}

function cierraMapaAbreComentario(){
    $('#collapsibleItem').trigger('expand');
    //$('#collapsibleLocalizacion').trigger('collapse');
}

// -------- FOTO -------------------------------------------------------------------------
//abre la cámara para hacer foto o la coge de la galeria
function hacerFoto(origen) {
    try {
        if(origen=='CAMARA')
        {
            //alert('foto camara');
            iniciaMapaFoto(false);
            actualizarComboCalle();
            //hgs havia afegit option camera.correctorientation:true, a vila dona error!!
            //hgs afegits: correctOrientation: true,targetWidth: 800,targetHeight: 800
            navigator.camera.getPicture(hacerfotoOK, hacerFotoERROR, { quality: 20, destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true,targetWidth: 800,targetHeight: 800,sourceType: Camera.PictureSourceType.CAMERA, encodingType: Camera.EncodingType.JPEG, saveToPhotoAlbum: false });
        }
        else
        {
            navigator.camera.getPicture(hacerfotoOK, hacerFotoERROR, { quality: 20, destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.PHOTOLIBRARY, encodingType: Camera.EncodingType.JPEG, saveToPhotoAlbum: false});
        }
        //hgs nou
        $('#buttonEliminarFoto').attr({"style":"display:block","src":""});
    }
    catch (e) {
        mensaje('Exception : ' + e.message);
    }
}
function hacerfotoOK(imageData) {
    var imagen = document.getElementById('imgFoto');
    imagen.style.display = 'block';
    sFoto = imageData;
    imagen.src = "data:image/jpeg;base64," + sFoto;
}
function hacerFotoERROR(errorOcancel) {
    sFoto = '';
    if(errorOcancel != null && (errorOcancel.indexOf('cancelled') < 0 && errorOcancel.indexOf('selected') < 0)){
        mensaje('Cap foto capturada : ' + errorOcancel.code);
    }
}
function eliminarFoto(){
    $('#imgFoto').attr({"style":"display:none","src":""});
    $('#imgZoomFoto').attr({"style":"display:none","src":""});
    //hgs nou
    $('#buttonEliminarFoto').attr({"style":"display:none","src":""});
}
function Old_eliminarFoto(){
    sFoto = "";
    var imagen = document.getElementById('imgFoto');
    imagen.style.display = 'block';
    imagen.src = sFoto;

    imagen = document.getElementById('imgZoomFoto');
    imagen.style.display = 'block';
    imagen.src = sFoto;
}

function actualizarComboCalle(){

    //hgs
   // alert('he clicado sobre mapa borrar seleccion combo');

    /*$('#selectLletraIniCARRER').append('<option value="-1"></option>')
    $('#selectLletraIniCARRER').val("-1");
    $("#selectLletraIniCARRER option[value='-1']").attr("selected", "selected");
    $("#selectLletraIniCARRER").selectmenu('refresh', true);

    $('#selectCARRER').append('<option value="-1">...</option>')
    $('#selectCARRER').val("-1");
    $("#selectCARRER option[value='-1']").attr("selected", "selected");
    $("#selectCARRER").selectmenu('refresh', true);*/

    //hgs 170214 ho poso com al principi
    var nLetra = 65;
    var combo = $('#selectLletraIniCARRER');
    cargaLetrasAbcdario(combo, 'lletra inicial' , nLetra );

    $('#inputNUM').val("");
}
function prueba(){
    //alert('prueba');
    //iniciaMapaFoto(false);
   // alert('mapa');
    actualizarComboCalle();
   // alert('cbo calle');
}

// -------- LOCALIZACIÓN -----------------------------------------------------------------------

function iniciaMapaAlta(bAbrir) {
    //que no vuelva a coger la dirección actual si hay ya una en esta variable
    //(para que al igual que el resto de datos se conserve esta dirección en el form)
    if(sDireccionAlta.trim() != '') return;

    try{
        // Try HTML5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                posAlta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var mapOptions = {
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    accuracy: 5,
                    center:posAlta, //afegit 170414
                    enabledHighAccuracy:true,
                    overviewMapControl: false,
                    panControl: false,
                    rotateControl: false,
                    scaleControl: false,
                    zoomControl: false,
                    streetViewControl: false
                    ,maximumAge:0//,timeout:1000
                };
                mapAlta = new google.maps.Map(document.getElementById('divMapaAlta'), mapOptions);
                crearMarcadorEventoClick('ALTA', mapAlta, true,'labelDireccion', true);
                //hgs comentat pq esta en el mapoptions
                //mapAlta.setCenter(posAlta);

                sDireccionAlta = cogerDireccion(posAlta, true);
                $('#labelDireccion').text(sDireccionAlta); /*HGS 101213*/
                $('#divMensajeMapa').hide();
                /*            var sTxt = '<div><table><tr><td style="font-size:x-small; font-weight:bold;">comunicat en </td></tr><tr><td style="font-size:x-small; font-weight:normal;">' + sDireccionAlta + '</td></tr></table></div>';
                 nuevoMarcadorSobrePlanoClickInfoWindow('ALTA', mapAlta, posAlta,sTxt,null,300,true,true);
                 $('#labelDireccion').text(sDireccionAlta);
                 $('#divMapaAlta').gmap('refresh');*/

                $('#divMapaAlta').gmap('refresh');
                //$(".gm-style-cc").hide();
            }, function () {
                ('#divMapaAlta').hide();
                $('#divMensajeMapa').show();
                getCurrentPositionError(true);
            });
        } else {
            // Browser no soporta Geolocation
            $('#divMapaAlta').hide();
            $('#divMensajeMapa').show();
            getCurrentPositionError(false);
        }


    }
    catch(e)
    {
        $('#divMapaAlta').hide();
        $('#divMensajeMapa').show();
    }
}

function iniciaMapaFoto(bAbrir) {
    try{
        // Try HTML5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {

                posAlta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var mapOptions = {
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    accuracy:5,
                    enabledHighAccuracy:true,
                    overviewMapControl: false,
                    panControl: false,
                    rotateControl: false,
                    scaleControl: false,
                    zoomControl: false,
                    streetViewControl: false,
                     center:posAlta
                    ,maximumAge:0//,timeout:1000
                };
                mapAlta = new google.maps.Map(document.getElementById('divMapaAlta'), mapOptions);
                crearMarcadorEventoClick('ALTA', mapAlta, true,'labelDireccion', true);

                //mapAlta.setCenter(posAlta);
                sDireccionAlta = cogerDireccion(posAlta, true);
                $('#labelDireccion').text(sDireccionAlta);
                $('#divMensajeMapa').hide();
                $('#divMapaAlta').gmap('refresh');

            }, function () {
                ('#divMapaAlta').hide();
                $('#divMensajeMapa').show();
                getCurrentPositionError(true);
            });
        } else {
            // Browser no soporta Geolocation
            $('#divMapaAlta').hide();
            $('#divMensajeMapa').show();
            getCurrentPositionError(false);
        }
    }
    catch(e)
    {
        $('#divMapaAlta').hide();
        $('#divMensajeMapa').show();
    }
}

function cogerDireccion(pos , bSoloCalleYnum){
    var llamaWS = "http://maps.googleapis.com/maps/api/geocode/xml";
    var sParam =  "latlng=" + pos.toString().replace(" ", "").replace("(","").replace(")","") + "&sensor=true";
    var sDireccion = '';
    try
    {
        //function LlamaWebService (sTipoLlamada,sUrl,   sParametros,sContentType,                        bCrossDom, sDataType, bProcData, bCache, nTimeOut, funcion,           pasaParam,      asincro, bProcesar, tag)
        var datos = LlamaWebService('GET',llamaWS,sParam, 'application/x-www-form-urlencoded', true,      'xml',     false,     false,  10000, direccionObtenida, bSoloCalleYnum, true,    false,     null);
    }
    catch (e)
    {
        mensaje('ERROR (exception) en cogerDireccion : \n' + e.code + '\n' + e.message);
    }
    //return sDireccion;
}

function direccionObtenida(datos, param){
    if(datos == null ) return;
    var sDireccion = $(datos).find('formatted_address').text();
    var n = 0;

    $(datos).find('formatted_address').each(function () {
        if (n == 0) sDireccion = $(this).text();
        n++;
    });

    if(indefinidoOnullToVacio(param) != '')
        if(param)
            sDireccion = cogerCalleNumDeDireccion(sDireccion);

    sDireccionAlta = sDireccion;
    var sTxt = '<div><table><tr><td style="font-size:x-small; font-weight:bold;">comunicat en </td></tr><tr><td style="font-size:x-small; font-weight:normal;">' + sDireccionAlta + '</td></tr></table></div>';

    //alert('direccionObtenida. bPrimera: ' + bPrimera);
    if(bPrimera==true)
        nuevoMarcadorSobrePlanoClickInfoWindow('ALTA', mapAlta, posAlta,sTxt,null,300,true,true,'labelDireccion',false);
    else
    {
        if(bPrimera == false)
        {}
        else
        {
            nuevoMarcadorSobrePlanoClickInfoWindow('ALTA', mapAlta, posAlta,sTxt,null,300,true,true,'labelDireccion',true);
            bPrimera = true;
        }
    }

    $('#labelDireccion').text(sDireccionAlta);
    $('#divMapaAlta').gmap('refresh');

}
// -------- ENVIAR/GUARDAR COMUNICAT -----------------------------------------------------------
function fail(error) {
    alert(error);
}

function enviarIncidencia() {

    guardaDatosCiudadano();
    sId = $('#IdItem').val()+'';
    sDescItem = $('#labelItem').text()+'';
    sComentario = $('#textareaComentari').val();

    //var
    sCoords = posAlta.toString().replace(" ", "").replace("(","").replace(")","");
    if(sCoords != null && sCoords.trim() != '')
    {
        sCoord_X = sCoords.split(",")[0];
        sCoord_Y = sCoords.split(",")[1];
    }

    // La dirección correcta es la que ponga en el combo de calle y el numero de calle
    //(ya que puede pasar que la que ha detectado google maps no sea correcta)

    if (indefinidoOnullToVacio($('#selectCARRER').val()) != '' && $('#selectCARRER').val() != '-1') //o sea, si han seleccionado una calle en el combo ...
    {
            sDireccionAlta = $('#selectCARRER').find(":selected").text() + ', ' + $('#inputNUM').val();
    }



    //Controlar datos obligatorios -- afegit sId, treiem comentari sComentario,
    var sMsg =  datosObligatorios(sId, sDireccionAlta,$('#inputDNI').val(), $('#inputEMAIL').val(),$('#inputTELEFON').val());
    if(sMsg != ""){
        //$("buttonEnviar").removeAttr("disabled");//hgs 05/12/13
        mensaje(sMsg,'Atenció');
        return;
    }
/*  var sParams = "";
    sParams += "sNom=" + $('#inputNOM').val() + '';
    sParams += "&sCognom1=" + $('#inputCOGNOM1').val() + '';
    sParams += "&sCognom2=" + $('#inputCOGNOM2').val() + '';
    sParams += "&sDni=" + $('#inputDNI').val() + '';
    sParams += "&sEmail=" + $('#inputEMAIL').val() + '';
    sParams += "&sTelefon=" + $('#inputTELEFON').val() + '';
    sParams += "&sObs=" + sComentario + '';
    sParams += "&sCoord=" + sCoord + '';
    sParams += "&sDir=" + sDireccionAlta + '';
    sParams += "&sFoto=" + sFoto;  //encodeURIComponent(imagenDePrueba()) + '';
*/
    var  sParams = {sId:$('#IdItem').val()+'',sDescItem:$('#labelItem').text()+'' ,sNom:$('#inputNOM').val() + '',sCognom1:$('#inputCOGNOM1').val() + '',sCognom2:$('#inputCOGNOM2').val() + '',sDni:$('#inputDNI').val() + '',sEmail:$('#inputEMAIL').val() + '',sTelefon:$('#inputTELEFON').val() + '',sObs:sComentario + '',sCoord:sCoords + '',sCodCarrer:$('#selectCARRER').val() + '',sCarrer:$('#selectCARRER').find(':selected').text() + '',sNumPortal:$('#inputNUM').val() + '',sFoto: sFoto};

    try{
        estadoControl('buttonEnviar',false);
        //myFunction(10);
        var ref = enviarComunicat_WS(sParams, true);
        //estadoControl('buttonEnviar',true);
    } catch(ex){
        mensaje('ERROR (exception) en resultadoEnvio ' + ex.code + '\n' + ex.message , 'error');
        estadoControl('buttonEnviar',true);
        // return null;
    }
}

/*function myFunction(nMaxSegundosEnvio)
{
    if( nMaxSegundosEnvio == -1) {
        //alert(' ha pasado un tiempo razonable ... ');
        clearInterval(nMaxSegundosEnvio);
        }
    else{
        setInterval( function()
        {

            //  alert(nMaxSegundosEnvio);
            return myFunction(nMaxSegundosEnvio--);}, 1000);
    }
return null;
}*/


function enviarComunicat_WS(sParams,bNuevoComunicat){
    //dmz
    var llamaWS = "http://80.39.72.44:8000/wsAPPGIV/wsIncidentNotifierGIV.asmx/IncidenciaTipus";
    //vila
    //var llamaWS = "http://www.vilafranca.cat/wsAPPGIV/wsIncidentNotifierGIV.asmx/IncidenciaTipus";
    //alert('llamaWS ' + llamaWS + 'bNuevoComunicat ' + bNuevoComunicat);
    //alert('sParams en enviarcomunicat ' + sParams.sId );
    try
    {
        var bEnvioCorrecto = true;
        var sEstado = "";
        var sMensaje ="";
        var sTitulo = "";
        var sReferen = "";
        $.post(llamaWS, sParams).done(function(datos) {
            try
            {

                if(datos == null)  //==> ha habido error
                {
                    mensaje("No hi ha confirmació de l'enviament de la comunicació " ,'error');
                    sReferen = "-";
                    sMensaje = "Comunicació guardada en el dispositiu";
                    sTitulo = "error enviant";
                    bEnvioCorrecto = false;
                    estadoControl('buttonEnviar',true);
                }
                else  //==> el WS ha devuelto algo
                {
                    sReferen = $(datos).find('resultado').text().trim();
                    if(sReferen.indexOf('|') > 0)
                    {
                        sMensaje = 'La seva comunicació ha estat rebuda però amb problemes : \n ' + sReferen.substr(sReferen.indexOf('|') + 1);
                        sTitulo = "atenció";
                        sReferen = sReferen.substr(0,sReferen.indexOf('|'));
                        estadoControl('buttonEnviar',true);
                    }
                    else
                    {
                        if(sReferen.indexOf('|') == 0)
                        {
                            sMensaje = "La seva comunicació no s'ha processat correctament. [" + sReferen.substr(1) + "]\n";
                            sTitulo = "error";
                            sReferen = "ERROR";
                            bEnvioCorrecto = false;
                            estadoControl('buttonEnviar',true);
                        }
                        else
                        {
                            sMensaje = 'Comunicació notificada [' + sReferen + ']\n' + 'Gràcies per la seva col·laboració';
                            sTitulo = "info";
                            estadoControl('buttonEnviar',true);
                        }
                    }
                }

                if(bNuevoComunicat){

                    if(bEnvioCorrecto)
                        sEstado = "NOTIFICAT";
                    else
                        sEstado = "PENDENT_ENVIAMENT";

                    var nIdCom = guardaIncidencia(sReferen, sEstado);

                    if(!bEnvioCorrecto)
                    {
                        guardaFotoEnLocal(nIdCom, sFoto);
                    }

                    eliminarFoto();
                    limpiaVariables('pageNuevaIncidencia');
                    mensaje(sMensaje, sTitulo);
                    estadoControl('buttonEnviar',true);
                    abrirPagina('pageIndex', false);
                }
                else
                {
                    if(!bEnvioCorrecto)
                        mensaje(sMensaje, sTitulo);
                    estadoControl('buttonEnviar',true);
                }
            }
            catch(ex){
                mensaje('ERROR (exception) en resultadoEnvio : \n' + ex.code + '\n' + ex.message , 'error');
                estadoControl('buttonEnviar',true);
                // return null;
            }

        }).fail(function() {
                if (bNuevoComunicat){
                    var nIdCom = guardaIncidencia("-","PENDENT_ENVIAMENT");
                    //hgs afegit aquest if
                    if (sFoto != null) {guardaFotoEnLocal(nIdCom, sFoto);}
                    limpiaVariables('pageNuevaIncidencia');
                }
                sMensaje = "La seva comunicació no s'ha pogut enviar \n ";
                if(sReferen.trim().length > 0 ) sMensaje += sReferen.substr(1) + '\n';
                sMensaje += "Quan tingui connexió pot enviar-la des de 'Els meus comunicats'" ;
                sTitulo = "atenció";
                sReferen = "ERROR";
                mensaje(sMensaje, sTitulo);
                estadoControl('buttonEnviar',true);
                abrirPagina('pageIndex', false);
            });
    }
    catch(e)
    {
        mensaje('ERROR (exception) en enviarComunicat_WS : \n' + e.code + '\n' + e.message);
        estadoControl('buttonEnviar',true);
    }

}

function enviarComunicatPendiente_WS(sParams, bNuevoComunicat ){
    var sDev = '';
    //dmz
    var llamaWS ="http://80.39.72.44:8000/wsAPPGIV/wsIncidentNotifierGIV.asmx/IncidenciaTipus";
    //vila
    //var llamaWS ="http://www.vilafranca.cat/wsAPPGIV/wsIncidentNotifierGIV.asmx/IncidenciaTipus";
    var sMensaje = "";
    var sTitulo = "";

     $.ajax({
        type: 'POST',
        url: llamaWS,
        data: sParams,
        success: function(datos) {
            var sReferen = $(datos).find('resultado').text().trim();
            if(sReferen.indexOf('|') > 0)
            {
                sMensaje = 'La seva comunicació ha estat rebuda però amb problemes : \n ' + sReferen.substr(sReferen.indexOf('|') + 1);
                sTitulo = "atenció";e
                sReferen = sReferen.substr(0,sReferen.indexOf('|'));
                sDev = "ERROR";
            }
            else
            {
                if(sReferen.indexOf('|') == 0)
                {
                    sMensaje = "La seva comunicació no s'ha processat correctament. [" + sReferen.substr(1) + "]\n";
                    sTitulo = "error";
                    sReferen = "ERROR";
                    sDev = "ERROR";
                }
                else
                {
                    sMensaje = 'Comunicació notificada [' + sReferen + ']\n' + 'Gràcies per la seva col·laboració';
                    sTitulo = "info";
                    sDev = sReferen;
                }
            }
            mensaje(sMensaje, sTitulo);
        },
        error: function(error) { sDev = "ERROR"; } ,
        async:false
    });
    return sDev;
}

function guardaDatosCiudadano(){
    try
    {
        // NOM, COGNOM1, COGNOM2, DNI, EMAIL, TELEFON
        var idCiutada = 0;
        var nom='';
        var cognom1='';
        var cognom2='';
        var dni='';
        var email='';
        var telefon='';

        //recojo los datos del usuario que ya están guardados en la tabla CIUTADA
        //si todavía no existe el usuario se devuelve un objeto usuari vacio
        var objUsu = getDatosUsuario();

        //Si ha modificado algún dato lo recojo para actualizar , pero si lo ha dejado en blanco cojo lo que ya tenía en la tabla guardado
        if($('#inputNOM').val() != '')     nom =     $('#inputNOM').val();     else nom =     objUsu.NOM;
        if($('#inputCOGNOM1').val() != '') cognom1 = $('#inputCOGNOM1').val(); else cognom1 = objUsu.COGNOM1 ;
        if($('#inputCOGNOM2').val() != '') cognom2 = $('#inputCOGNOM2').val(); else cognom2 = objUsu.COGNOM2 ;
        if($('#inputDNI').val() != '')     dni =     $('#inputDNI').val();     else dni =     objUsu.DNI ;
        if($('#inputEMAIL').val() != '')   email=    $('#inputEMAIL').val();   else email =   objUsu.EMAIL ;
        if($('#inputTELEFON').val() != '') telefon = $('#inputTELEFON').val(); else telefon = objUsu.TELEFON ;

        objUsu = new usuari();
        objUsu.ID = 0;
        objUsu.NOM = nom;
        objUsu.COGNOM1 = cognom1;
        objUsu.COGNOM2 = cognom2;
        objUsu.DNI = dni;
        objUsu.EMAIL = email;
        objUsu.TELEFON = telefon;

        guardaObjetoLocal('CIUTADA' , objUsu);
    }
    catch (e)
    {
        mensaje(e.message , 'error');
    }
}

function datosObligatorios(sId, sDir, sDni , sEmail, sTelefon){
    if(sId == null || sId.trim() == '') return "Les dades marcades amb (*) són obligatòries\nFalta 'què passa'" ;
    if(sDir == null || sDir.trim() == '') return "Les dades marcades amb (*) són obligatòries\nFalta 'on està passant'";

    if($(check_ComAnonima).is(':checked')){
        return "";
    }
    else
    {
        var sPosibleFalloMail = "";
        var sPosibleFalloTelefono = "";
        if(sDni == null || sDni.trim() == '')
        {
            return "Si la comunicació no és anònima, és obligatori el DNI/NIF i també el telèfon o l'adreça electrònica";
        }
        else
        {
            if(!esDni(sDni)) return "El DNI/NIF no és vàlid";
            if( (sEmail == null || sEmail.trim() == '') && (sTelefon == null || sTelefon.trim() == '') )
            {
                return "Si la comunicació no és anònima, és obligatori : el DNI/NIF  i també el telèfon o l'adreça electrònica";
            }
            else
            {
                if(sEmail != null && sEmail.trim() != '') if(!esEmail(sEmail)) sPosibleFalloMail = "L'adreça electrònica introduida no és correcta";
                if(sTelefon != null && sTelefon.trim() != '') if(!esTelefono(sTelefon)) sPosibleFalloTelefono = "El telèfon introduit no és correcte";

                if( (sEmail == null || sEmail.trim() == '' || sPosibleFalloTelefono != "") && sPosibleFalloTelefono != "" ) return sPosibleFalloTelefono;
                if( (sTelefon == null || sTelefon.trim() == '' || sPosibleFalloMail != "") && sPosibleFalloMail != "" ) return sPosibleFalloMail;
            }
        }
    }
    return "";
}

function guardaIncidencia(sReferen, sEstado){
    try
    {
        var nId = leeObjetoLocal('COMUNICATS_NEXTVAL' , -1) + 1;
        var fecha = FechaHoy() + ' ' + HoraAhora();
        var carrer = sDireccionAlta.split(",")[0];
        var num = sDireccionAlta.split(",")[1];

        //INSERT INTO COMUNICATS (ID, REFERENCIA, ESTAT, DATA, CARRER, NUM, COORD_X, COORD_Y, COMENTARI) VALUES (?,?,?,?,?,?,?,?,?);
        //var fila = [nId, sReferen, 'PENDENT', fecha,carrer , num, sCoord_X, sCoord_Y, sComentario, null, null, null];

        var objComunicat = new comunicat();
        objComunicat.ID = nId;
        objComunicat.REFERENCIA = sReferen.trim();
        objComunicat.ESTAT = sEstado;
        objComunicat.DATA = fecha;
        objComunicat.CARRER = carrer;
        objComunicat.NUM = num;
        objComunicat.COORD_X = sCoord_X + '';
        objComunicat.COORD_Y = sCoord_Y + '';
        objComunicat.COMENTARI = sComentario;
        objComunicat.ITE_ID = sId;
        objComunicat.ITE_DESC = sDescItem;
        objComunicat.ID_MSG_MOV = sReferen.trim();
        guardaObjetoLocal('COMUNICAT_' + nId.toString().trim() , objComunicat);

        guardaObjetoLocal('COMUNICATS_NEXTVAL', nId);

        return nId;
    }
    catch(e)
    {
        mensaje('ERROR (exception) en guardaIncidencia : \n' + e.code + '\n' + e.message);
        return -1;
    }
}

function guardaFotoEnLocal(nId,sFoto){
      guardaObjetoLocal('FOTO_' + nId.toString().trim() , sFoto);
}

// -------- NETEJAR CIUTADA -------------------------------------------------------------------
function netejarDades(){
    $('#inputNOM').val('');
    $('#inputCOGNOM1').val('');
    $('#inputCOGNOM2').val('');
    $('#inputDNI').val('');
    $('#inputEMAIL').val('');
    $('#inputTELEFON').val('');
}

// -------- IMAGENES -------------------------------------------------------------------
jQuery(function(){
    $(".img-swap").click(function(){
        if ($(this).attr("class") == "img-swap") {
           // alert ('sincroimagenes');
            sincroImagenes(this.id, dicActivo);
        }
    });
});


function mueveApanel(dic){
    //hgs 1702 alert('moc panel');
    dicActivo = dic;
    sincroImagenes('' , dic);
    $('#divAyuda').text('');
}
//carga el divImagenes con las siguientes/anteriores nImgPorPanel imagenes
// el original
function mueveApanel(sDireccion){
    if(sDireccion == 'DER')
    {
        if( (nPrimeraImgVisible + nImgPorPanel) <= nImgTotal) nPrimeraImgVisible += nImgPorPanel;
    }

    if(sDireccion == 'IZQ')
    {
        if( (nPrimeraImgVisible - nImgPorPanel) > 0) nPrimeraImgVisible -= nImgPorPanel;
    }

    sincroImagenes('');
    $('#divAyuda').text('');
}

//carga la var nImgTotal con el total de imagenes
function totalImg(){
   // alert('totalImg');
    nImgTotal = 0;
    for (var s in dicImagenes) { nImgTotal++; }
    //alert('total ' + nImgTotal);
    if(nImgTotal <= nImgPorPanel ){
        $('#Img_I').hide();
        $('#Img_D').hide();
    }
}

function leeXMLIconos(){
   // alert('leo xml');
    $.ajax({
        type: "GET",
        url: "tablas/iconosTemas.xml",
        dataType: "xml",
        success: function(xml){
            $(xml).find('icoTema').each(function(){
                dicImagenes[$(this).find('id').text()] = "imagenes/"+$(this).find('img').text();
                dicAyuda[$(this).find('id').text()] = $(this).find('desc').text();
                //guardem l'item del seleccionat
                dicItem[$(this).find('id').text()] = $(this).find('img').text().substr(0,$(this).find('img').text().indexOf("_"));
            });
        },
        error: function() {
            alert("Error processant arxiu XML");
        },async:false
    });
}

// 'Activa' una imagen y desactiva todas las demas y actualiza el divImagenes con las que toque (según sea inicio, derecha o izquierda)
function sincroImagenes(sIdImg)	{
    //si llega a esta function porque han pulsado una imagen (para activarla)
    if(sIdImg != '')
    {
        //pongo la imagen seleccionada en ON ...
        $('#' + sIdImg).attr('src',dicImagenes[sIdImg].replace("_off","_on"));  //reemplazo por su imagen ON ...
        $('#divAyuda').text(dicAyuda[sIdImg]);   																//... y pongo su explicación debajo

        // le meto el valor a idItem
        $('#IdItem').val(dicItem[sIdImg]); //alert ('iditem es '+ $('#IdItem').val());

        //... y las demas imagenes en OFF :
        for (sImagen in dicImagenes) {
            if(sImagen != sIdImg) {
                try{
                    $('#' + sImagen).attr('src',dicImagenes[sImagen].replace("_on","_off"));
                } catch(e){}
            }
        }
    }
    else  //si llega a esta function porque es la primera vez o porque pulsan derecha/izquierda ==> meter imagenes que toquen en el div :
    {
        var sTagImg = "";
        var nInd = 0;
        var nIndVis = 0;
        for (sImagen in dicImagenes) {
            if( (++nInd) >= nPrimeraImgVisible && (++nIndVis) <= nImgPorPanel)
            {
                sTagImg += "<img src='" + dicImagenes[sImagen] + "' id='" + sImagen + "' class='img-swap' alt='" + dicImagenes[sImagen] + "' width='54' height='70' /> "
            }
        }
        $('#divImagenes').html(sTagImg);

        //captura el evento click sobre una imagen y la 'activa'
        $(function(){
            $(".img-swap").click(function(){
                if ($(this).attr("class") == "img-swap") {
                    sincroImagenes(this.id);
                }
            });
        });
    }
};

// -------- MAIL -------------------------------------------------------------------
function aFunction(){
    //hgs 1702 alert('envio mail con aFunction');
    var args = {
        subject: 'Hi there',
        body: 'message to suggest you',
        toRecipients: 'helena.gener@gmail.com'
    };
    cordova.exec(null, null, "EmailComposer", "showEmailComposer", [args]);
}

function sendMail() {
    //hgs 1702 alert('envio mail');
    var sSubject=decodeURI(encodeURI("Mi asunto"));
    //alert ('sSubject  ' + sSubject);

    var sBody =decodeURI(encodeURI(document.getElementById('textareaComentari').value)); //aqui aniria el contingut desitjat
    //alert ('sBodyD:' + sBodyD);
    var link = "mailto:helena.gener@gmail.com"
            + "?cc=carlosloga@gmail.com"
            + "&subject=" + sSubject
            + "&body=" + sBody;
            //+ "&subject=" + escape("This is my subject")
            //+ "&body=" + escape(document.getElementById('myText').value)
    //alert(link);
    window.location.href = link;
}