const express = require("express");

const {
  prepararAreaReservas,
  validarReserva,
} = require("../middleware/reservas");

const { crearControladorReservas } = require("../controladores/reservas");

function crearReservasRouter(servicio) {
  const router = express.Router();

  const controlador = crearControladorReservas(servicio);

  router.use(prepararAreaReservas);

  router.get("/", controlador.listarReservas);

  router.get("/nueva", controlador.mostrarFormulario);

  router.get("/:id", controlador.mostrarDetalle);

  router.post("/", validarReserva, controlador.crearReserva);

  return router;
}

module.exports = crearReservasRouter;
