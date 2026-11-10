const Reserva = require("../src/modelos/Reserva");

const reservaValida = {
  estudiante: "Estudiante de prueba",
  email: "estudiante.prueba@example.com",
  sala: "Sala Norte",
  fecha: "2026-11-10",
  turno: "Mañana",
  personas: 2,
};

const casos = [
  {
    nombre: "Estudiante vacío",
    cambios: { estudiante: "   " },
  },
  {
    nombre: "Email sin arroba",
    cambios: { email: "estudiante.example.com" },
  },
  {
    nombre: "Sala no permitida",
    cambios: { sala: "Sala Oeste" },
  },
  {
    nombre: "Fecha vacía",
    cambios: { fecha: "   " },
  },
  {
    nombre: "Turno no permitido",
    cambios: { turno: "Madrugada" },
  },
  {
    nombre: "Personas igual a 0",
    cambios: { personas: 0 },
  },
  {
    nombre: "Personas igual a 7",
    cambios: { personas: 7 },
  },
  {
    nombre: "Personas decimal",
    cambios: { personas: 2.5 },
  },
  {
    nombre: "Personas con texto",
    cambios: { personas: "dos" },
  },
];

async function main() {
  for (const caso of casos) {
    const reserva = new Reserva({
      ...reservaValida,
      ...caso.cambios,
    });

    try {
      await reserva.validate();
      console.log(`NO RECHAZADO: ${caso.nombre}`);
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError") {
        console.log(`RECHAZADO CORRECTAMENTE: ${caso.nombre}`);
      } else {
        throw error;
      }
    }
  }
}

main().catch((error) => {
  console.error("Error durante las pruebas:", error.message);
  process.exitCode = 1;
});
