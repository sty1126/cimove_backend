import * as repository from "./facturaElectronica.repository";

export const obtenerFacturasActivas = () => repository.findAllActivas();
export const obtenerFacturaPorId = (id) => repository.findById(id);
export const crearFactura = (data) => repository.insert(data);
export const actualizarFactura = (id, data) => repository.update(id, data);
export const eliminarFactura = (id) => repository.softDelete(id);
