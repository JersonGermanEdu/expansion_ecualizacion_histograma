const inputFile = document.getElementById('inputFile');
const imgCargada = document.getElementById('imgCargada');
const btnProcesar = document.getElementById('btnProcesar');
const rdExpansion = document.getElementById('rdExpansion');
const rdEcualizacion = document.getElementById('rdEcualizacion');
const lienzo = document.getElementById('lienzo');
const ctx = lienzo.getContext('2d', { willReadFrequently: true });

inputFile.addEventListener('change', (event) => {
    const archivo = event.target.files?.[0];
    if (!archivo) {
        return;
    }
    const lector = new FileReader();
    lector.onload = () => {
        const imgTemporal = new Image();
        imgTemporal.onload = () => {
            const offscreen = document.createElement('canvas');
            const offCtx = offscreen.getContext('2d');
            offscreen.width = imgTemporal.naturalWidth;
            offscreen.height = imgTemporal.naturalHeight;
            offCtx.drawImage(imgTemporal, 0, 0);

            const imagenData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
            const datos = imagenData.data;

            for (let i = 0; i < datos.length; i += 4) {
                if (datos[i] !==  datos[i + 1] || datos[i] !== datos[i + 2]) {
                    Swal.fire({
                        icon: "error",
                        title: "IMAGEN INCORRECTA...",
                        text: "La imagen debe estar en escala de grises.",
                    });
                    event.target.value = "";
                    return; 
                }
            }
            imgCargada.src = lector.result;
            lienzo.width = imgTemporal.naturalWidth;
            lienzo.height = imgTemporal.naturalHeight;
            ctx.clearRect(0, 0, lienzo.width, lienzo.height);
            // limpiamos los histogramas anteriores
            document.getElementById('histogramaOriginal').innerHTML = '';
            document.getElementById('histogramaProcesado').innerHTML = '';            
            generarHistograma(datos, "histogramaOriginal");
        }
        imgTemporal.src = lector.result;
    }
    lector.readAsDataURL(archivo);
});

imgCargada.addEventListener('load', () => {
    btnProcesar.disabled = false;
    lienzo.width = imgCargada.naturalWidth;
    lienzo.height = imgCargada.naturalHeight;
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
});

btnProcesar.addEventListener('click', () => {
    if (!imgCargada.src) {
        alert('Primero carga una imagen en la primera sección.');
        return;
    }

    // verificar que se haya seleccionado una opción
    if (!rdExpansion.checked && !rdEcualizacion.checked) {
        alert('Por favor, selecciona una opción de procesamiento (Expansión o Ecualización).');
        return;
    }

    // obtener la opción seleccionada
    const opcionSeleccionada = rdExpansion.checked ? 'expansion' : 'ecualizacion';

    // let imagenData = ctx.getImageData(0, 0, lienzo.width, lienzo.height);
    ctx.drawImage(imgCargada, 0, 0);
    const imagenData = ctx.getImageData(0, 0, lienzo.width, lienzo.height);
    let datos = imagenData.data;

    if (opcionSeleccionada === 'expansion') {
        datos = expansion(datos);
    } else {
        datos = ecualizacion(datos);
    }

    generarHistograma(datos, "histogramaProcesado");

    ctx.putImageData(imagenData, 0, 0);

    // descargar la imagen procesada
    // const enlaceDescarga = document.createElement('a');
    // enlaceDescarga.href = lienzo.toDataURL('image/png');
    // enlaceDescarga.download = `imagen_procesada_${opcionSeleccionada}.png`;
    // enlaceDescarga.click();
});


// Cambiar el título de la sección según la opción seleccionada
rdExpansion.addEventListener('change', () => {
    if (rdExpansion.checked) {
        document.querySelector('.header h2').textContent = 'Procesar Expansión de Histograma';
    }   
});

rdEcualizacion.addEventListener('change', () => {
    if (rdEcualizacion.checked) {
        document.querySelector('.header h2').textContent = 'Procesar Ecualización de Histograma';
    }
});

