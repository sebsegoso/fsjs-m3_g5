/**
 * Calcula el monto de la asignación familiar.
 * @param {number} sueldoBasePromedioSemestreAnterior - El sueldo base promedio del semestre anterior.
 * @param {boolean} tieneCargas - Indica si el trabajador tiene cargas.
 * @param {number} cantidadCargas - La cantidad de cargas.
 * @returns {number} - El monto de la asignación familiar.
 */
export const calculateAssignment = (
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
  