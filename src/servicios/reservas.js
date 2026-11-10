function crearServicioReservas(datosIniciales) {
  let reservas = [...datosIniciales];
  let siguienteId = reservas.length + 1;

  function listar() {
    return reservas;
  }

  function buscarPorId(id) {
    return reservas.find((reserva) => reserva.id === id);
  }

  function contar() {
    return reservas.length;
  }

  function crear(datos) {
    const nuevaReserva = {
      id: siguienteId++,
      ...datos,
    };

    reservas.push(nuevaReserva);

    return nuevaReserva;
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
  };
}

module.exports = {
  crearServicioReservas,
};
