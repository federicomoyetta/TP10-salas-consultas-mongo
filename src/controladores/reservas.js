const { salasPermitidas, turnosPermitidos } = require("../middleware/reservas");

function crearControladorReservas(servicio) {
  async function listarReservas(req, res) {
    const reservas = await servicio.listar();

    res.render("reservas/lista", {
      titulo: "Reservas",
      reservas,
    });
  }

  function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      salasPermitidas,
      turnosPermitidos,
      errores: [],
      datos: {},
    });
  }

  async function mostrarDetalle(req, res) {
    const reserva = await servicio.buscarPorId(req.params.id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "La reserva solicitada no existe.",
      });
    }

    res.render("reservas/detalle", {
      titulo: `Reserva #${reserva.id}`,
      reserva,
    });
  }

  async function crearReserva(req, res) {
    await servicio.crear(req.reservaValidada);
    res.redirect("/reservas");
  }

  async function listarApi(req, res) {
    const parametrosPermitidos = ["sala", "orden", "pagina", "limite"];
    if (
      Object.keys(req.query).some(
        (parametro) => !parametrosPermitidos.includes(parametro),
      )
    ) {
      return res.status(400).json({
        error: "La consulta contiene parámetros no permitidos.",
      });
    }

    const sala = req.query.sala;
    const orden = req.query.orden;
    const paginaTexto = req.query.pagina;
    const limiteTexto = req.query.limite;

    if (sala !== undefined && (typeof sala !== "string" || !sala.trim())) {
      return res.status(400).json({
        error: "El filtro de sala no es válido.",
      });
    }

    if (
      orden !== undefined &&
      (typeof orden !== "string" ||
        !["estudiante", "personas-asc", "personas-desc"].includes(orden))
    ) {
      return res.status(400).json({
        error: "El orden indicado no es válido.",
      });
    }

    if (
      paginaTexto !== undefined &&
      (typeof paginaTexto !== "string" || !paginaTexto.trim())
    ) {
      return res.status(400).json({
        error: "La página indicada no es válida.",
      });
    }

    if (
      limiteTexto !== undefined &&
      (typeof limiteTexto !== "string" || !limiteTexto.trim())
    ) {
      return res.status(400).json({
        error: "El límite indicado no es válido.",
      });
    }

    const pagina = paginaTexto === undefined ? 1 : Number(paginaTexto);
    const limite = limiteTexto === undefined ? 2 : Number(limiteTexto);

    if (!Number.isInteger(pagina) || pagina < 1 || pagina > 1000) {
      return res.status(400).json({
        error: "La página debe ser un entero entre 1 y 1000.",
      });
    }

    if (!Number.isInteger(limite) || limite < 1 || limite > 20) {
      return res.status(400).json({
        error: "El límite debe ser un entero entre 1 y 20.",
      });
    }

    const resultado = await servicio.consultar(sala, orden, pagina, limite);

    res.json(resultado);
  }

  async function obtenerApi(req, res) {
    const reserva = await servicio.buscarPorId(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.json(reserva);
  }

  async function crearApi(req, res) {
    const reserva = await servicio.crear(req.reservaValidada);

    res.location(`/api/reservas/${reserva.id}`).status(201).json(reserva);
  }

  async function reemplazarApi(req, res) {
    const reserva = await servicio.reemplazar(
      req.params.id,
      req.cambiosValidos,
    );

    if (!reserva) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.status(200).json(reserva);
  }

  async function actualizarApi(req, res) {
    const reserva = await servicio.actualizar(
      req.params.id,
      req.cambiosValidos,
    );

    if (!reserva) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.status(200).json(reserva);
  }

  async function eliminarApi(req, res) {
    const eliminada = await servicio.eliminar(req.params.id);

    if (!eliminada) {
      return res.status(404).json({
        error: "La reserva solicitada no existe.",
      });
    }

    res.status(204).send();
  }

  return {
    listarReservas,
    mostrarFormulario,
    mostrarDetalle,
    crearReserva,
    listarApi,
    obtenerApi,
    crearApi,
    reemplazarApi,
    actualizarApi,
    eliminarApi,
  };
}

module.exports = {
  crearControladorReservas,
};
