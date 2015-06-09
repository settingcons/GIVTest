
function salir() {
    if (navigator.app) {
        navigator.app.exitApp();
    } else if (navigator.device) {
        navigator.device.exitApp();
    }
}

