const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function validarReserva(req, res, next) {
  const valores = req.body ?? {};

  const estudiante =
    typeof valores.estudiante === "string" ? valores.estudiante.trim() : "";
  const email = typeof valores.email === "string" ? valores.email.trim() : "";
  const sala = typeof valores.sala === "string" ? valores.sala.trim() : "";
  const fecha = typeof valores.fecha === "string" ? valores.fecha.trim() : "";
  const turno = typeof valores.turno === "string" ? valores.turno.trim() : "";

  const personasRecibidas = valores.personas;
  const tipoPersonasValido =
    typeof personasRecibidas === "number" ||
    (typeof personasRecibidas === "string" && personasRecibidas.trim() !== "");
  const personas = tipoPersonasValido ? Number(personasRecibidas) : NaN;

  const errores = [];

  if (!estudiante) {
    errores.push("El estudiante es obligatorio.");
  }

  if (!email) {
    errores.push("El email es obligatorio.");
  } else if (!email.includes("@")) {
    errores.push("El email debe contener @.");
  }

  if (!sala) {
    errores.push("La sala es obligatoria.");
  } else if (!salasPermitidas.includes(sala)) {
    errores.push("La sala seleccionada no está permitida.");
  }

  if (!fecha) {
    errores.push("La fecha es obligatoria.");
  }

  if (!turno) {
    errores.push("El turno es obligatorio.");
  } else if (!turnosPermitidos.includes(turno)) {
    errores.push("El turno seleccionado no está permitido.");
  }

  if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    errores.push(
      "La cantidad de personas debe ser un número entero entre 1 y 6.",
    );
  }

  if (errores.length > 0) {
    if (req.baseUrl === "/api/reservas") {
      return res.status(400).json({ errores });
    }

    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      seccion: "Reservas de salas",
      salasPermitidas,
      turnosPermitidos,
      errores,
      datos: {
        estudiante,
        email,
        sala,
        fecha,
        turno,
        personas: valores.personas ?? "",
      },
    });
  }

  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas,
  };

  next();
}

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

module.exports = {
  salasPermitidas,
  turnosPermitidos,
  validarReserva,
  prepararAreaReservas,
};
