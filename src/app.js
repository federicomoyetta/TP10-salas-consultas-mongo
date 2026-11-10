const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const { manejarErrores } = require("./middleware/errores");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

const crearReservasRouter = require("./rutas/reservas");
const { crearRouterReservasApi } = require("./rutas/reservas-api");
const { crearControladorReservas } = require("./controladores/reservas");

function crearApp(servicio, configuracion) {
  const app = express();

  app.use(morgan(configuracion.formatoMorgan));
  app.use(identificarSolicitud);
  app.use(medirDuracion);

  app.set("view engine", "ejs");
  app.set("views", __dirname + "/../views");

  app.use(expressLayouts);
  app.set("layout", "layouts/main");

  app.use(express.static(__dirname + "/../public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const controlador = crearControladorReservas(servicio);

  app.get("/", (req, res) => {
    res.render("inicio", {
      titulo: "Inicio - Sistema de Reservas",
    });
  });

  app.get("/estado", async (req, res) => {
    res.json({
      servicio: "activo",
      reservas: await servicio.contar(),
      solicitudId: res.locals.solicitudId,
    });
  });

  app.use("/reservas", crearReservasRouter(servicio));
  app.use("/api/reservas", crearRouterReservasApi(controlador));

  app.use((req, res) => {
    if (req.originalUrl.startsWith("/api/")) {
      return res.status(404).json({
        error: "La dirección solicitada no existe.",
      });
    }

    res.status(404).render("no-encontrado", {
      titulo: "404 - Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  app.use(manejarErrores);
  return app;
}

module.exports = {
  crearApp,
};
