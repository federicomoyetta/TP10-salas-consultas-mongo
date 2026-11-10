const mongoose = require("mongoose");

const esquemaReserva = new mongoose.Schema(
  {
    estudiante: {
      type: String,
      required: [true, "El estudiante es obligatorio."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio."],
      trim: true,
      match: [/@/, "El email debe contener @."],
    },
    sala: {
      type: String,
      required: [true, "La sala es obligatoria."],
      enum: ["Sala Norte", "Sala Sur", "Sala Multimedia"],
    },
    fecha: {
      type: String,
      required: [true, "La fecha es obligatoria."],
      trim: true,
      validate: {
        validator: (valor) => valor.length > 0,
        message: "La fecha no puede estar vacía.",
      },
    },
    turno: {
      type: String,
      required: [true, "El turno es obligatorio."],
      enum: ["Mañana", "Tarde", "Noche"],
    },
    personas: {
      type: Number,
      required: [true, "La cantidad de personas es obligatoria."],
      min: [1, "Debe haber al menos 1 persona."],
      max: [6, "Se permiten como máximo 6 personas."],
      validate: {
        validator: Number.isInteger,
        message: "La cantidad de personas debe ser un número entero.",
      },
    },
    estado: {
      type: String,
      enum: ["pendiente", "confirmada"],
      default: "pendiente",
    },
  },
  {
    versionKey: false,
  },
);

const Reserva = mongoose.model("Reserva", esquemaReserva, "reservas");

module.exports = { Reserva };
