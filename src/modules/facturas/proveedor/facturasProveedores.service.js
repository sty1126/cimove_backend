import * as repository from "./facturasProveedores.repository.js";

export const obtenerFacturas = () => repository.findAll();
export const obtenerFacturaPorId = (id) => repository.findById(id);

// En el servicio - facturasProveedores.service.js
export const insert = (data) => {
  console.log("SERVICE insert recibió:", data);
  console.log("SERVICE detalles:", data.detalles);
  
  const facturaData = {
    id_ordencompra: data.id_ordencompra,
    fecha_facturaproveedor: data.fecha_facturaproveedor,
    monto_facturaproveedor: data.monto_facturaproveedor,
    detalles: data.detalles || [],
  };
  
  console.log("SERVICE enviando a repository:", facturaData);
  return repository.insert(facturaData);
};

