import {
  getTopProductosPorCantidad,
  getTopProductosPorValor,
  getProductosMasFrecuentes,
  getStockVsVentas,
  getProductosBajoStockAltaDemanda,
  getProductosObsoletos,
  getTopClientesPorMonto,
  getTopClientesPorCantidad,
  getTopClientesPorFrecuencia,
  getClientesFrecuentesVsEsporadicos,
  getClientesConPagosPendientes,
  getIngresosPorDia,
  getIngresosPorMes,
  getIngresosPorAnio,
  getTotalFacturado,
  getTotalPagado,
  getIngresosPorMetodoPago,
  getComparacionFacturadoRecibido,
  getVentasPorSede,
  getPagosProveedoresTotales,
  getPagosPorProveedor,
  getPagosProveedoresPorMes,
  getNominaPorSedeYRol,
  getVentasPorSedePorAnio,
  getVentasPorSedePorMes,
  getVentasPorSedePorDia,
} from "../../modules/estadisticas/estadisticas.controllers.js";

// Mock de pool
const mockPool = {
  query: async (sql, params) => {
      // Mock para getTopProductosPorCantidad
      if (sql.includes("ORDER BY total_vendido DESC")) {
          return { rows: [{ nombre_producto: 'Producto A', total_vendido: 100 }] };
      }
      // Mock para getTopProductosPorValor
      if (sql.includes("ORDER BY total_valor DESC")) {
          return { rows: [{ nombre_producto: 'Producto X', total_valor: 1000 }] };
      }
      // Mock para getProductosMasFrecuentes
      if (sql.includes("ORDER BY frecuencia_venta DESC")) {
          return { rows: [{ nombre_producto: 'Producto 1', frecuencia_venta: 50 }] };
      }
      // Mock para getStockVsVentas
      if (sql.includes("ORDER BY total_vendido DESC") && sql.includes("EXISTENCIA_INVENTARIOLOCAL")) {
          return { rows: [{ nombre_producto: 'Producto A', stock_actual: 10, total_vendido: 5 }] };
      }
      // Mock para getProductosBajoStockAltaDemanda
      if (sql.includes("HAVING P.stock_producto <")) {
          return { rows: [{ nombre_producto: 'Producto X', stock_producto: 5, total_vendido: 25 }] };
      }
      // Mock para getProductosObsoletos
      if (sql.includes("ORDER BY total_vendido ASC")) {
          return { rows: [{ nombre_producto: 'Producto 1', total_vendido: 5 }] };
      }
      // Mock para getTopClientesPorMonto
      if (sql.includes("ORDER BY total_compras DESC")) {
          return { rows: [{ nombre_cliente: 'Cliente A', total_compras: 1000 }] };
      }
      // Mock para getTopClientesPorCantidad
      if (sql.includes("ORDER BY cantidad_compras DESC")) {
          return { rows: [{ nombre_cliente: 'Cliente X', cantidad_compras: 10 }] };
      }
      // Mock para getTopClientesPorFrecuencia
      if (sql.includes("ORDER BY dias_con_compra DESC")) {
          return { rows: [{ nombre_cliente: 'Cliente 1', dias_con_compra: 5 }] };
      }
      // Mock para getClientesFrecuentesVsEsporadicos
      if (sql.includes("CASE WHEN COUNT(DISTINCT DATE(F.FECHA_FACTURA))")) {
          return { rows: [{ nombre_cliente: 'Cliente A', dias_con_compra: 6, tipo_cliente: 'Frecuente' }] };
      }
      // Mock para getClientesConPagosPendientes
      if (sql.includes("WHERE F.SALDO_FACTURA > 0")) {
          return { rows: [{ nombre_cliente: 'Cliente X', facturas_pendientes: 2, total_pendiente: 200 }] };
      }
      // Mock para getIngresosPorDia
      if (sql.includes("GROUP BY fecha") && sql.includes("FECHA_FACTURA >= CURRENT_DATE")) {
          return { rows: [{ fecha: '2024-01-01', total: 1000 }] };
      }
      // Mock para getIngresosPorMes
      if (sql.includes("GROUP BY mes") && sql.includes("FECHA_FACTURA >= DATE_TRUNC('month'")) {
          return { rows: [{ mes: '2024-01-01T00:00:00.000Z', total: 10000 }] };
      }
      // Mock para getIngresosPorAnio
      if (sql.includes("GROUP BY año") && sql.includes("FECHA_FACTURA >= DATE_TRUNC('year'")) {
          return { rows: [{ año: '2023-01-01T00:00:00.000Z', total: 100000 }] };
      }
      // Mock para getTotalFacturado
      if (sql.includes("SELECT SUM(TOTAL_FACTURA) FROM FACTURA")) {
          return { rows: [{ total_facturado: 1000000 }] };
      }
      // Mock para getTotalPagado
      if (sql.includes("SELECT TMP.NOMBRE_TIPOMETODOPAGO AS metodo_pago")) {
          return { rows: [{ metodo_pago: 'Efectivo', total_pagado: 500000 }] };
      }
      // Mock para getIngresosPorMetodoPago
      if (sql.includes("SELECT TMP.NOMBRE_TIPOMETODOPAGO AS metodo")) {
          return { rows: [{ metodo: 'Tarjeta de Crédito', total: 300000 }] };
      }
      // Mock para getComparacionFacturadoRecibido
      if (sql.includes("SELECT (SELECT SUM(TOTAL_FACTURA) FROM FACTURA) AS total_facturado")) {
          return { rows: [{ total_facturado: 1000000, total_recibido: 900000 }] };
      }
      // Mock para getVentasPorSede
      if (sql.includes("GROUP BY S.NOMBRE_SEDE") && sql.includes("SUM(F.TOTAL_FACTURA) AS total_ventas")) {
          return { rows: [{ nombre_sede: 'Sede Principal', total_ventas: 500000 }] };
      }
      // Mock para getPagosProveedoresTotales
      if (sql.includes("SELECT SUM(MONTO_ABONOFACTURA) AS total_pagado_proveedores")) {
          return { rows: [{ total_pagado_proveedores: 200000 }] };
      }
      // Mock para getPagosPorProveedor
      if (sql.includes("GROUP BY P.NOMBRE_PROVEEDOR") && sql.includes("SUM(A.MONTO_ABONOFACTURA) AS total_pagado")) {
          return { rows: [{ nombre_proveedor: 'Proveedor XYZ', total_pagado: 150000 }] };
      }
      // Mock para getPagosProveedoresPorMes
      if (sql.includes("GROUP BY mes") && sql.includes("FROM ABONOFACTURA")) {
          return { rows: [{ mes: '2024-01-01T00:00:00.000Z', total: 50000 }] };
      }
      // Mock para getNominaPorSedeYRol
      if (sql.includes("GROUP BY S.NOMBRE_SEDE, TU.DESCRIPCION_TIPOUSUARIO")) {
          return { rows: [{ nombre_sede: 'Sede A', rol: 'Vendedor', total: 30000 }] };
      }
      // Mock para getVentasPorSedePorAnio
      if (sql.includes("GROUP BY S.NOMBRE_SEDE, anio")) {
          return { rows: [{ nombre_sede: 'Sede Principal', anio: 2024, total_ventas: 600000 }] };
      }
      // Mock para getVentasPorSedePorMes
      if (sql.includes("GROUP BY S.NOMBRE_SEDE, mes")) {
          return { rows: [{ nombre_sede: 'Sede Principal', mes: '2024-05', total_ventas: 55000 }] };
      }
      // Mock para getVentasPorSedePorDia
      if (sql.includes("GROUP BY S.NOMBRE_SEDE, dia")) {
          return { rows: [{ nombre_sede: 'Sede Principal', dia: '2025-05-04', total_ventas: 15000 }] };
      }
      return { rows: [] };
  },
};

// Mock de res
const createMockRes = () => {
  return {
      statusCode: 200,
      data: null,
      status(code) {
          this.statusCode = code;
          return this;
      },
      json(payload) {
          this.data = payload;
      },
  };
};

// Mock de req sin parámetros
const createMockReq = (params = {}) => ({ params });

async function runTests() {
  // Simular pool
  global.pool = mockPool;

  // Test getTopProductosPorCantidad
  const resTopProductosCantidad = createMockRes();
  await getTopProductosPorCantidad({}, resTopProductosCantidad);
  console.log("getTopProductosPorCantidad →", resTopProductosCantidad.data);

  // Test getTopProductosPorValor
  const resTopProductosValor = createMockRes();
  await getTopProductosPorValor({}, resTopProductosValor);
  console.log("getTopProductosPorValor →", resTopProductosValor.data);

  // Test getProductosMasFrecuentes
  const resProductosMasFrecuentes = createMockRes();
  await getProductosMasFrecuentes({}, resProductosMasFrecuentes);
  console.log("getProductosMasFrecuentes →", resProductosMasFrecuentes.data);

  // Test getStockVsVentas
  const resStockVsVentas = createMockRes();
  await getStockVsVentas({}, resStockVsVentas);
  console.log("getStockVsVentas →", resStockVsVentas.data);

  /* Test getProductosBajoStockAltaDemanda
  const resProductosBajoStockAltaDemanda = createMockRes();
  await getProductosBajoStockAltaDemanda({}, resProductosBajoStockAltaDemanda);
  console.log("getProductosBajoStockAltaDemanda →", resProductosBajoStockAltaDemanda.data);
  */

  // Test getProductosObsoletos
  const resProductosObsoletos = createMockRes();
  await getProductosObsoletos({}, resProductosObsoletos);
  console.log("getProductosObsoletos →", resProductosObsoletos.data);

  // Test getTopClientesPorMonto
  const resTopClientesPorMonto = createMockRes();
  await getTopClientesPorMonto({}, resTopClientesPorMonto);
  console.log("getTopClientesPorMonto →", resTopClientesPorMonto.data);

  // Test getTopClientesPorCantidad
  const resTopClientesPorCantidad = createMockRes();
  await getTopClientesPorCantidad({}, resTopClientesPorCantidad);
  console.log("getTopClientesPorCantidad →", resTopClientesPorCantidad.data);

  // Test getTopClientesPorFrecuencia
  const resTopClientesPorFrecuencia = createMockRes();
  await getTopClientesPorFrecuencia({}, resTopClientesPorFrecuencia);
  console.log("getTopClientesPorFrecuencia →", resTopClientesPorFrecuencia.data);

  // Test getClientesFrecuentesVsEsporadicos
  const resClientesFrecuentesVsEsporadicos = createMockRes();
  await getClientesFrecuentesVsEsporadicos({}, resClientesFrecuentesVsEsporadicos);
  console.log("getClientesFrecuentesVsEsporadicos →", resClientesFrecuentesVsEsporadicos.data);

  // Test getClientesConPagosPendientes
  const resClientesConPagosPendientes = createMockRes();
  await getClientesConPagosPendientes({}, resClientesConPagosPendientes);
  console.log("getClientesConPagosPendientes →", resClientesConPagosPendientes.data);

  // Test getIngresosPorDia
  const resIngresosPorDia = createMockRes();
  await getIngresosPorDia({}, resIngresosPorDia);
  console.log("getIngresosPorDia →", resIngresosPorDia.data);

  // Test getIngresosPorMes
  const resIngresosPorMes = createMockRes();
  await getIngresosPorMes({}, resIngresosPorMes);
  console.log("getIngresosPorMes →", resIngresosPorMes.data);

  // Test getIngresosPorAnio
  const resIngresosPorAnio = createMockRes();
  await getIngresosPorAnio({}, resIngresosPorAnio);
  console.log("getIngresosPorAnio →", resIngresosPorAnio.data);

  // Test getTotalFacturado
  const resTotalFacturado = createMockRes();
  await getTotalFacturado({}, resTotalFacturado);
  console.log("getTotalFacturado →", resTotalFacturado.data);

  // Test getTotalPagado
  const resTotalPagado = createMockRes();
  await getTotalPagado({}, resTotalPagado);
  console.log("getTotalPagado →", resTotalPagado.data);

  // Test getIngresosPorMetodoPago
  const resIngresosPorMetodoPago = createMockRes();
  await getIngresosPorMetodoPago({}, resIngresosPorMetodoPago);
  console.log("getIngresosPorMetodoPago →", resIngresosPorMetodoPago.data);

  // Test getComparacionFacturadoRecibido
  const resComparacionFacturadoRecibido = createMockRes();
  await getComparacionFacturadoRecibido({}, resComparacionFacturadoRecibido);
  console.log("getComparacionFacturadoRecibido →", resComparacionFacturadoRecibido.data);

  // Test getVentasPorSede
  const resVentasPorSede = createMockRes();
  await getVentasPorSede({}, resVentasPorSede);
  console.log("getVentasPorSede →", resVentasPorSede.data);

  /* Test getPagosProveedoresTotales
  const resPagosProveedoresTotales = createMockRes();
  await getPagosProveedoresTotales({}, resPagosProveedoresTotales);
  console.log("getPagosProveedoresTotales →", resPagosProveedoresTotales.data);
  

  // Test getPagosPorProveedor
  const resPagosPorProveedor = createMockRes();
  await getPagosPorProveedor({}, resPagosPorProveedor);
  console.log("getPagosPorProveedor →", resPagosPorProveedor.data);
  */

  
  // Test getPagosProveedoresPorMes
  const resPagosProveedoresPorMes = createMockRes();
  await getPagosProveedoresPorMes({}, resPagosProveedoresPorMes);
  console.log("getPagosProveedoresPorMes →", resPagosProveedoresPorMes.data);

  // Test getNominaPorSedeYRol
  const resNominaPorSedeYRol = createMockRes();
  await getNominaPorSedeYRol({}, resNominaPorSedeYRol);
  console.log("getNominaPorSedeYRol →", resNominaPorSedeYRol.data);

  // Test getVentasPorSedePorAnio
  const resVentasPorSedePorAnio = createMockRes();
  await getVentasPorSedePorAnio({}, resVentasPorSedePorAnio);
  console.log("getVentasPorSedePorAnio →", resVentasPorSedePorAnio.data);

  // Test getVentasPorSedePorMes
  const resVentasPorSedePorMes = createMockRes();
  await getVentasPorSedePorMes({}, resVentasPorSedePorMes);
  console.log("getVentasPorSedePorMes →", resVentasPorSedePorMes.data);

  // Test getVentasPorSedePorDia
  const resVentasPorSedePorDia = createMockRes();
  await getVentasPorSedePorDia({}, resVentasPorSedePorDia);
  console.log("getVentasPorSedePorDia →", resVentasPorSedePorDia.data);
}

// Simulación de pool global
global.pool = { query: async () => ({ rows: [] }) };

runTests();