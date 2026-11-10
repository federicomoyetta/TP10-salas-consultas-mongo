function validarCambioReserva(req, res, next) {
  const cuerpo = req.body;

  function rechazar() {
    return res.status(400).json({
      errores: ["Los datos de la reserva no son válidos."],
    });
  }

  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    return rechazar();
  }

  const completos = [
    "estudiante",
    "email",
    "sala",
    "fecha",
    "turno",
    "personas",
    "estado",
  ];

  const permitidos = req.method === "PUT" ? completos : ["personas", "estado"];

  const claves = Object.keys(cuerpo);

  if (
    claves.length === 0 ||
    claves.some((campo) => !permitidos.includes(campo)) ||
    (req.method === "PUT" &&
      completos.some((campo) => !Object.hasOwn(cuerpo, campo)))
  ) {
    return rechazar();
  }

  const datos = {};

  for (const campo of claves) {
    const valor = cuerpo[campo];

    if (campo === "personas") {
      if (
        typeof valor !== "number" &&
        (typeof valor !== "string" || !valor.trim())
      ) {
        return rechazar();
      }

      const numero = Number(valor);

      if (
        !Number.isFinite(numero) ||
        !Number.isInteger(numero) ||
        numero < 1 ||
        numero > 6
      ) {
        return rechazar();
      }

      datos[campo] = numero;
    } else if (campo === "estado") {
      if (valor !== "pendiente" && valor !== "confirmada") {
        return rechazar();
      }

      datos[campo] = valor;
    } else {
      if (typeof valor !== "string" || !valor.trim()) {
        return rechazar();
      }

      const texto = valor.trim();

      if (campo === "email" && !texto.includes("@")) {
        return rechazar();
      }

      if (
        campo === "sala" &&
        !["Sala Norte", "Sala Sur", "Sala Multimedia"].includes(texto)
      ) {
        return rechazar();
      }

      if (campo === "turno" && !["Mañana", "Tarde", "Noche"].includes(texto)) {
        return rechazar();
      }

      datos[campo] = texto;
    }
  }

  req.cambiosValidos = datos;
  next();
}

module.exports = {
  validarCambioReserva,
};
