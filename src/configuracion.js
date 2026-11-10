const port = process.env.PORT ? Number(process.env.PORT) : 3000;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT debe ser un número entero entre 1 y 65535.");
}

const nodeEnv = process.env.NODE_ENV || "development";

const configuracion = {
  port,
  nodeEnv,
  formatoMorgan: nodeEnv === "production" ? "combined" : "dev",
};

module.exports = {
  configuracion,
};
