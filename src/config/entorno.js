const port = process.env.PORT ? Number(process.env.PORT) : 3000;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT debe ser un número entero entre 1 y 65535.");
}

const nodeEnv = process.env.NODE_ENV || "development";

function obtenerUriMongoDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || !uri.trim()) {
    throw new Error("Configuración inválida: falta la variable MONGODB_URI.");
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error(
      "Configuración inválida: MONGODB_URI debe comenzar con mongodb:// o mongodb+srv://.",
    );
  }

  return uri;
}

const configuracion = {
  port,
  nodeEnv,
  formatoMorgan: nodeEnv === "production" ? "combined" : "dev",
};

module.exports = {
  configuracion,
  obtenerUriMongoDB,
};
