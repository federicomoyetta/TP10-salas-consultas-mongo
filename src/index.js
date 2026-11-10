const { configuracion } = require("./config/entorno");
const {
  conectarBaseDatos,
  cerrarConexion,
  describirErrorConexion,
} = require("./config/base-datos");
const { crearServicioReservasMongo } = require("./servicios/reservas-mongo");
const { crearApp } = require("./app");

async function iniciarServidor() {
  try {
    await conectarBaseDatos();

    const servicio = crearServicioReservasMongo();
    const app = crearApp(servicio, configuracion);

    const servidor = app.listen(configuracion.port, () => {
      console.log(
        `Servidor iniciado en http://localhost:${configuracion.port}`,
      );
    });

    async function detenerServidor() {
      servidor.close(async () => {
        await cerrarConexion();
        process.exit(0);
      });
    }

    process.on("SIGINT", detenerServidor);
    process.on("SIGTERM", detenerServidor);
  } catch (error) {
    describirErrorConexion(error);
    await cerrarConexion();
    process.exit(1);
  }
}

iniciarServidor();
