var sFoto = '';

var mapAlta = null;
var posAlta = '';
var sDireccionAlta = '';
var sCoords = '';
var sCoord_X = '';
var sCoord_Y = '';
var sComentario = '';

function inicioPaginaDatosIncidencia() {
    $('#divDatosIncidenciaEspera').hide();
    $('#divDatosIncidenciaAudioPlay').hide();
    $('#divCargarMapaAlta').show();
    $('#divMensajeMapa').hide();
    $('#divMapa').hide();
    $('#divDireccion').hide();
    try{
        document.getElementById('imgFoto').src ='';
        $('#TipusInciImg').attr({"src":''});
        $('#TipusInciText').html('');
        posAlta="";
        $('#labelDireccion').text('');

        $('#inputNUM').val('');
        $('#selectCARRER').text('');
        $('#textareaComentari').val('');

        _inciAudioFichero='';
        var imagen = document.getElementById('imgAudioPlay');
        imagen.src = "images/play_gray.png";

        cargarPaginaDatosIncidencia();
        //navigator.camera.getPicture(hacerfotoOK, hacerFotoERROR, { quality: 20, destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true,sourceType:  Camera.PictureSourceType.CAMERA,  saveToPhotoAlbum: false });
    }
    catch (ex){
        //alert(ex.message);
        //cargarPaginaDatosIncidencia();
    }
}

function cargarPaginaDatosIncidencia() {
    try{
        //mostrar foto
        if (sFoto !=''){
            var imagen = document.getElementById('imgFoto');
            imagen.style.display = 'block';
            imagen.src = "data:image/jpeg;base64," + sFoto;
        }
        else {
            var imagen = document.getElementById('imgFoto');
            imagen.style.display = 'block';
            imagen.src = "images/sinFoto.png";
        }

        //tipo incidencia
        $('#TipusInciImg').attr({"src":dicImagenes[TipoInciSel]});
        $('#TipusInciText').html(dicAyuda[TipoInciSel]);

        //mostrar plano o callejero
        if(phoneGapRun()) {
            if (!GPSActivado) {
                //Se vuelve a mirar si el GPS está activado
                GPSEstaActivado(false);
                $.doTimeout(3000, MostrarUbicacion());
            }
            else {
                MostrarUbicacion();
            }
        }
        else{
            MostrarUbicacion();
        }
    }
    catch(ex) {
        //alert("cargarPaginaDatosIncidencia:"+ ex.message);
    }
}

function MostrarUbicacion() {
    try {
        var nLetra = 65;
        var combo = $('#selectLletraIniCARRER');
        cargaLetrasAbcdario(combo, 'lletra inicial', nLetra);

        if (GPSActivado) {
            if (GPSwathId) {
                posicionOK(posicionGPS);
            }
            else {
                //Si hay error al recuperar posición (puede que esté sin cobertura)
                //Se obtiene la current position por si acaso
                getPosition();
                $.doTimeout(3000, function () {
                    if (GPScurrentposition) {
                        posicionOK(posicionGPS);
                    }
                    else {
                        //Falla la obtención de la current position y el wathID sigue sin ir
                        if (!GPSwathId) {
                            //No hay última posición de GPS
                            if (posicionGPS == null || posicionGPS == '' || posicionGPS.coords == null || posicionGPS.coords == '' || posicionGPS.coords.latitude == null || posicionGPS.coords.latitude == '') {
                                $('#divCargarMapaAlta').hide();
                                $('#divMapa').hide();
                                $('#divMensajeMapa').hide();
                                $('#divDireccion').show();
                                mensaje("No es pot obtenir les coordenades de GPS", "error");
                            }
                            else {
                                //Hay última posición de GPS, preguntar si la quiere o no
                                UltimaUbicacionConfirm();
                            }
                        }
                    }
                });
            }
        }
        else {
            //GPS no está activado
            $('#divCargarMapaAlta').hide();
            $('#divMapa').hide();
            $('#divMensajeMapa').hide();
            $('#divDireccion').show();
        }
    }
    catch (ex) {
        //alert("MostrarUbicacion: "+ex.message);
    }

}


function UltimaUbicacionConfirm(){
    var v_mensaje = "No es pot obtenir les coordenades de GPS \n Vol recuperar l'ultima posició?";
    var v_titulo = "error de GPS";
    var v_botones = "SI,NO";

    if(navigator.notification && navigator.notification.confirm){
        navigator.notification.confirm(v_mensaje,UltimaUbicacion,v_titulo,v_botones);
    }
    else
    {
        var v_retorno = confirm(v_mensaje);
        if (v_retorno){
            UltimaUbicacion(1);
        }
        else {
            UltimaUbicacion(2);
        }
    }

}
function UltimaUbicacion(respuesta) {
    if (respuesta == 1) {
        posicionOK(posicionGPS)
    }
    else {
        $('#divCargarMapaAlta').hide();
        $('#divMapa').hide();
        $('#divMensajeMapa').hide();
        $('#divDireccion').show();
    }
}

function posicionOK(position){
    try {
        //alert("posicionOK");
        $('#divCargarMapaAlta').hide();
        $('#divMensajeMapa').hide();
        $('#divMapa').show();
        posAlta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            //accuracy: 5,
            enabledHighAccuracy: true,
            //overviewMapControl: false,
            panControl: false,
            rotateControl: false,
            scaleControl: false,
            zoomControl: false,
            streetViewControl: false,
            disableDefaultUI: true,
            center: posAlta
            //maximumAge: 0//,timeout:1000
        };
        mapAlta = new google.maps.Map(document.getElementById('divMapaAlta'), mapOptions);
        crearMarcadorEventoClick1(mapAlta);

        //mapAlta.setCenter(posAlta);
        cogerDireccion(posAlta, true);
        $('#labelDireccion').text(sDireccionAlta);
        try{
            $('#divMapaAlta').gmap('refresh');
        }
        catch(ex) {}

    }
    catch(ex){
    mensaje("ERROR al mostrar el mapa:\n"+ex.message,"error");
        posAlta = "";
        $('#divCargarMapaAlta').hide();
        $('#divMapa').hide();
        $('#divMensajeMapa').hide();
        $('#divDireccion').show();
    }
}

function posicionError(error){
        mensaje("posicionError: "+ error.code+" "+error.message,"error");
        posAlta = "";
        $('#divCargarMapaAlta').hide();
        $('#divMapa').hide();
        $('#divMensajeMapa').hide();
        $('#divDireccion').show();
}
function cogerDireccion(pos, bSoloCalleYnum) {
    var llamaWS = "http://maps.googleapis.com/maps/api/geocode/xml";
    var sParam = "latlng=" + pos.toString().replace(" ", "").replace("(", "").replace(")", "") + "&sensor=true";
    try {
        //function LlamaWebService (sTipoLlamada,sUrl,   sParametros,sContentType,                        bCrossDom, sDataType, bProcData, bCache, nTimeOut, funcion,           pasaParam,      asincro, bProcesar, tag)
        var datos = LlamaWebService('GET', llamaWS, sParam, 'application/x-www-form-urlencoded', true, 'xml', false, false, 10000, direccionObtenida1, bSoloCalleYnum, true, false, null);
    }
    catch (e) {
        mensaje('ERROR (exception) en cogerDireccion : \n' + e.code + '\n' + e.message);
    }
}

function direccionObtenida1(datos, param) {
    sDireccionAlta='sense adreça';

    if (datos == null) return;
    var sDireccion = $(datos).find('formatted_address').text();
    var n = 0;

    $(datos).find('formatted_address').each(function () {
        if (n == 0) sDireccion = $(this).text();
        n++;
    });

    if (indefinidoOnullToVacio(param) != '')
        if (param)
            sDireccion = cogerCalleNumDeDireccion(sDireccion);

    sDireccionAlta = sDireccion;

    nuevoMarcadorSobrePlanoClickInfoWindow1('ALTA', mapAlta, posAlta, null, null);


    $('#labelDireccion').text(sDireccionAlta);
    try{
        $('#divMapaAlta').gmap('refresh');
    }
    catch (ex){}

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

function MostrarEsperaDatosIncidencia(){
    $('#divDatosIncidenciaEspera').show();
}

function enviarIncidencia(){
    try{
        //Tipo de incidencia
        sId=TipoInciSel;
        sDescItem=dicAyuda[TipoInciSel];

        //Comentario
        sComentario = $('#textareaComentari').val();

        //Coordenadas
        sCoords="";
        if (posAlta !="") {
            sCoords = posAlta.toString().replace(" ", "").replace("(", "").replace(")", "");
            if (sCoords != null && sCoords.trim() != '') {
                sCoord_X = sCoords.split(",")[0];
                sCoord_Y = sCoords.split(",")[1];
            }
        }

        //Dirección
        if (indefinidoOnullToVacio($('#selectCARRER').val()) != '' && $('#selectCARRER').val() != '-1') //o sea, si han seleccionado una calle en el combo ...
        {
            sDireccionAlta = $('#selectCARRER').find(":selected").text() + ', ' + $('#inputNUM').val();
        }

        //Validar Datos
        var v_sRetorno = ValidarIncidencia();

        if (v_sRetorno==""){
            abrirPagina("pageInfoEnvio",false)
        }
        else{
            $('#divDatosIncidenciaEspera').hide();

            mensaje("Falten dades obligatòries;\n"+v_sRetorno,"avís");

        }
    }
    catch (ex){
        $('#divDatosIncidenciaEspera').hide();
        mensaje("ERROR: "+ex.message,"error");
    }
}

function ValidarIncidencia(){
    var v_sMensaje ='';
    //datos obligatorios:
    //  tipo de incidencia, foto, ubicación (cooordenadas o calle y número)
    if(TipoInciSel.toString().trim()==''){
        v_sMensaje="El tipus d'incidència es obligatori\n"
    }
    if(sFoto.toString().trim()==''){
        v_sMensaje=v_sMensaje+"La foto es obligatòria\n"
    }

    var v_bTieneCoordenadas=false;
    var v_bTieneDireccion=false;

    if (posAlta !="") {
        var v_sCoords="";
        v_sCoords = posAlta.toString().replace(" ", "").replace("(", "").replace(")", "");
        if (v_sCoords != null && v_sCoords.trim() != '') {
            v_bTieneCoordenadas=true;
        }
    }

    if(!v_bTieneCoordenadas){
        var v_sCodCarrer=$('#selectCARRER').val();
        var v_sNumPortal=$('#inputNUM').val();
        if(v_sCodCarrer.toString().trim()!='' && v_sNumPortal.toString().trim()!=''){
            v_bTieneDireccion=true;
        }
    }

    if(!v_bTieneCoordenadas && ! v_bTieneDireccion)
    {
        v_sMensaje=v_sMensaje+"L'adreça o les coordenades són obligatòries"
    }

    return v_sMensaje;
}
