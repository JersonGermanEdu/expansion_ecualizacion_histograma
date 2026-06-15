
const histogramCharts = {
    original: null,
    procesado: null,
};

 async function generarHistograma(datos, idContenedor) {
    const pixelesMuestreados = [];
    for (let i = 0; i < datos.length; i += 4) {
        pixelesMuestreados.push(datos[i]); // Solo tomamos el componente R para el histograma en escala de grises
    }

    const intensidades = Array.from({ length: 256 }, (_, i) => i);
    const frecuencias = pixelesMuestreados.reduce((acc, valor) => {
        acc[valor] = (acc[valor] || 0) + 1;
        return acc;
    }, {});

    const valores = intensidades.map(i => frecuencias[i] || 0);
    const esOriginal = idContenedor === 'histogramaOriginal';
    const chartKey = esOriginal ? 'original' : 'procesado';

    const ctx = document.getElementById(idContenedor);
    if (!ctx) {
        console.warn(`No se encontró el canvas ${idContenedor}`);
        return;
    }

    if (histogramCharts[chartKey]) {
        histogramCharts[chartKey].destroy();
    }

    await new Promise(resolve => setTimeout(resolve, 100)); // Pequeña pausa para asegurar que el canvas esté listo
    histogramCharts[chartKey] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: intensidades,
            datasets: [{
                label: 'Frecuencia',
                data: valores,
                backgroundColor: esOriginal ? 'rgba(184, 41, 41, 0.55)' : 'rgba(59, 130, 246, 0.65)',
                borderColor: esOriginal ? 'rgba(57, 50, 50, 0.95)' : 'rgba(29, 78, 216, 0.95)',
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Intensidad de píxel',
                        font: { size: 16 },
                    },
                    ticks: {
                        maxTicksLimit: 17,
                        color: '#333',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frecuencia',
                        font: { size: 16 },
                    },
                    ticks: {
                        color: '#333',
                    },
                },
            },
        },
    });
}

function limpiarHistogramas() {
    Object.keys(histogramCharts).forEach((key) => {
        if (histogramCharts[key]) {
            histogramCharts[key].destroy();
            histogramCharts[key] = null;
        }
    });
}



