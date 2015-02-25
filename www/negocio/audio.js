function AudioGrabacionConfirma() {
    try{
        var v_mensaje = "s'està gravant al teu missatge de veu...";
        var v_titulo = "Gravació";
        var v_botones = "Finalitzar,Descartar";

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
            imagen.style.display = 'block';
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
        var imagen = document.getElementById('buttonAudioPlay');
        imagen.style.display = 'block';
        imagen.src = "images/play_red.png";
    };
    reader.readAsDataURL(file);
}

function AudioReproducir(){

    if (_inciAudioFichero !=''){
        //Iniciar Grabación
        _mediaAudio = new Media(_mediaAudioFichero,onSuccessAudioPlay,onErrorAudioPlay);
        _mediaAudio.play();
    }

}

function onSuccessAudioPlay() {
}

function onErrorAudioPlay(error) {
    mensaje(error.message,"error");
}
