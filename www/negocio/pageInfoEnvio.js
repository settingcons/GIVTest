

function inicioPaginaInfoEnvio() {
    try
    {
        $('#divInfoEspera').show();
        $('#divInfoResultado').hide();

        var objUsu = getDatosUsuario();

        var v_sCodCarrer='';
        var v_sNumPortal='';
        if(!GPSActivado){
            v_sCodCarrer=$('#selectCARRER').val();
            v_sNumPortal=$('#inputNUM').val();
        }
        var  sParams = {p_sIdTipoInci:TipoInciSel.toString().trim()+'',
            p_sNom: objUsu.NOM.toString().trim() + '',
            p_sCognom1:objUsu.COGNOM1.toString().trim() + '',
            p_sCognom2:objUsu.COGNOM2.toString().trim() + '',
            p_sDni:objUsu.DNI.toString().trim() +'',
            p_sEmail:objUsu.EMAIL.toString().trim() + '',
            p_sTelefon:objUsu.TELEFON.toString().trim() + '',
            p_sObs:sComentario.toString().trim() +'',
            p_sCoord:sCoords.toString().trim() + '',
            p_sCodCarrer:v_sCodCarrer.toString().trim()+'',
            p_sNumPortal:v_sNumPortal.toString().trim()+'',
            p_sFoto:sFoto + '',
            p_sVoz: miGlobal_inciAudio + ''
        };


        CrearComunicadoWS(sParams);
    }
    catch (ex){
        mensaje(ex.message,"error");
    }
    $('#divInfoEspera').hide();
    $('#divInfoResultado').show();
}

function CrearComunicadoWS(sParams){
    try {
        $.ajax({
            type: 'POST',
            url: 'http://80.39.72.44:8000/wsAPPGIV/wsIncidentNotifierGIV.asmx/IncidenciaTipus_v1',
            data: sParams,
            success: CrearComunicadoWS_OK,
            error: CrearComunicadoWS_ERROR,
            async:false
        });
    }
    catch (ex){
        mensaje(ex.message,"error");
    }

}

function CrearComunicadoWS_OK(datos){
    var v_bEnvioCorrecto = true;
    var v_sEstado = "";
    var v_sMensaje ="";
    var v_sReferen = "";
    var v_sFecha = "";
    var v_codError="";
    var v_desError="";
    try {

        if (datos == null)  //==> ha habido error
        {
            v_sMensaje="No hi ha confirmació de l'enviament de la comunicació";
            v_sReferen = "-";
            v_sFecha="";
            v_bEnvioCorrecto = false;
        }
        else{ //==> el WS ha devuelto algo

            $(datos).find("resultado").each(function () {
                $(this).children().each(function () {
                    if(this.tagName=="id"){
                        v_sReferen=$(this).text();
                    }
                    else if(this.tagName=="fecha"){
                        v_sFecha=$(this).text();
                    }
                    else if(this.tagName=="codError"){
                        v_codError=$(this).text();
                    }
                    else if(this.tagName=="desError"){
                        v_desError=$(this).text();
                    }
                });
            });

            if(v_codError=="0"){
                v_sMensaje = 'Comunicació notificada [' + v_sReferen + ']\n' + 'Gràcies per la seva col·laboració';
                v_sEstado = "NOTIFICAT";

            }
            else if(v_codError=="1"){
                v_sMensaje = "Comunicació notificada  però amb problemes. [" +v_sReferen + "]\n"+v_desError;
                v_sEstado = "NOTIFICAT";
            }
            else{
                v_sMensaje = 'Comunicació NO notificada : \n ' + v_desError;
                v_sReferen = "ERROR";
                v_sFecha="";
                v_bEnvioCorrecto=false;
                v_sEstado = "PENDENT_ENVIAMENT";
            }

            var v_nIdCom = guardaIncidencia(v_sReferen, v_sEstado,v_sFecha);

            //if(!v_bEnvioCorrecto)
            //{
            guardaFotoEnLocal(v_nIdCom, sFoto);
            guardaAudioEnLocal(v_nIdCom, miGlobal_inciAudio);
            //}

            //eliminarFoto();

            //limpiaVariables('pageNuevaIncidencia');
        }
    }
    catch (ex){
        v_sMensaje='ERROR (exception) en enviarComunicat_WS : \n' + e.code + '\n' + e.message;
    }
    //Mostrar el resultado de la comunicación en pantalla
    $('#lblInfoEnvioText').text(v_sMensaje);
}
function CrearComunicadoWS_ERROR(error){
    var v_nIdCom = guardaIncidencia("-","PENDENT_ENVIAMENT","");
    if (sFoto != null) {guardaFotoEnLocal(v_nIdCom, sFoto);}

    $('#lblInfoEnvioText').text('Error en enviar el comunicat: \n '+error.responseText);
}

function guardaIncidencia(sReferen, sEstado,p_sFecha){
    try {
        var nId = leeObjetoLocal('COMUNICATS_NEXTVAL', -1) + 1;
        var fecha = FechaHoy() + ' ' + HoraAhora();
        var v_sCodCarrer='';
        var v_sCarrer='';
        var v_sNumPortal='';
        if(GPSActivado){
            v_sCodCarrer="";
            v_sCarrer=sDireccionAlta.split(",")[0];
            v_sNumPortal=sDireccionAlta.split(",")[1];
        }
        else
        {
            v_sCodCarrer=$('#selectCARRER').val();
            v_sCarrer=$('#selectCARRER').find(':selected').text();
            v_sNumPortal=$('#inputNUM').val();
        }


        if (p_sFecha == "") {
            fecha = FechaHoy() + ' ' + HoraAhora();
        }
        else {
            fecha = p_sFecha;
        }
        var objComunicat = new comunicat();
        objComunicat.ID = nId;
        objComunicat.REFERENCIA = sReferen.trim();
        objComunicat.ESTAT = sEstado;
        objComunicat.DATA = fecha;
        objComunicat.CODCARRER = v_sCodCarrer;
        objComunicat.CARRER = v_sCarrer;
        objComunicat.NUM = v_sNumPortal;
        objComunicat.COORD_X = sCoord_X + '';
        objComunicat.COORD_Y = sCoord_Y + '';
        objComunicat.COMENTARI = sComentario;
        objComunicat.ITE_ID = sId;
        objComunicat.ITE_DESC = sDescItem;
        objComunicat.ID_MSG_MOV = sReferen.trim();
        guardaObjetoLocal('COMUNICAT_' + nId.toString().trim(), objComunicat);

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

function guardaAudioEnLocal(nId,sAudio){
    guardaObjetoLocal('AUDIO_' + nId.toString().trim() , sAudio);
}

