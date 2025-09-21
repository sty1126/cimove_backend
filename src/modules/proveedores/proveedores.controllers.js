import { ProveedoresService } from "./proveedores.service.js";

export const getProveedores = async (req, res) => {
  try {
    const proveedores = await ProveedoresService.obtenerTodos();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getProveedorById = async (req, res) => {
  try {
    const proveedor = await ProveedoresService.obtenerPorId(req.params.id);
    if (!proveedor) return res.status(404).json({ error: "Proveedor no encontrado" });
    res.json(proveedor);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTiposProveedores = async (req, res) => {
  try {
    const tipos = await ProveedoresService.obtenerTipos();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createTipoProveedor = async (req, res) => {
  try {
    const { nombre_tipoproveedor } = req.body;
    if (!nombre_tipoproveedor) {
      return res.status(400).json({ error: "El nombre del tipo es requerido" });
    }
    const tipo = await ProveedoresService.crearTipo(nombre_tipoproveedor);
    res.status(201).json(tipo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear tipo de proveedor" });
  }
};

export const createProveedor = async (req, res) => {
  try {
    const nuevoProveedor = await ProveedoresService.crearProveedor(req.body);
    res.status(201).json({ message: "Proveedor registrado con éxito", data: nuevoProveedor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProveedor = async (req, res) => {
  try {
    const actualizado = await ProveedoresService.actualizarProveedor(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: "Proveedor no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar proveedor" });
  }
};

export const deleteProveedor = async (req, res) => {
  try {
    const eliminado = await ProveedoresService.eliminarProveedor(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

