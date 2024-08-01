// Helpers

/**
 * Helper para obtener un elemento por su ID.
 * @param {string} id - El ID del elemento.
 * @returns {HTMLElement} - El elemento HTML.
 */
export const elementById = (id) => document.getElementById(id);

/**
 * Formatea un valor numérico como CLP (peso chileno).
 * @param {number} value - El valor numérico.
 * @returns {string} - El valor formateado como CLP.
 */
export function toCLP(value) {
  const formatter = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
}
