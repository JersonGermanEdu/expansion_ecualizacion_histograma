const inputFile = document.getElementById('inputFile');
const imgCargada = document.getElementById('imgCargada');
const btnProcesar = document.getElementById('btnProcesar');
const btnEcualizar = document.getElementById('btnEcualizar');
const rdExpansion = document.getElementById('rdExpansion');
const rdEcualizacion = document.getElementById('rdEcualizacion');
const lienzo = document.getElementById('lienzo');
const ctx = lienzo.getContext('2d', { willReadFrequently: true });
const btnReset = document.getElementById('btnReset');
const containerReset = document.getElementById('containerReset');
const imagePreview = document.getElementById('imagePreview');
const canvasPreview = document.getElementById('canvasPreview');
const placeholderHistOriginal = document.getElementById('placeholderHistOriginal');
const placeholderHistProcesado = document.getElementById('placeholderHistProcesado');
const histogramaOriginal = document.getElementById('histogramaOriginal');
const histogramaProcesado = document.getElementById('histogramaProcesado');

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
                if (datos[i] !== datos[i + 1] || datos[i] !== datos[i + 2]) {
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
            if (typeof limpiarHistogramas === 'function') {
                limpiarHistogramas();
            }
            generarHistograma(datos, "histogramaOriginal");
            document.querySelector('.placeholder').style.display = 'none';
            imgCargada.style.display = 'block';
            containerReset.style.display = 'block';
            if (imagePreview) {
                imagePreview.classList.add('loaded');
            }
            if (canvasPreview) {
                canvasPreview.classList.add('ready');
            }
            if (placeholderHistOriginal) {
                placeholderHistOriginal.style.display = 'none';
            }
            if (histogramaOriginal) {
                histogramaOriginal.style.display = 'block';
            }
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
    document.querySelectorAll('.placeholder')[1].style.display = 'none';
    lienzo.style.display = 'block';
    generarHistograma(datos, "histogramaProcesado");
    if (placeholderHistProcesado) {
        placeholderHistProcesado.style.display = 'none';
    }
    if (histogramaProcesado) {
        histogramaProcesado.style.display = 'block';
    }

    ctx.putImageData(imagenData, 0, 0);

});

// Botón directo para aplicar ecualización sin depender del radio
if (btnEcualizar) {
    btnEcualizar.addEventListener('click', () => {
        if (!imgCargada.src) {
            alert('Primero carga una imagen en la primera sección.');
            return;
        }

        // forzamos ecualización
        ctx.drawImage(imgCargada, 0, 0);
        const imagenData = ctx.getImageData(0, 0, lienzo.width, lienzo.height);
        let datos = imagenData.data;

        datos = ecualizacion(datos);

        if (canvasPreview) {
            canvasPreview.classList.add('ready');
        }
        generarHistograma(datos, "histogramaProcesado");
        if (placeholderHistProcesado) {
            placeholderHistProcesado.style.display = 'none';
        }
        if (histogramaProcesado) {
            histogramaProcesado.style.display = 'block';
            histogramaProcesado.parentElement?.classList.add('ready');
        }

        ctx.putImageData(imagenData, 0, 0);
    });
}

// Botón de reestablecer / limpiar todo
btnReset.addEventListener('click', () => {
    containerReset.style.display = 'none';
    if (typeof limpiarHistogramas === 'function') {
        limpiarHistogramas();
    }
    lienzo.style.display = 'none';
    imgCargada.style.display = 'none';
    document.querySelectorAll('.placeholder').forEach(placeholder => {
        placeholder.style.display = 'block';
    });
    if (inputFile) inputFile.value = '';
    if (imgCargada) imgCargada.src = '';
    if (lienzo && ctx) ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    if (btnProcesar) btnProcesar.disabled = true;
    if (rdExpansion) {
        rdExpansion.checked = true;
        const hdr = document.querySelector('.header h2');
        if (hdr) hdr.textContent = 'Procesar Expansión de Histograma';
    }
    if (imagePreview) {
        imagePreview.classList.remove('loaded');
    }
    if (canvasPreview) {
        canvasPreview.classList.remove('ready');
    }
    if (placeholderHistOriginal) {
        placeholderHistOriginal.style.display = 'flex';
    }
    if (placeholderHistProcesado) {
        placeholderHistProcesado.style.display = 'flex';
    }
    if (histogramaOriginal) {
        histogramaOriginal.style.display = 'none';
    }
    if (histogramaProcesado) {
        histogramaProcesado.style.display = 'none';
    }

});

