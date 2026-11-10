const {
  conectarBaseDatos,
  cerrarConexion,
  describirErrorConexion,
} = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

const datosReserva = {
  estudiante: "Estudiante de prueba",
  email: "estudiante.prueba@example.com",
  sala: "Sala Norte",
  fecha: "2026-11-10",
  turno: "Mañana",
  personas: 2,
};

async function crearReserva() {
  try {
    await conectarBaseDatos();
    const reserva = new Reserva(datosReserva);
    await reserva.save();
    console.log("Reserva guardada correctamente.");
    console.log(`_id confirmado: ${reserva._id.toString()}`);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      console.error(
        `Reserva rechazada: ${error.name}. Revise los campos informados.`,
      );
      if (error.errors) {
        for (const [campo, detalle] of Object.entries(error.errors)) {
          console.error(`- ${campo}: ${detalle.message}`);
        }
      } else {
        console.error(
          `- ${error.path || "campo"}: valor no convertible al tipo requerido.`,
        );
      }
    } else {
      describirErrorConexion(error);
    }
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

crearReserva();
