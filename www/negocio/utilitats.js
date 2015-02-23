var globalMarcadorMapa = null;
var _mapaMarcador=null;
var _mapaEvento=null;

var lista_ERROR_SQL = new Array();
lista_ERROR_SQL[0] = 'ERROR desconegut';
lista_ERROR_SQL[1] = 'ERROR de base de dades';
lista_ERROR_SQL[2] = 'ERROR de versió';
lista_ERROR_SQL[3] = 'ERROR : massa llarg';
lista_ERROR_SQL[4] = 'ERROR : quota';
lista_ERROR_SQL[5] = 'ERROR de sintaxi';
lista_ERROR_SQL[6] = 'ERROR en constraint';
lista_ERROR_SQL[7] = 'ERROR timeout';


String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

function localStorageRun() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function salir() {
    if (navigator.app) {
        navigator.app.exitApp();
    } else if (navigator.device) {
        navigator.device.exitApp();
    }
}


function localStorageSupport() {
    if ("localStorage" in window && window["localStorage"] != null)
        return true;
    else
        return false;
}

function phoneGapRun() {
    return(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/));
}

function mensaje(msg,titulo) {
    if(phoneGapRun())
        navigator.notification.alert(msg, null, titulo);
    else
        alert(msg);

}


function eliminarMarcadorMapa() {
    if (globalMarcadorMapa != null) {
        globalMarcadorMapa.setMap(null);
        globalMarcadorMapa = null;
    }
}


function nuevoMarcadorSobrePlanoClickInfoWindow1(sMODO, mapa, pos,htmlText, nIcono) {
    try {



        var sIcono = '';
        if (nIcono != null) sIcono = "images/iconosMapa/number_" + nIcono.toString().trim() + ".png";

        var marcador = new google.maps.Marker({
            position: pos,
            icon: sIcono,
            map: mapa
        });
        globalMarcadorMapa = marcador;

        if (sMODO == 'ALTA') {
            mapa.setCenter(pos);
        }
        else {
            if (htmlText != null && htmlText.toString().trim() != '') {
                google.maps.event.addListener(marcador, 'click', function () {
                    verDatosComunicat(htmlText);
                });
            }
        }
    }
    catch (ex) {
        mensaje(ex.message,"error");
    }

}

function crearMarcadorEventoClick1( map){
    google.maps.event.addListener(map, 'click', function(event) {
        _mapaMarcador=map;
        _mapaEvento=event;
        CambiarMarcadorConfirm();
    });
}

function CambiarMarcadorConfirm() {
    var v_mensaje = "'Està segur de voler canviar la ubicació?";
    var v_titulo = "Ubicació";
    var v_botones = "SI,NO";

    if(navigator.notification && navigator.notification.confirm){
        navigator.notification.confirm(v_mensaje,CambiarMarcador,v_titulo,v_botones);
    }
    else
    {
        var v_retorno = confirm(v_mensaje);
        if (v_retorno){

            CambiarMarcador(1);
        }
        else {
            CambiarMarcador(2);
        }
    }
}

function CambiarMarcador(p_respuesta) {
    try {

        if (p_respuesta == 1) {
            eliminarMarcadorMapa();

            posAlta = _mapaEvento.latLng;
            _mapaMarcador.setCenter(posAlta);

            sDireccionAlta = '';
            cogerDireccion(_mapaEvento.latLng, true);   //true ==> solo calle y num

            $.doTimeout(700, function () {
                if (sDireccionAlta == '') {
                    sDireccionAlta = _mapaEvento.latLng.lat() + " , " + _mapaEvento.latLng.lng();
                    $('#labelDireccion').text(sDireccionAlta);
                }
                eliminarMarcadorMapa();
                nuevoMarcadorSobrePlanoClickInfoWindow1("ALTA", _mapaMarcador, _mapaEvento.latLng, '', null);

            });
        }
    }
    catch (ex){
        mensaje(ex.message,"error");
    }

}

function cogerCalleNumDeDireccion(sDireccion){
    var sDev = '';
    try
    {
        if(indefinidoOnullToVacio(sDireccion) != '')
                sDev = sDireccion.split(",")[0] + ", " + sDireccion.split(",")[1];
    }
    catch(e) {}
    return sDev;
}

function FechaHoy() {
    var d = new Date();
    return (parseInt(d.getDate()) < 10 ? '0' : '') + d.getDate().toString() + '/' + (parseInt(d.getMonth() + 1) < 10 ? '0' : '') + (parseInt(d.getMonth()) + 1).toString() + '/' + d.getFullYear().toString();
}

function HoraAhora() {
    var d = new Date();
    return (parseInt(d.getHours()) < 10 ? '0' : '') + d.getHours().toString() + ':' + (parseInt(d.getMinutes()) < 10 ? '0' : '') + d.getMinutes().toString() + ":00" ;
}

function ReplicateString(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 0) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result;
}

function estadoControl(control, bHabilitar){
    if(bHabilitar)
    {
        try{ $('#' + control).removeAttr("disabled", "disabled"); } catch(e) {}
        try{ $('#' + control).removeClass('ui-disabled'); } catch(e) {}
        try{ $('#' + control).attr("enabled", "enabled"); } catch(e) {}
        try{ $('#' + control).addClass('ui-enabled'); } catch(e) {}
    }
    else
    {
        try{ $('#' + control).removeAttr("enabled", "enabled"); } catch(e) {}
        try{ $('#' + control).removeClass('ui-enabled'); } catch(e) {}
        try{ $('#' + control).attr("disabled", "disabled"); } catch(e) {}
        try{ $('#' + control).addClass('ui-disabled'); } catch(e) {}
    }
}

function estadoBoton(boton, bHabilitar){
    if(bHabilitar)
    {
        try{ $('#' + boton).button('enable'); } catch(e) { }
        try{ $('#' + boton).attr("enabled", "enabled"); } catch(e) {}
        try{ $('#' + boton).removeClass('ui-disabled'); } catch(e) {}
    }
    else
    {
        try{ $('#' + boton).button('disable'); } catch(e) { }
        try{ $('#' + boton).addClass('ui-disabled'); } catch(e) { }
        try{ $('#' + boton).attr("disabled", "disabled"); } catch(e) { }
    }

    try{ $('#' + boton).attr("onclick", ""); } catch(e) { }
    try{ $('#' + boton).attr('href', '');  } catch(e) { }
    try{ $('#' + boton).button('refresh');  } catch(e) { }
}

//cambiar el texto de un boton
(function($) {
    /*
     * Changes the displayed text for a jquery mobile button.
     * Encapsulates the idiosyncracies of how jquery re-arranges the DOM
     * to display a button for either an <a> link or <input type="button">
     */
    $.fn.changeButtonText = function(newText) {
        return this.each(function() {
            $this = $(this);
            if( $this.is('a') ) {
                $('span.ui-btn-text',$this).text(newText);
                return;
            }
            if( $this.is('input') ) {
                $this.val(newText);
                // go up the tree
                var ctx = $this.closest('.ui-btn');
                $('span.ui-btn-text',ctx).text(newText);
                return;
            }
        });
    };
})(jQuery);

function indefinidoOnullToVacio(algo){
    if (undefined === algo) return '';
    if (void 0 === algo) return '';
    if(algo == null) return '';
    return algo;
}


function esEmail(email) {
    if(indefinidoOnullToVacio(email) != '') {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
}

function esTelefono(telefono){
    if(indefinidoOnullToVacio(telefono) != '')
    {
        if(telefono.length != 9 ) return false;
        if(Number(telefono)!= telefono) return false;
        return true;
    }
    else
        return false;
}

function esDni(dni){
        var numero;
        var le;
        var letra;
        var expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

        dni = dni.toUpperCase();

        if(expresion_regular_dni.test(dni) === true){
            numero = dni.substr(0,dni.length-1);
            numero = numero.replace('X', 0);
            numero = numero.replace('Y', 1);
            numero = numero.replace('Z', 2);
            le = dni.substr(dni.length-1, 1);
            numero = numero % 23;
            letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
            letra = letra.substring(numero, numero+1);
            if (letra != le) {
                //alert('Dni erroneo, la letra del NIF no se corresponde');
                return false;
            }else{
                //alert('Dni correcto');
                return true;
            }
        }else{
            return false;
        }
}

function cargaLetrasAbcdario(combo, sTitulo, nLetraSel){
    combo.empty();
    var h=0;
    var aLetras = new Array();
    for(n=65; n<92; n++)
    {
        aLetras[h++] = String.fromCharCode(n);
    }
    h--;
    for(i=0; i<10; i++)
        aLetras[h++] = (i).toString();

    var letras = [];
    letras.push("<option value='-1' data-placeholder='true'>" + sTitulo + "</option>");
    for (var x = 0; x < aLetras.length; x++)
    {
        letras.push("<option value='" + x + "'>" + aLetras[x] + "</option>");
    }
    //$('#selectLletraIniCARRER').append(letras.join('')).selectmenu('refresh');
    combo.append(letras.join('')).selectmenu('refresh');

    if(indefinidoOnullToVacio(nLetraSel) != '')
    {
        //Preseleccionar nLetraSel
        combo[0].selectedIndex = nLetraSel - 64;
        combo.selectmenu("refresh");

        cargaCarrersEnArray(); //rellena el array de calles que empiezan por esa letra desde el fic XML
        cargaCalles();  //rellenae el combo desde el array de Carrers
    }
}

