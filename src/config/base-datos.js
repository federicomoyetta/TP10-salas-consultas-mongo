const dns = require("node:dns");
const mongoose = require("mongoose");
const { obtenerUriMongoDB } = require("./entorno");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function conectarBaseDatos() {
  const uri = obtenerUriMongoDB();
  await mongoose.connect(uri);
  console.log("Conexión a MongoDB establecida con éxito");
  return mongoose.connection;
}

async function cerrarConexion() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

function describirErrorConexion(error) {
  const nombre = error && error.name ? error.name : "Error";
  const codigo = error && error.code ? error.code : "sin código";
  const operacion = error && error.syscall ? error.syscall : "no identificada";

  console.error(`Tipo de error: ${nombre}`);
  console.error(`Código: ${codigo}`);
  console.error(`Operación DNS/red: ${operacion}`);
  console.error(`Mensaje del error: ${error.message}`);

  if (
    ["ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED", "ETIMEDOUT"].includes(codigo)
  ) {
    console.error(
      "Revise la resolución DNS, el acceso de red y la lista de IP permitidas en Atlas.",
    );
  } else if (nombre === "MongoServerError" || codigo === 18) {
    console.error(
      "Posible fallo de autenticación: revise usuario y contraseña de Atlas.",
    );
  } else {
    console.error(
      "Revise MONGODB_URI, la configuración de Atlas y el acceso al clúster.",
    );
  }
}

module.exports = {
  conectarBaseDatos,
  cerrarConexion,
  describirErrorConexion,
};
