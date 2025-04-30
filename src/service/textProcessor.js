// src/services/textProcessor.js

export const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/(\d+\sveces\))/g, '') // Elimina "(X veces)"
    .replace(/[^\w\sáéíóúñÁÉÍÓÚÑ.,¡!¿?]/gi, '') // Mantiene caracteres básicos en español
    .replace(/\s+/g, ' ') // Elimina espacios múltiples
    .trim();
};


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

// Función corregida para resumir texto
export async function resumirTexto(texto) {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/ESGBERT/summarization-spanish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer TU_API_KEY" // Necesitarás una API key de HuggingFace
      },
      body: JSON.stringify({
        inputs: texto,
        parameters: {
          max_length: 130,
          min_length: 30
        }
      }),
    });

    if (!response.ok) throw new Error("Error en la API");
    
    const data = await response.json();
    return data[0]?.summary_text || texto; // Devuelve el texto original si falla
  } catch (error) {
    console.error("Error al resumir:", error);
    return texto; // Fallback al texto original
  }
}