import * as abonoRepo from "./abonos.repository.js";

export const getAbonos = () => abonoRepo.obtenerAbonosActivos();

export const createAbono = async (data) => {
  const { id_facturaproveedor_abonofactura, fecha_abonofactura, monto_abonofactura } = data;

  if (!id_facturaproveedor_abonofactura || !fecha_abonofactura || !monto_abonofactura) {
    throw new Error("Todos los campos son obligatorios");
  }

  return await abonoRepo.insertarAbono(id_facturaproveedor_abonofactura, fecha_abonofactura, monto_abonofactura);
};

export const getAbonosPorFactura = (idFactura) => abonoRepo.obtenerAbonosPorFactura(idFactura);

export const anularAbono = async (id) => {
  const resultado = await abonoRepo.anularAbonoPorId(id);
  if (!resultado) {
    throw new Error("Abono no encontrado");
  }
  return { mensaje: "Abono anulado correctamente", abono: resultado };
};

export const getTotalAbonadoPorFactura = (idFactura) => abonoRepo.calcularTotalAbonado(idFactura);
