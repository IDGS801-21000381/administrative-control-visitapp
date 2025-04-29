// src/services/textProcessor.js

// Función para corregir el texto hasta que esté bien corregido
export async function corregirTexto(textoOriginal) {
  const MAX_PASADAS = 10; // Limite de iteraciones para evitar bucles infinitos
  let texto = textoOriginal;

  for (let pasada = 1; pasada <= MAX_PASADAS; pasada++) {
    const response = await fetch("https://api.languagetoolplus.com/v2/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text: texto,
        language: "es",
      }),
    });

    const { matches } = await response.json();

    // Si no hay más errores, terminamos el proceso
    if (!matches || matches.length === 0) {
      break;
    }

    // Aplico las sugerencias para cada error encontrado
    let offsetAjuste = 0;
    for (let match of matches) {
      if (match.replacements && match.replacements.length > 0) {
        const sugerencia = match.replacements[0].value;
        const inicio = match.offset + offsetAjuste;
        const fin = inicio + match.length;

        texto =
          texto.slice(0, inicio) +
          sugerencia +
          texto.slice(fin);

        // Ajustamos el offset para el siguiente reemplazo
        offsetAjuste += sugerencia.length - match.length;
      }
    }
  }

  return texto;
}

// Función para resumir el texto de manera más coherente
export async function resumirTexto(texto) {
  const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Puede agregar 'Authorization' si el modelo requiere token
    },
    body: JSON.stringify({
      inputs: texto,
    }),
  });

  const data = await response.json();
  return data[0]?.summary_text || "No se pudo resumir el texto.";
}
