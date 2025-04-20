import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import productosRoutes from "./routes/productos.routes.js";
import inventarioRoutes from "./routes/inventario.routes.js";
import inventarioLocalRoutes from "./routes/inventariolocal.routes.js";
import categoriasRoutes from "./routes/categoria.routes.js";
import sedesRoutes from "./routes/sedes.routes.js";
import movimientoRoutes from "./routes/movimiento.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import proveedorProductoRoutes from "./routes/proveedorProducto.routes.js";
import proveedoresRoutes from "./routes/proveedores.routes.js";
import tiposProveedorRoutes from "./routes/tipoproveedor.routes.js";
import ciudadesRoutes from "./routes/ciudades.routes.js";
import abonosRoutes from "./routes/abonos.routes.js";
import facturasProveedorRoutes from "./routes/facturasProveedores.routes.js";
import ordenesCompraRoutes from "./routes/ordenesCompra.routes.js";
import empleadosRoutes from "./routes/empleados.routes.js";
import tiposDocumentoRoutes from "./routes/tiposDocumento.routes.js";
import tiposUsuarioRoutes from "./routes/tiposUsuario.routes.js";
import tipoclienteRoutes from "./routes/tiposCliente.routes.js";
import metodoPagoRoutes from "./routes/metodosPago.routes.js";
import tipoMetodoPagoRoutes from "./routes/tiposMetodoPago.routes.js";
import facturaElectronicaRoutes from "./routes/facturaElectronica.routes.js";
import facturaRoutes from "./routes/factura.routes.js";
import servicioTecnicoRoutes from "./routes/servicioTecnico.routes.js";

const app = express();

app.use(cors()); // CORS
app.use(express.json()); // Uso de json

// rutas de la API
app.use("/api/productos", productosRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/inventariolocal", inventarioLocalRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/sedes", sedesRoutes);
app.use("/api/movimientos", movimientoRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/proveedor-producto", proveedorProductoRoutes);
app.use("/api/tipoproveedores", tiposProveedorRoutes);
app.use("/api/ciudades", ciudadesRoutes);
app.use("/api/abonos", abonosRoutes);
app.use("/api/facturas-proveedor", facturasProveedorRoutes);
app.use("/api/ordenes", ordenesCompraRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/tipodocumento", tiposDocumentoRoutes);
app.use("/api/tipousuario", tiposUsuarioRoutes);
app.use("/api/tipocliente", tipoclienteRoutes);
app.use("/api/metodospago", metodoPagoRoutes);
app.use("/api/tipometodopago", tipoMetodoPagoRoutes);
app.use("/api/factura-electronica", facturaElectronicaRoutes);
app.use("/api/factura", facturaRoutes);
app.use("/api/serviciotecnico", servicioTecnicoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
