
function mediaAudioFichero(){
    if(esIOS())
    {
        return _mediaAudioFicheroIOSFullPath;
    }
    else
    {
        return _mediaAudioFicheroAndroid;
    }
}
function AudioGrabacionConfirma() {
    try{
        var v_mensaje = "s'està gravant al teu missatge de veu...";
        var v_titulo = "Gravació";
        var v_botones = "Finalitzar,Descartar";

        var v_imagen = document.getElementById('imgAudioPlay');
        v_imagen.src = "images/play_gray.png";

        //Iniciar Grabación
        if(esIOS()) {
            CrearMediaIOS();
        }
        else
        {
            _mediaAudio = new Media(mediaAudioFichero(), onSuccessAudio, onErrorAudio);
            InicializaGrabacion();
        }
    }
    catch (ex){mensaje(ex.message,"error");}
}
function CrearMediaIOS() {
    _mediaAudioFicheroIOSFullPath="";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
        function (fileSystem) {
            fileSystem.root.getFile(_mediaAudioFicheroIOS, {create: true, exclusive: false},
                function (fileEntry) {
                    _mediaAudioFicheroIOSFullPath = fileEntry.fullPath;
                    _mediaAudio = new Media(mediaAudioFichero(), onSuccessAudio, onErrorAudio);
                    InicializaGrabacion();
                },
                onErrorAudio); //of getFile
        }, onErrorAudio); //of requestFileSystem
}

function InicializaGrabacion(){
    _mediaAudio.startRecord();

    alert('InicializaGrabacion 1');
    // Stop recording after 10 sec
    var recTime = 0;
    var recInterval = setInterval(function() {
        recTime = recTime + 1;
        setAudioPosition(recTime + " sec");
        if (recTime >= 10) {
            clearInterval(recInterval);
            mediaRec.stopRecord();
        }
    }, 1000);

    alert('InicializaGrabacion 2');
    AudioGrabacion(1);
    alert('InicializaGrabacion 3');

    //if(navigator.notification && navigator.notification.confirm){
    //    navigator.notification.confirm(v_mensaje,AudioGrabacion,v_titulo,v_botones);
    //}
    //else
    //{
    //    var v_retorno = confirm(v_mensaje);
    //    if (v_retorno){
    //        AudioGrabacion(1);
    //    }
    //    else {
    //        AudioGrabacion(2);
    //    }
    //}

}
function onSuccessAudio() {
}

function onErrorAudio(error) {
    _inciAudioFichero='';
    mensaje(error.message,"error");
}

function AudioGrabacion(respuesta){
    try{
        alert('AudioGrabacion 1');
        //Finalizar grabación
        _mediaAudio.stopRecord();
        if (respuesta==1) {
            alert('AudioGrabacion 2');
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, ConvertirFicheroAudioToBase64, onErrorAudio);
        }
        else{
            _inciAudioFichero='';
            var imagen = document.getElementById('buttonAudioPlay');
            imagen.src = "images/play_gray.png";
        }
    }
    catch (ex){mensaje(ex.message,"error");}

}

function ConvertirFicheroAudioToBase64(fileSystem) {
    alert('ConvertirFicheroAudioToBase64');
        fileSystem.root.getFile( mediaAudioFichero(), null, LeerFicheroAudio, onErrorAudio);
}
function LeerFicheroAudio(fileEntry) {
    alert('LeerFicheroAudio');
    fileEntry.file(LeerFicheroAudioOK, onErrorAudio);
}
// the file is successfully retreived
function LeerFicheroAudioOK(file){
    TransformarFicheroAudioToBase64(file);
}
// turn the file into a base64 encoded string, and update the var base to this value.
function TransformarFicheroAudioToBase64(file) {
    alert('TransformarFicheroAudioToBase64');
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        _inciAudioFichero = evt.target.result;
        _inciAudioFichero  =   _inciAudioFichero.toString().substring(_inciAudioFichero.toString().indexOf(",")+1);
        var imagen = document.getElementById('imgAudioPlay');
        imagen.src = "images/play_red.png";
    };
    reader.readAsDataURL(file);
}

function MostrarAudioReproducir(){
    if (_inciAudioFichero !='') {
        $('#divDatosIncidenciaAudioPlay').show();
    }
    else{
        mensaje("No hi ha fitxer d'àudio per reproduir","avís");
    }
}
function AudioReproducir(){

    if (_inciAudioFichero !=''){
        //var v_imagen1 = document.getElementById('imgAudioPlayPlay');
        //v_imagen1.src = "images/play_gray.png";
        //var v_imagen2 = document.getElementById('imgAudioPlayStop');
        //v_imagen2.src = "images/play_gray.png";

        //Iniciar Reprodución
        //var v_src="data:audio/mpeg;base64," +_inciAudioFichero;
        _mediaAudio = new Media( mediaAudioFichero(),onSuccessAudioPlay,onErrorAudioPlay);
        _mediaAudio.play();
        if (_mediaTimer == null) {
            _mediaTimer = setInterval(function() {
                // get my_media position
                _mediaAudio.getCurrentPosition(
                    // success callback
                    function(position) {
                        if (position > -1) {
                            var iPos = parseInt(position);
                            setAudioPosition(iPos+" seg.");
                        }
                    },
                    // error callback
                    function(e) {
                        setAudioPosition("Error: " + e.message);
                    }
                );
            }, 1000);
        }
    }

}

function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
    document.getElementById('audio_position').style.color='#b80529';
}

function onSuccessAudioPlay() {
}

function onErrorAudioPlay(error) {
    if(error!=null && error.message!=null) {
        mensaje(error.message, "error");
    }
}

function stopAudio() {
    if(_mediaAudio!=null && _mediaAudio){
        _mediaAudio.stop();
    }
    clearInterval(_mediaTimer);
    _mediaTimer=null;
}

function pauseAudio() {
    if(_mediaAudio!=null && _mediaAudio) {
        _mediaAudio.pause();
    }
}


function cerrarAudio() {
    if(_mediaAudio!=null && _mediaAudio) {
        _mediaAudio.stop();
    }
    _mediaAudio=null;
    _mediaTimer=null;
    $('#divDatosIncidenciaAudioPlay').hide();
}

