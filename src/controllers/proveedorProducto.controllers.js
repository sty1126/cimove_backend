import { pool } from "../db.js";

// Obtener proveedores asociados a un producto
export const getProveedoresByProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    const result = await pool.query(
      `SELECT pp.id_proveedorproducto, p.id_proveedor, p.nombre_proveedor 
       FROM PROVEEDORPRODUCTO pp
       JOIN PROVEEDOR p ON pp.id_proveedor_proveedorproducto = p.id_proveedor
       WHERE pp.id_producto_proveedorproducto = $1
         AND pp.estado_proveedorproducto = 'A'`,
      [id_producto]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener proveedores del producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Asociar un proveedor a un producto
export const asociarProveedorAProducto = async (req, res) => {
  try {
    const { id_proveedor_proveedorproducto, id_producto_proveedorproducto } =
      req.body;

    console.log("📩 Datos recibidos:", req.body);

    if (!id_proveedor_proveedorproducto || !id_producto_proveedorproducto) {
      console.error("Error: Faltan datos requeridos");
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const result = await pool.query(
      `INSERT INTO PROVEEDORPRODUCTO (id_proveedor_proveedorproducto, id_producto_proveedorproducto, estado_proveedorproducto)
       VALUES ($1, $2, 'A') RETURNING *`,
      [id_proveedor_proveedorproducto, id_producto_proveedorproducto]
    );

    console.log("✅ Inserción exitosa:", result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al asociar proveedor con producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Desasociar un proveedor de un producto
export const desasociarProveedorDeProducto = async (req, res) => {
  try {
    const { id_proveedorproducto } = req.params;

    const result = await pool.query(
      `UPDATE PROVEEDORPRODUCTO 
       SET estado_proveedorproducto = 'I' 
       WHERE id_proveedorproducto = $1 RETURNING *`,
      [id_proveedorproducto]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Asociación no encontrada" });
    }

    res.json({ message: "Proveedor desasociado correctamente" });
  } catch (error) {
    console.error("Error al desasociar proveedor del producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const getProveedoresByMultipleProductos = async (req, res) => {
  try {
    console.log("💡 Entró a getProveedoresByMultipleProductos");

    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ error: "Faltan los IDs de producto" });
    }

    // Parsear y filtrar IDs válidos
    const idList = ids
      .split(",")
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    if (idList.length === 0) {
      return res.status(400).json({ error: "IDs de producto inválidos" });
    }

    console.log("🧾 ID de productos:", idList);

    const result = await pool.query(
      `SELECT 
        pp.id_producto_proveedorproducto AS id_producto,
        p.id_proveedor,
        p.nombre_proveedor
       FROM proveedorproducto pp
       JOIN proveedor p ON p.id_proveedor = pp.id_proveedor_proveedorproducto
       WHERE pp.estado_proveedorproducto = 'A'
         AND pp.id_producto_proveedorproducto = ANY($1)`,
      [idList]
    );

    console.log("✅ Resultados de consulta:", result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener proveedores múltiples:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
