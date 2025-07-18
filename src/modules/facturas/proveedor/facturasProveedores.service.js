import * as repository from "./facturaProveedor.repository.js";

export const obtenerFacturas = () => repository.findAll();
export const obtenerFacturaPorId = (id) => repository.findById(id);
export const crearFactura = (data) => repository.insert(data);
    