function AudioGrabacionConfirma() {
    try{
        var v_mensaje = "s'està gravant al teu missatge de veu...";
        var v_titulo = "Gravació";
        var v_botones = "Finalitzar,Descartar";

        //Iniciar Grabación
        miGlobal_mediaAudio = new Media(miGlobal_mediaAudiosrc,onSuccessAudio,onErrorAudio);
        miGlobal_mediaAudio.startRecord();

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
    miGlobal_inciAudio='';
    mensaje(error.message,"error");
}

function AudioGrabacion(respuesta){
    try{
        //Finalizar grabación
        miGlobal_mediaAudio.stopRecord();
        if (respuesta==1) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, ConvertirFicheroAudioToBase64, onErrorAudio);
            //miGlobal_inciAudio=miGlobal_mediaAudiosrc;
        }
        else{
            miGlobal_inciAudio='';
        }
    }
    catch (ex){mensaje(ex.message,"error");}

}

function ConvertirFicheroAudioToBase64(fileSystem) {
    fileSystem.root.getFile(miGlobal_mediaAudiosrc, null, LeerFicheroAudio, onErrorAudio);
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
        miGlobal_inciAudio = evt.target.result;
    };
    reader.readAsDataURL(file);
}

function AudioReproducir(p_nId){

    var sAudio = leeObjetoLocal('AUDIO_' + p_nID , '');

}