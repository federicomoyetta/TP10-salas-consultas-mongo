const {
  conectarBaseDatos,
  cerrarConexion,
  describirErrorConexion,
} = require("../src/config/base-datos");

async function comprobarConexion() {
  try {
    await conectarBaseDatos();
    console.log("Conexión con MongoDB Atlas establecida correctamente.");
  } catch (error) {
    describirErrorConexion(error);
    process.exitCode = 1;
  } finally {
    try {
      await cerrarConexion();
    } catch (errorCierre) {
      console.error(
        `No se pudo cerrar la conexión: ${errorCierre.name || "Error"}.`,
      );
      process.exitCode = 1;
    }
  }
}

comprobarConexion();
