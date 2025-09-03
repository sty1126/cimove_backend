import { pool } from "../../../db.js";  

/**
 * Obtiene productos con bajo stock que necesitan reposición
 * @param {number} limite - Cantidad de registros a retornar
 */
export const obtenerProductosBajoStock = async (limite = 20) => {
  const query = `
    SELECT 
      p.id_producto,
      p.nombre_producto,
      c.descripcion_categoria AS categoria,
      il.existencia_inventariolocal AS stock_actual,
      il.stockminimo_inventariolocal AS stock_minimo,
      il.stockmaximo_inventariolocal AS stock_maximo,
      s.nombre_sede,
      CASE
        WHEN il.existencia_inventariolocal = 0 THEN 'Sin stock'
        WHEN il.existencia_inventariolocal < il.stockminimo_inventariolocal THEN 'Bajo'
        ELSE 'Normal'
      END AS nivel_stock,
      CASE
        WHEN il.existencia_inventariolocal = 0 THEN 0
        WHEN il.stockminimo_inventariolocal > 0 THEN 
          ROUND((il.existencia_inventariolocal * 100.0) / il.stockminimo_inventariolocal, 2)
        ELSE 100
      END AS porcentaje_stock,
      il.stockminimo_inventariolocal - il.existencia_inventariolocal AS unidades_faltantes,
      p.precioventaact_producto * (il.stockminimo_inventariolocal - il.existencia_inventariolocal) AS valor_reposicion
    FROM inventariolocal il
    JOIN producto p ON il.id_producto_inventariolocal = p.id_producto
    JOIN categoria c ON p.id_categoria_producto = c.id_categoria
    JOIN sede s ON il.id_sede_inventariolocal = s.id_sede
    WHERE il.existencia_inventariolocal < il.stockminimo_inventariolocal
      AND il.estado_inventariolocal = 'A'
      AND p.estado_producto = 'A'
    ORDER BY porcentaje_stock ASC, valor_reposicion DESC
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limite]);
  return result.rows;
};


/**
 * Obtiene datos históricos de ventas de un producto específico
 * @param {number} idProducto - ID del producto a consultar
 * @param {Date} fechaInicio - Fecha de inicio para el filtro
 * @param {Date} fechaFin - Fecha de fin para el filtro
 */
export const obtenerHistoricoVentasProducto = async (idProducto, fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      f.fecha_factura::date AS fecha,
      SUM(df.cantvendida_detallefactura) AS cantidad_vendida,
      SUM(df.cantvendida_detallefactura * df.precioventa_detallefactura) AS total_ventas,
      ROUND(AVG(df.precioventa_detallefactura), 2) AS precio_promedio
    FROM detallefactura df
    JOIN factura f ON df.id_factura_detallefactura = f.id_factura
    WHERE df.id_producto_detallefactura = $1
      AND f.fecha_factura BETWEEN $2 AND $3
      AND f.estado_factura = 'A'
      AND df.estado_detallefactura = 'A'
    GROUP BY f.fecha_factura::date
    ORDER BY fecha
  `;
  
  const result = await pool.query(query, [idProducto, fechaInicio, fechaFin]);
  return result.rows;
};

/**
 * Obtiene los productos más vendidos por unidades o por monto
 * @param {Date} fechaInicio - Fecha de inicio para el filtro
 * @param {Date} fechaFin - Fecha de fin para el filtro
 * @param {string} ordenarPor - Campo por el cual ordenar ('unidades' o 'monto')
 * @param {number} limite - Cantidad de registros a retornar
 */
export const obtenerProductosMasVendidos = async (fechaInicio, fechaFin, ordenarPor = 'unidades', limite = 10) => {
  let ordenamiento;
  
  switch (ordenarPor.toLowerCase()) {
    case 'unidades':
      ordenamiento = 'total_unidades DESC';
      break;
    case 'monto':
      ordenamiento = 'total_ventas DESC';
      break;
    default:
      ordenamiento = 'total_unidades DESC';
  }
  
  const query = `
    SELECT 
      p.id_producto,
      p.nombre_producto,
      c.descripcion_categoria AS categoria,
      SUM(df.cantvendida_detallefactura) AS total_unidades,
      SUM(df.cantvendida_detallefactura * df.precioventa_detallefactura) AS total_ventas,
      ROUND(AVG(df.precioventa_detallefactura), 2) AS precio_promedio,
      COUNT(DISTINCT f.id_factura) AS numero_transacciones,
      ROUND(SUM(df.cantvendida_detallefactura * (df.precioventa_detallefactura - p.costoventa_producto)), 2) AS margen_bruto,
      CASE 
        WHEN SUM(df.cantvendida_detallefactura * df.precioventa_detallefactura) > 0 THEN
          ROUND((SUM(df.cantvendida_detallefactura * (df.precioventa_detallefactura - p.costoventa_producto)) * 100.0) / 
            SUM(df.cantvendida_detallefactura * df.precioventa_detallefactura), 2)
        ELSE 0
      END AS porcentaje_margen
    FROM detallefactura df
    JOIN factura f ON df.id_factura_detallefactura = f.id_factura
    JOIN producto p ON df.id_producto_detallefactura = p.id_producto
    JOIN categoria c ON p.id_categoria_producto = c.id_categoria
    WHERE f.fecha_factura BETWEEN $1 AND $2
      AND f.estado_factura = 'A'
      AND df.estado_detallefactura = 'A'
      AND p.estado_producto = 'A'
    GROUP BY p.id_producto, p.nombre_producto, c.descripcion_categoria
    ORDER BY ${ordenamiento}
    LIMIT $3
  `;
  
  const result = await pool.query(query, [fechaInicio, fechaFin, limite]);
  return result.rows;
};

// En tu controlador de estadísticas
export const obtenerProductosMasVendidosPorSede = async (fechaInicio, fechaFin, idSede, limite = 10) => {
    const query = `
      WITH ranking AS (
        SELECT 
          s.id_sede,
          s.nombre_sede,
          p.id_producto,
          p.nombre_producto,
          c.descripcion_categoria AS categoria,
          SUM(df.cantvendida_detallefactura) AS total_unidades,
          SUM(df.cantvendida_detallefactura * df.precioventa_detallefactura) AS total_ventas,
          AVG(df.precioventa_detallefactura) AS precio_promedio,
          COUNT(DISTINCT f.id_factura) AS numero_transacciones,
          SUM((df.precioventa_detallefactura - p.costoventa_producto) * df.cantvendida_detallefactura) AS margen_bruto,
          ROUND(
            100 * SUM((df.precioventa_detallefactura - p.costoventa_producto) * df.cantvendida_detallefactura) /
            NULLIF(SUM(df.cantvendida_detallefactura * df.precioventa_detallefactura),0), 
          2) AS porcentaje_margen,
          ROW_NUMBER() OVER (
            PARTITION BY s.id_sede 
            ORDER BY SUM(df.cantvendida_detallefactura) DESC
          ) AS pos
        FROM 
          detallefactura df
        JOIN 
          factura f ON df.id_factura_detallefactura = f.id_factura
        JOIN 
          producto p ON df.id_producto_detallefactura = p.id_producto
        JOIN 
          categoria c ON p.id_categoria_producto = c.id_categoria
        JOIN 
          sede s ON f.id_sede_factura = s.id_sede
        WHERE 
          df.estado_detallefactura = 'A'
          AND f.estado_factura = 'A'
          AND f.fecha_factura BETWEEN $1 AND $2
          ${idSede ? 'AND s.id_sede = $3' : ''}
        GROUP BY 
          s.id_sede, s.nombre_sede, p.id_producto, p.nombre_producto, c.descripcion_categoria
      )
      SELECT *
      FROM ranking
      WHERE pos <= $${idSede ? '4' : '3'}
      ORDER BY id_sede, pos;
    `;

    const params = idSede 
      ? [fechaInicio, fechaFin, idSede, limite]
      : [fechaInicio, fechaFin, limite];

    const result = await pool.query(query, params);
    return result.rows;
  
};

