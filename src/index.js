import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import productosRoutes from "./modules/productos/productos.routes.js";
import inventarioRoutes from "./modules/inventario/inventario.routes.js";
import inventarioLocalRoutes from "./modules/inventario/inventarioLocal/inventariolocal.routes.js";
import categoriasRoutes from "./modules/categoria/categoria.routes.js";
import sedesRoutes from "./modules/sedes/sedes.routes.js";
import movimientoRoutes from "./modules/movimiento/movimiento.routes.js";
import clientesRoutes from "./modules/clientes/clientes.routes.js";
import proveedorProductoRoutes from "./modules/proveedores/proveedorProducto/proveedorProducto.routes.js";
import proveedoresRoutes from "./modules/proveedores/proveedores.routes.js";
import tiposProveedorRoutes from "./modules/tipos/tiposProveedor/tiposProveedor.routes.js";
import ciudadesRoutes from "./modules/ciudades/ciudades.routes.js";
import abonosRoutes from "./modules/abonos/abonos.routes.js";
import facturasProveedorRoutes from "./modules/facturas/proveedor/facturasProveedores.routes.js";
import ordenesCompraRoutes from "./modules/ordenesCompra/ordenesCompra.routes.js";
import empleadosRoutes from "./modules/empleados/empleados.routes.js";
import tiposDocumentoRoutes from "./modules/tipos/tiposDocumento/tiposDocumento.routes.js";
import tiposUsuarioRoutes from "./modules/tipos/tiposUsuario/tiposUsuario.routes.js";
import tipoclienteRoutes from "./modules/tipos/tiposCliente/tiposCliente.routes.js";
import metodoPagoRoutes from "./modules/metodosPago/metodosPago.routes.js";
import tipoMetodoPagoRoutes from "./modules/tipos/tiposMetodoPago/tiposMetodoPago.routes.js";
import facturaElectronicaRoutes from "./modules/facturas/electronica/facturaElectronica.routes.js";
import facturaRoutes from "./modules/facturas/factura.routes.js";
import servicioTecnicoRoutes from "./modules/servicioTecnico/servicioTecnico.routes.js";
import usuarioRoutes from "./modules/usuario/usuario.routes.js";
import estadisticasRoutes from "./modules/estadisticas/estadisticas.routes.js";
import notificacionesRoutes from "./modules/notificaciones/notificaciones.routes.js";
import reportesRoutes from "./modules/reportes/reportes.routes.js";
import auditoriaRoutes from "./modules/auditoria/auditoria.routes.js";

const app = express();

// Configuración de CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://cimove-frontend.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor corriendo correctamente 🚀");
});

// Rutas de la API
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
app.use("/api/usuario", usuarioRoutes);
app.use("/api/estadisticas", estadisticasRoutes);
app.use("/api/notificaciones", notificacionesRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/auditoria", auditoriaRoutes);

// Puerto
const port = process.env.PORT || PORT;
app.listen(port, () => {
  console.log("Servidor corriendo en el puerto ${port}");
});
