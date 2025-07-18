import * as categoriaService from "./categoria.service.js";

export const getCategoriasController = async (req, res) => {
  try {
    const categorias = await categoriaService.getCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createCategoriaController = async (req, res) => {
  try {
    const nueva = await categoriaService.createCategoria(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
