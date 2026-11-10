const {
  conectarBaseDatos,
  cerrarConexion,
  describirErrorConexion,
} = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function listarReservas() {
  try {
    await conectarBaseDatos();
    const reservas = await Reserva.find();

    if (reservas.length === 0) {
      console.log("No hay reservas persistidas en la colección.");
    } else {
      for (const reserva of reservas) {
        console.log("------------------------------");
        console.log(`_id: ${reserva._id.toString()}`);
        console.log(`Estudiante: ${reserva.estudiante}`);
        console.log(`Email: ${reserva.email}`);
        console.log(`Sala: ${reserva.sala}`);
        console.log(`Fecha: ${reserva.fecha}`);
        console.log(`Turno: ${reserva.turno}`);
        console.log(`Personas: ${reserva.personas}`);
      }
    }

    console.log(`Cantidad recuperada: ${reservas.length}`);
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

listarReservas();
