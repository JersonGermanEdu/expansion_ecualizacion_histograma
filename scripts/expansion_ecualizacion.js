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
    // Evitar divisiones por cero cuando todos los píxeles tienen el mismo valor
    const rango = Math.max(1, valorMaximo - valorMinimo);
    const media = 255 / rango;
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

    // Actualizar el array original con los valores transformados (mantener alpha)
    for (let i = 0; i < pixelesMuestreados.length; i++) {
        const indiceOriginal = i * 4;
        const v = Math.round(pixelesMuestreados[i]);
        const vClamped = Math.max(0, Math.min(255, v));
        datos[indiceOriginal] = vClamped;  // Componente R
        datos[indiceOriginal + 1] = vClamped; // Componente G
        datos[indiceOriginal + 2] = vClamped;  // Componente B
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

    // Contar la frecuencia de cada intensidad (0..255)
    const frecuencias = new Array(256).fill(0);
    for (let i = 0; i < pixelesMuestreados.length; i++) {
        frecuencias[pixelesMuestreados[i]]++;
    }

    // Calcular la función de distribución acumulativa (CDF)
    const cdf = new Array(256).fill(0);
    let acumulado = 0;
    for (let i = 0; i < 256; i++) {
        acumulado += frecuencias[i];
        cdf[i] = acumulado / cantidadPixeles; // Normalizar por el total de píxeles
    }

    // Encontrar el primer cdf > 0 (cdfMin) para evitar estirar desde 0
    let cdfMin = 0;
    for (let i = 0; i < 256; i++) {
        if (frecuencias[i] > 0) {
            cdfMin = cdf[i];
            break;
        }
    }

    // Precomputar la tabla de mapeo para eficiencia
    const mapa = new Array(256);
    const denom = 1 - cdfMin;
    for (let i = 0; i < 256; i++) {
        if (denom <= 0) {
            mapa[i] = 0;
        } else {
            mapa[i] = Math.round(((cdf[i] - cdfMin) / denom) * 255);
        }
        if (isNaN(mapa[i])) mapa[i] = 0;
        mapa[i] = Math.max(0, Math.min(255, mapa[i]));
    }

    // Aplicar la tabla de mapeo a los datos originales (mantener alpha)
    for (let i = 0; i < pixelesMuestreados.length; i++) {
        const indiceOriginal = i * 4;
        const orig = pixelesMuestreados[i];
        const n = mapa[orig];
        datos[indiceOriginal] = n;
        datos[indiceOriginal + 1] = n;
        datos[indiceOriginal + 2] = n;
        // alpha se deja como estaba
    }

    return datos;
}