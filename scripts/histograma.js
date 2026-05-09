
function generarHistograma(datos, idContenedor) {

    const pixeles = datos.length / 4; // Cada píxel tiene 4 componentes (R, G, B, A)

    // Obtener un pixel cada 4 componentes (R, G, B, A)
    const pixelesMuestreados = [];
    for (let i = 0; i < datos.length; i += 4) {
        pixelesMuestreados.push(datos[i]); // Solo tomamos el componente R para el histograma em escala de grises
    }

    // Crear un array de intensidades de 0 a 255
    const intensidades = Array.from({ length: 256 }, (_, i) => i);
    // Contar la frecuencia de cada intensidad
    const frecuencias = pixelesMuestreados.reduce((acc, valor) => {
        acc[valor] = (acc[valor] || 0) + 1;
        return acc;
    }, {});
    
    // Crear el trace para Plotly sin decimales en el eje x
    const trace = {
        type: 'bar',
        x: intensidades,
        y: intensidades.map(i => frecuencias[i] || 0),
        marker: {
            color: '#b82929',
            line: {
                width: 1,
                color: ( idContenedor === 'histogramaOriginal' ? '#444444' : '#3b82f6' )
            }
        }
    };
    const data = [trace];

    const layout = {
        title: {
            text: 'Histograma ' + (idContenedor === 'histogramaOriginal' ? 'Original' : 'Procesado'),
        },
        font: { size: 18, color: '#7f7f7f' },
        xaxis: {
            title: {
                text: 'Intensidad de píxel',
                font: {
                    size: 18,
                    color: '#7f7f7f'
                }
            },
            tickmode: 'linear',
            tick0: 0,
            dtick: 25,
        },

    };

    const config = { responsive: true }

    Plotly.newPlot(idContenedor, data, layout, config);


}



