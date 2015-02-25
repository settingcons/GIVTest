function AudioGrabacionConfirma() {
    try{
        var v_mensaje = "s'està gravant al teu missatge de veu...";
        var v_titulo = "Gravació";
        var v_botones = "Finalitzar,Descartar";

        var v_imagen = document.getElementById('imgAudioPlay');
        v_imagen.src = "images/play_gray.png";

        //Iniciar Grabación
        _mediaAudio = new Media(_mediaAudioFichero,onSuccessAudio,onErrorAudio);
        _mediaAudio.startRecord();

        if(navigator.notification && navigator.notification.confirm){
            navigator.notification.confirm(v_mensaje,AudioGrabacion,v_titulo,v_botones);
        }
        else
        {
            var v_retorno = confirm(v_mensaje);
            if (v_retorno){
                AudioGrabacion(1);
            }
            else {
                AudioGrabacion(2);
            }
        }
    }
    catch (ex){mensaje(ex.message,"error");}
}
function onSuccessAudio() {
}

function onErrorAudio(error) {
    _inciAudioFichero='';
    mensaje(error.message,"error");
}

function AudioGrabacion(respuesta){
    try{
        //Finalizar grabación
        _mediaAudio.stopRecord();
        if (respuesta==1) {
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
    fileSystem.root.getFile(_mediaAudioFichero, null, LeerFicheroAudio, onErrorAudio);
}
function LeerFicheroAudio(fileEntry) {
    fileEntry.file(LeerFicheroAudioOK, onErrorAudio);
}
// the file is successfully retreived
function LeerFicheroAudioOK(file){
    TransformarFicheroAudioToBase64(file);
}
// turn the file into a base64 encoded string, and update the var base to this value.
function TransformarFicheroAudioToBase64(file) {
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
        //Iniciar Grabación
        _mediaAudio = new Media(_mediaAudioFichero,onSuccessAudioPlay,onErrorAudioPlay);
        _mediaAudio.play();
        if (_mediaTimer == null) {
            _mediaTimer = setInterval(function() {
                // get my_media position
                _mediaAudio.getCurrentPosition(
                    // success callback
                    function(position) {
                        if (position > -1) {
                            var iPos = parseInt(position);
                            if (iPos < 10) {
                                setAudioPosition("0:0" + (iPos), 0);
                            }
                            else
                            {
                                setAudioPosition("0:" + (iPos), 0);
                            }
                            if (iPos==0){
                                setAudioPosition("", 0);
                            }
                        }
                    },
                    // error callback
                    function(e) {
                        setAudioPosition("Error: " + e.message, 1);
                    }
                );
            }, 1000);
        }
    }

}

function setAudioPosition(position, iColor) {
    document.getElementById('audio_position').innerHTML = position;
    if (iColor == 0) {
        // Negro
        document.getElementById('audio_position').style.color='#b80529';
    }
    else{
        // Rojo
        document.getElementById('audio_position').style.color='#ffffff';
    }
}

function onSuccessAudioPlay() {
}

function onErrorAudioPlay(error) {
    mensaje(error.message,"error");
}

function stopAudio() {
    if(_mediaAudio!=null && _mediaAudio){
        _mediaAudio.stop();
    }
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

