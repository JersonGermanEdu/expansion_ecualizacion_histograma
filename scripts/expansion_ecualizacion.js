function expansion(datos) {
    // obtener un componente cada 4 (R, G, B, A)
    const pixelesMuestreados = [];
    for (let i = 0; i < datos.length; i += 4) {
        pixelesMuestreados.push(datos[i]); // Solo tomamos el componente R para la expansión
    }

    // Encontrar el valor mínimo y máximo de los píxeles muestreados
    // const valorMinimo = Math.min(...pixelesMuestreados);
    // const valorMaximo = Math.max(...pixelesMuestreados);
    const valorMinimo = pixelesMuestreados.reduce((a, b) => Math.min(a, b), Infinity);
    const valorMaximo = pixelesMuestreados.reduce((a, b) => Math.max(a, b), -Infinity);
    

    // Aplicar la fórmula de expansión del histograma a cada pixel Muestreado
    const media = 255 / (valorMaximo - valorMinimo);
    const b = -valorMinimo * media;

    // Aplicar la transformación a cada píxel muestreado y actualizar el array original
    for (let i = 0; i < pixelesMuestreados.length; i++) {
        const valorOriginal = pixelesMuestreados[i];
        const valorTransformado = Math.round(media * valorOriginal + b);
        // console.log(`Pixel ${i}: valor original=${valorOriginal}, valor transformado=${valorTransformado}`);
        pixelesMuestreados[i] = valorTransformado;
    }

    // Actualizar el array original con los valores transformados
    for (let i = 0; i < pixelesMuestreados.length; i++) {
        const indiceOriginal = i * 4;
        datos[indiceOriginal] = pixelesMuestreados[i];  // Componente R
        datos[indiceOriginal + 1] = pixelesMuestreados[i]; // Componente G
        datos[indiceOriginal + 2] = pixelesMuestreados[i];  // Componente B
        // El componente A (transparencia) se mantiene sin cambios
    }

    return datos;
}

function ecualizacion(datos) {
    // Implementación de la ecualización del histograma
    return datos;
}