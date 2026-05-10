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

    console.log(`Valor mínimo: ${valorMinimo}, Valor máximo: ${valorMaximo}`);
    console.log(`Fórmula de expansión: valor_transformado = ${media} * valor_original + ${b}`);
    // Aplicar la transformación a cada píxel muestreado y actualizar el array original
    for (let i = 0; i < pixelesMuestreados.length; i++) {
        const valorOriginal = pixelesMuestreados[i];
        const valorTransformado = Math.round(media * valorOriginal + b);
        pixelesMuestreados[i] = valorTransformado;
        // console.log(`Pixel ${i}: valor original=${valorOriginal}, valor transformado=${valorTransformado}`);
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

    const cantidadPixeles = datos.length / 4; // Cada píxel tiene 4 componentes (R, G, B, A)
    console.log("Número total de píxeles:", datos);

    // Obtener un componente cada 4 (R, G, B, A)
    const pixelesMuestreados = [];
    for (let i = 0; i < datos.length; i += 4) {
        pixelesMuestreados.push(datos[i]); // Solo tomamos el componente R para la ecualización
    }

    // Contar la frecuencia de cada intensidad
    let frecuencias = {};
    for (let i = 0; i < pixelesMuestreados.length; i++) {
        const valor = pixelesMuestreados[i];
        frecuencias[valor] = (frecuencias[valor] || 0) + 1;
    }

    // Calcular la función de distribución acumulativa (CDF)
    const cdf = [];
    let acumulado = 0;
    for (let i = 0; i < 256; i++) {
        acumulado += frecuencias[i] || 0;
        cdf[i] = acumulado / cantidadPixeles; // Normalizar por el total de píxeles
    }
    console.log("Función de distribución acumulativa (CDF):", cdf);

    // Aplicar la fórmula de ecualización a cada píxel muestreado y actualizar el array original
    for (let i = 0; i < pixelesMuestreados.length; i++) {
        const valorOriginal = pixelesMuestreados[i];
        const valorTransformado = Math.round(cdf[valorOriginal] * 255);
        pixelesMuestreados[i] = valorTransformado;
    }


    return datos;
}