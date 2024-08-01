// Helpers
/**
 * Helper para obtener un elemento por su ID.
 * @param {string} id - El ID del elemento.
 * @returns {HTMLElement} - El elemento HTML.
 */
const elementById = (id) => document.getElementById(id);

/**
 * Formatea un valor numérico como CLP (peso chileno).
 * @param {number} value - El valor numérico.
 * @returns {string} - El valor formateado como CLP.
 */
function toCLP(value) {
  const formatter = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
}

// DOM elements
const form = elementById("sueldoForm");
const resultContainer = elementById("resultado");

// Inputs data
/* Para una validación más dinámica usaremos este objeto,
 *  cada propiedad será su key em el formulario, dentro cada propiedad cumple una función */
const formInputs = {
  nombre: {
    inputId: "nombre" /* id del input */,
    helpId: "nombreHelp" /* id del mensaje de error */,
    label: "nombre" /* etiqueta para un mejor mensaje de error */,
    required: true /* si es requerido o no */,
    type: "text" /* text | number | boolean */,
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
 * Limpia el contenedor de resultados.
 */
const clearResult = () => {
  resultContainer.innerHTML = "";
};

/**
 * Limpia los mensajes de ayuda de todos los inputs.
 */
const clearHelpMessages = () => {
  for (let key in formInputs) {
    const helpElement = elementById(formInputs[key].helpId);
    if (!helpElement) return;
    helpElement.innerHTML = "";
  }
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
 * Valida el formulario.
 * @param {Object} form - Los datos del formulario.
 * @returns {boolean} - Verdadero si el formulario es válido, falso de lo contrario.
 */
const validateForm = (
  form = {
    nombre: "",
    apellidos: "",
    sueldoActual: 0,
    sueldoSemestreAnterior: 0,
    tieneCargas: false,
    cantidadCargas: 0,
  }
) => {
  // Validación de campos requeridos
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

/**
 * Calcula el monto de la asignación familiar.
 * @param {number} sueldoBasePromedioSemestreAnterior - El sueldo base promedio del semestre anterior.
 * @param {boolean} tieneCargas - Indica si el trabajador tiene cargas.
 * @param {number} cantidadCargas - La cantidad de cargas.
 * @returns {number} - El monto de la asignación familiar.
 */
const calculateAssignment = (
  sueldoBasePromedioSemestreAnterior = 0,
  tieneCargas = false,
  cantidadCargas = 0
) => {
  if (!tieneCargas) return 0;

  let monto = 0;

  if (sueldoBasePromedioSemestreAnterior <= 429899) {
    monto = 16828;
  } else if (
    429899 < sueldoBasePromedioSemestreAnterior &&
    sueldoBasePromedioSemestreAnterior <= 627913
  ) {
    monto = 10327;
  } else if (
    627913 < sueldoBasePromedioSemestreAnterior &&
    sueldoBasePromedioSemestreAnterior <= 979330
  ) {
    monto = 3264;
  } else return 0;

  return monto * cantidadCargas;
};

/**
 * Muestra el resultado del cálculo de la asignación familiar.
 * @param {Object} params - Los datos del formulario y el monto de la asignación familiar.
 */
const showResult = ({
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

/**
 * Maneja el envío del formulario.
 * @param {Event} event - El evento de envío del formulario.
 */
const handleSubmit = function (event) {
  event.preventDefault();
  clearResult();
  clearHelpMessages();

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
