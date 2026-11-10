function manejarErrores(err, req, res, next) {
  void next;
  console.error("Error en la solicitud:", err.message);

  const esApi = req.originalUrl.startsWith("/api/");

  const esJsonMalFormado =
    err instanceof SyntaxError && err.status === 400 && "body" in err;

  const esErrorDeValidacion = err.name === "ValidationError";

  const esErrorDeEntrada =
    err.codigo === "ID_INVALIDO" ||
    err.codigo === "FILTRO_INVALIDO" ||
    err.codigo === "ENTRADA_INVALIDA" ||
    esJsonMalFormado ||
    esErrorDeValidacion;

  if (esApi) {
    if (esErrorDeEntrada) {
      return res.status(400).json({
        error: "Los datos enviados no son válidos.",
      });
    }

    return res.status(500).json({
      error: "Ocurrió un error interno del servidor.",
    });
  }

  res.status(500).render("no-encontrado", {
    titulo: "500 - Error del servidor",
    mensaje: "Ocurrió un error interno del servidor.",
  });
}

module.exports = { manejarErrores };
