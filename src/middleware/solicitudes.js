function identificarSolicitud(req, res, next) {
  if (!identificarSolicitud.contador) {
    identificarSolicitud.contador = 1;
  }

  const numero = identificarSolicitud.contador++;

  res.locals.solicitudId = `BIB-${String(numero).padStart(4, "0")}`;

  next();
}

function medirDuracion(req, res, next) {
  const inicio = process.hrtime.bigint();

  res.on("finish", () => {
    const fin = process.hrtime.bigint();
    const duracionMs = Number(fin - inicio) / 1_000_000;

    console.log(
      `[MEDICION] ${res.locals.solicitudId} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duracionMs.toFixed(2)} ms`,
    );
  });

  next();
}

module.exports = {
  identificarSolicitud,
  medirDuracion,
};
