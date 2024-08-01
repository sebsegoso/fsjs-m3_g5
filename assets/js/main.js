import { elementById } from "./helpers.js";
import { formInputs, validateForm } from "./validation.js";
import { clearResult, clearHelpMessages, showResult } from "./dom.js";
import { calculateAssignment } from "./calculations.js";

// DOM elements
const form = elementById("sueldoForm");

/**
 * Obtiene los datos del formulario y los agrupa en un objeto.
 * @returns {Object} - Los datos del formulario.
 */
const getFormData = () => {
  const formData = {}; // Objeto para agrupar los valores del formulario

  for (let key in formInputs) {
    const input = elementById(formInputs[key].inputId);
    const inputType = formInputs[key].type;

    switch (inputType) {
      case "boolean":
        formData[key] = !!input.checked;
        break;
      case "number":
        formData[key] = Number(input.value);
        break;
      default:
        formData[key] = input.value?.trim();
    }
  }

  return formData;
};

// Manejo de cambios en el checkbox "tiene cargas"
/**
 * Habilita o deshabilita el input de cantidad de cargas basado en el estado del checkbox "tiene cargas".
 */
const handleCheckboxChange = function () {
  const tieneCargas = elementById(formInputs.tieneCargas.inputId).checked;
  const cantidadCargasInput = elementById(formInputs.cantidadCargas.inputId);
  const cantidadCargasHelp = elementById(formInputs.cantidadCargas.helpId);

  if (tieneCargas) {
    cantidadCargasInput.disabled = false;
  } else {
    cantidadCargasInput.disabled = true;
    cantidadCargasInput.value = "";
    cantidadCargasHelp.innerHTML = "";
  }
};

/**
 * Maneja el envío del formulario.
 * @param {Event} event - El evento de envío del formulario.
 */
const handleSubmit = function (event) {
  event.preventDefault();
  clearResult();
  clearHelpMessages(formInputs);

  const formData = getFormData();

  const isValid = validateForm(formData);
  if (!isValid) return;

  formData.asignacionFamiliar = calculateAssignment(
    formData.sueldoSemestreAnterior,
    formData.tieneCargas,
    formData.cantidadCargas
  );

  showResult(formData);
  form.reset();
};

// Listeners
elementById(formInputs.tieneCargas.inputId).addEventListener(
  "change",
  handleCheckboxChange
);
form.addEventListener("submit", handleSubmit);
