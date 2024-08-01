// helpers
const elementById = (id) => document.getElementById(id);
function toCLP(value) {
  const formatter = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
}

//
const form = document.getElementById("sueldoForm");
const resultContainer = document.getElementById("resultado");

const formInputs = {
  nombre: {
    inputId: "nombre",
    label: "nombre",
    helpId: "nombreHelp",
    required: true,
    type: "text",
  },
  apellidos: {
    inputId: "apellidos",
    label: "apellidos",
    helpId: "apellidosHelp",
    required: true,
    type: "text",
  },
  sueldoActual: {
    inputId: "sueldoActual",
    label: "sueldo actual",
    helpId: "sueldoActualHelp",
    required: true,
    type: "number",
  },
  sueldoSemestreAnterior: {
    inputId: "sueldoSemestreAnterior",
    label: "sueldo del semestre anterior",
    helpId: "sueldoSemestreAnteriorHelp",
    required: true,
    type: "number",
  },
  tieneCargas: {
    inputId: "tieneCargas",
    label: "tiene cargas",
    helpId: "tieneCargasHelp",
    required: false,
    type: "boolean",
  },
  cantidadCargas: {
    inputId: "cantidadCargas",
    label: "cantidad de cargas",
    helpId: "cantidadCargasHelp",
    required: false,
    type: "number",
  },
};

const clearResult = () => {
  resultContainer.innerHTML = "";
};
const clearHelpMessages = () => {
  for (let key in formInputs) {
    const helpElement = elementById(formInputs[key].helpId);
    if (!helpElement) return;
    helpElement.innerHTML = "";
  }
};

// input de cantidad de cargas solo se activa si tiene cargas
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
  // validacion de campos requeridos
  let valid = true;
  for (let fieldKey in formInputs) {
    if (formInputs[fieldKey].required && !form[fieldKey]) {
      const helpTag = elementById(formInputs[fieldKey].helpId);

      helpTag.innerHTML = `Ingresa ${formInputs[fieldKey].label}`;

      valid = false;
    }
  }

  if (form.tieneCargas && !form.cantidadCargas) {
    const helpTag = document.getElementById(`cantidadCargasHelp`);
    helpTag.innerHTML = `Ingresa cuántas cargas tienes`;
    valid = false;
  }

  return valid;
};

const getFormData = () => {
  const formData =
    {}; /* objeto para agrupar los valores del form en un solo objeto */

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

// listeners
elementById(formInputs.tieneCargas.inputId).addEventListener(
  "change",
  handleCheckboxChange
);
form.addEventListener("submit", handleSubmit);
