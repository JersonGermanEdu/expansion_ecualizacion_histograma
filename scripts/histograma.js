function generarHistograma(datos, esOriginal) {

    const intensidades = Array.from({ length: 256 }, (_, i) => i);
    const frecuencias = datos.reduce((acc, valor) => {
        acc[valor] = (acc[valor] || 0) + 1;
        return acc;
    }, {});
    

    const trace1 = {
        type: 'bar',
        x: intensidades,
        y: intensidades.map(i => frecuencias[i] || 0),
        marker: {
            color: '#CCCCCC',
            line: {
                width: 2.5
            }
        }
    };
    const data = [trace1];

    const layout = {
        title: {
            text: 'Histograma original',
        },
        font: { size: 18, color: '#222222' },
        xaxis: {
            title: {
                text: 'Intensidad de píxel',
                font: {
                    size: 18,
                    color: '#7f7f7f'
                }
            }
        },

    };

    const config = { responsive: true }

    Plotly.newPlot('tester', data, layout, config);


}



