function inicioPaginaIdentificacion() {
    try{
        cargaDatosCiudadano();
    }
    catch (ex){
        mensaje(ex.message,"error");
    }
}

function cargaDatosCiudadano(){

    LimpiarDatosCiudadano();
    var objUsu = getDatosUsuario();

    if(objUsu != null)
    {
        if(objUsu.TIPUS=="Interno"){
            estadoControl('inputNOM',false);
            estadoControl('inputCOGNOM1',false);
            estadoControl('inputCOGNOM2',false);
            estadoControl('inputDNI',false);
            estadoControl('inputTELEFON',false);
        }
        $('#inputNOM').val(objUsu.NOM) ;
        $('#inputCOGNOM1').val(objUsu.COGNOM1);
        $('#inputCOGNOM2').val(objUsu.COGNOM2);
        $('#inputDNI').val(objUsu.DNI);
        $('#inputEMAIL').val(objUsu.EMAIL);
        $('#inputTELEFON').val(objUsu.TELEFON);

    }
}


function guardaDatosCiudadano(){
    try
    {
        if (esEmail($('#inputEMAIL').val())) {
            var nom = '';
            var cognom1 = '';
            var cognom2 = '';
            var dni = '';
            var email = '';
            var telefon = '';

            nom = $('#inputNOM').val();
            cognom1 = $('#inputCOGNOM1').val();
            cognom2 = $('#inputCOGNOM2').val();
            dni = $('#inputDNI').val();
            email = $('#inputEMAIL').val();
            telefon = $('#inputTELEFON').val();


            var sParams = {
                p_sNom: nom + '',
                p_sCognom1: cognom1 + '',
                p_sCognom2: cognom2 + '',
                p_sDni: dni + '',
                p_sEmail: email + '',
                p_sTelefon: telefon + ''
            };

            ComprobarUsuarioWS(sParams);
        }
        else
        {
            mensaje('email no vàlid' , 'error');
        }
    }
    catch (e)
    {
        mensaje(e.message , 'error');
    }
}

function ComprobarUsuarioWS(sParams){
    try {
        $.ajax({
            type: 'POST',
            url: 'http://80.39.72.44:8000/wsAPPGIV/wsIncidentNotifierGIV.asmx/Login_v1',
            data: sParams,
            success: ComprobarUsuarioWS_OK,
            error: ComprobarUsuarioWS_ERROR,
            async:false
        });
    }
    catch (ex){
        mensaje(ex.message , 'error');
    }
}

function ComprobarUsuarioWS_OK(datos){
    try{
        var v_sMensaje='';
        if(datos==null){
            v_sMensaje= "No hi ha confirmació de l'enviament de la comunicació ";
        }
        else {
            objUsu = new usuari();
            objUsu.ID = 0;
            $(datos).find("resultado").each(function () {

                $(this).children().each(function () {
                    if (this.tagName == "error") {
                        v_sMensaje=$(this).text().trim();
                    }
                    else {
                        if (this.tagName == "tipo") {
                            objUsu.TIPUS = $(this).text().trim();
                        }
                        else if (this.tagName == "nombre") {
                            objUsu.NOM =(($(this).text()==null)?'':$(this).text().trim());
                        }
                        else if (this.tagName == "apellido1") {
                            objUsu.COGNOM1 = (($(this).text()==null)?'':$(this).text().trim());
                        }
                        else if (this.tagName == "apellido2") {
                            objUsu.COGNOM2 = (($(this).text()==null)?'':$(this).text().trim());
                        }
                        else if (this.tagName == "dni") {
                            objUsu.DNI =(($(this).text()==null)?'':$(this).text().trim());
                        }
                        else if (this.tagName == "telefono") {
                            objUsu.TELEFON =(($(this).text()==null)?'':$(this).text().trim());
                        }
                        else if (this.tagName == "email") {
                            objUsu.EMAIL = $(this).text().trim();
                        }
                    }
                });
            });
        }
        if(v_sMensaje==''){
            if(objUsu.TIPUS=="Externo"){
                objUsu.NOM = $('#inputNOM').val();
                objUsu.COGNOM1 = $('#inputCOGNOM1').val();
                objUsu.COGNOM2 = $('#inputCOGNOM2').val();
                objUsu.DNI = $('#inputDNI').val();
                objUsu.EMAIL = $('#inputEMAIL').val();
                objUsu.TELEFON = $('#inputTELEFON').val();
            }
            guardaObjetoLocal('CIUTADA' , objUsu);
            abrirPagina("pageIndex", false);

        }
        else{
            mensaje(v_sMensaje, 'error');
        }
    }
    catch (ex){
        mensaje(ex.message, 'error');
    }
}
function ComprobarUsuarioWS_ERROR(error){
    mensaje(error.responseText , 'error');
}


function LimpiarDatosCiudadano() {
    try{
        $('#inputNOM').val('');
        $('#inputCOGNOM1').val('');
        $('#inputCOGNOM2').val('');
        $('#inputDNI').val('');
        $('#inputEMAIL').val('');
        $('#inputTELEFON').val('');

        estadoControl('inputNOM', true);
        estadoControl('inputCOGNOM1', true);
        estadoControl('inputCOGNOM2', true);
        estadoControl('inputDNI', true);
        estadoControl('inputTELEFON', true);
    }
    catch (ex){}
}

function SinDatosCiudadano()
{
    var objUsu = getDatosUsuario();
    if (objUsu==null) {
        return true;
    }
    else{
        if (objUsu.NOM != '') return false;
        if (objUsu.COGNOM1 != '') return false;
        if (objUsu.COGNOM2 != '') return false;
        if (objUsu.DNI != '') return false;
        if (objUsu.EMAIL != '') return false;
        if (objUsu.TELEFON != '') return false;
        return true;
    }

}

