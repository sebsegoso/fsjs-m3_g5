import { elementById } from './helpers.js';

export const formInputs = {
  nombre: {
    inputId: "nombre",
    helpId: "nombreHelp",
    label: "nombre",
    required: true,
    type: "text",
  },
  apellidos: {
    inputId: "apellidos",
    helpId: "apellidosHelp",
    label: "apellidos",
    required: true,
    type: "text",
  },
  sueldoActual: {
    inputId: "sueldoActual",
    helpId: "sueldoActualHelp",
    label: "sueldo actual",
    required: true,
    type: "number",
  },
  sueldoSemestreAnterior: {
    inputId: "sueldoSemestreAnterior",
    helpId: "sueldoSemestreAnteriorHelp",
    label: "sueldo del semestre anterior",
    required: true,
    type: "number",
  },
  tieneCargas: {
    inputId: "tieneCargas",
    helpId: "tieneCargasHelp",
    label: "tiene cargas",
    required: false,
    type: "boolean",
  },
  cantidadCargas: {
    inputId: "cantidadCargas",
    helpId: "cantidadCargasHelp",
    label: "cantidad de cargas",
    required: false,
    type: "number",
  },
};

/**
 * Valida el formulario.
 * @param {Object} form - Los datos del formulario.
 * @returns {boolean} - Verdadero si el formulario es válido, falso de lo contrario.
 */
export const validateForm = (
  form = {
    nombre: "",
    apellidos: "",
    sueldoActual: 0,
    sueldoSemestreAnterior: 0,
    tieneCargas: false,
    cantidadCargas: 0,
  }
) => {
  let valid = true;
  for (let fieldKey in formInputs) {
    if (formInputs[fieldKey].required && !form[fieldKey]) {
      const helpTag = elementById(formInputs[fieldKey].helpId);
      helpTag.innerHTML = `Ingresa ${formInputs[fieldKey].label}`;
      valid = false;
    }
  }

  if (form.tieneCargas && !form.cantidadCargas) {
    const helpTag = elementById("cantidadCargasHelp");
    helpTag.innerHTML = `Ingresa cuántas cargas tienes`;
    valid = false;
  }

  return valid;
};
