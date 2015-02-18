var objComunicat = new Object();

objComunicat.ID = 0;
objComunicat.REFERENCIA = '';
objComunicat.ESTAT = '';
objComunicat.DATA = '';
objComunicat.CODCARRER = '';
objComunicat.CARRER = '';
objComunicat.NUM = '';
objComunicat.COORD_X = '';
objComunicat.COORD_Y = '';
objComunicat.COMENTARI = '';
objComunicat.ID_MSG_MOV = '';
objComunicat.ITE_ID='';
objComunicat.ITE_DESC='';


function comunicat() {
    return objComunicat;
}

function comunicat(aDatos) {
    if (undefined === aDatos) return objComunicat;
    if (void 0 === aDatos) return objComunicat;
    if(aDatos == null) return objComunicat;

    try {
        this.ID = aDatos['id'];
        this.REFERENCIA = aDatos['referencia'] + '';
        this.ESTAT = aDatos['estat'] + '';
        this.DATA = aDatos['data'] + '';
        this.CODCARRER = aDatos['codcarrer'] + '';
        this.CARRER = aDatos['carrer'] + '';
        this.NUM = aDatos['num'] + '';
        this.COORD_X = aDatos['coord_x'] + '';
        this.COORD_Y = aDatos['coord_y'] + '';
        this.COMENTARI = aDatos['comentari'] + '';
        this.ID_MSG_MOV = aDatos['id_msg_mov'] + '';
        this.ITE_ID = aDatos['ite_id'] + '';
        this.ITE_DESC= aDatos['ite_desc'] + '';

        return this;
    } catch (e) { alert('creant objecte : comunicat  ERROR : ' + e.message); return null; }
}

//"ID", "REFERENCIA", "ESTAT", "DATA", "CARRER", "NUM", "COORD_X", "COORD_Y", "COMENTARI"