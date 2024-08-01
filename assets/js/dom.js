import { elementById, toCLP } from "./helpers.js";

const resultContainer = elementById("resultado");

/**
 * Limpia el contenedor de resultados.
 */
export const clearResult = () => {
  resultContainer.innerHTML = "";
};

/**
 * Limpia los mensajes de ayuda de todos los inputs.
 */
export const clearHelpMessages = (formInputs) => {
  for (let key in formInputs) {
    const helpElement = elementById(formInputs[key].helpId);
    if (!helpElement) return;
    helpElement.innerHTML = "";
  }
};

/**
 * Muestra el resultado del cálculo de la asignación familiar.
 * @param {Object} params - Los datos del formulario y el monto de la asignación familiar.
 */
export const showResult = ({
  nombre = "",
  apellidos = "",
  sueldoActual = 0,
  sueldoSemestreAnterior = 0,
  tieneCargas = false,
  cantidadCargas = 0,
  asignacionFamiliar = 0,
}) => {
  let textoBase = `Al trabajador ${nombre.toLocaleUpperCase()} ${apellidos.toLocaleUpperCase()} cuyo sueldo base actual es $${toCLP(
    sueldoActual
  )} y el del semestre pasado $${toCLP(sueldoSemestreAnterior)}`;

  if (tieneCargas && cantidadCargas > 0 && asignacionFamiliar > 0) {
    textoBase += ` con ${cantidadCargas} cargas le corresponde un monto de asignación familiar de $${toCLP(
      asignacionFamiliar
    )}, quedando su nuevo sueldo en $${toCLP(
      sueldoActual + asignacionFamiliar
    )}.`;
  } else {
    textoBase += ` no le corresponde asignación familiar.`;
  }

  resultContainer.innerHTML = `
        <h2>Resultado</h2>
        <p>${textoBase}</p>
      `;
};
