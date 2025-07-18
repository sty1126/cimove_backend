import * as categoriaRepo from "./categoria.repository.js";

export const getCategorias = () => categoriaRepo.obtenerCategoriasActivas();

export const createCategoria = async ({ descripcion_categoria }) => {
  if (!descripcion_categoria) {
    throw new Error("La descripción de la categoría es obligatoria");
  }
  return await categoriaRepo.insertarCategoria(descripcion_categoria);
};
